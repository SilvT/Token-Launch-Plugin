/**
 * Pull Request Service
 *
 * Handles GitHub Pull Request creation via the GitHub API.
 * Works with GitOperations to push to branches and create PRs.
 */

import { GitHubClientHybrid } from './GitHubClientHybrid';
import { GitHubAuth } from './GitHubAuth';
import { RepositoryConfig } from './GitOperations';
import { PRDetails } from '../ui/PRWorkflowUI';
import { ClientTracker } from '../debug/ClientTracker';

// =============================================================================
// TYPES
// =============================================================================

export interface CreatePullRequestRequest {
  title: string;
  head: string;      // Source branch
  base: string;      // Target branch (e.g., 'main')
  body?: string;
}

export interface PullRequestResponse {
  number: number;
  html_url: string;
  url: string;
  state: string;
  title: string;
  body: string;
  head: {
    ref: string;
  };
  base: {
    ref: string;
  };
}

export interface CreatePRResult {
  success: boolean;
  prNumber?: number;
  prUrl?: string;
  error?: string;
}

// =============================================================================
// PULL REQUEST SERVICE
// =============================================================================

export class PullRequestService {
  private auth: GitHubAuth;
  private client: GitHubClientHybrid | null = null;

  constructor() {
    this.auth = GitHubAuth.getInstance();
  }

  /**
   * Initialize the service
   */
  async initialize(): Promise<void> {
    await this.auth.initialize();
    if (this.auth.hasClient()) {
      this.client = this.auth.getClient();
    }
  }

  // =============================================================================
  // PULL REQUEST OPERATIONS
  // =============================================================================

  /**
   * Create a pull request
   */
  async createPullRequest(
    repository: RepositoryConfig,
    prDetails: PRDetails,
    baseBranch: string = 'main'
  ): Promise<CreatePRResult> {
    try {
      ClientTracker.log('PullRequestService.createPullRequest - Starting', {
        repository: `${repository.owner}/${repository.name}`,
        head: prDetails.branchName,
        base: baseBranch
      });

      if (!this.client) {
        throw new Error('GitHub client not initialized');
      }

      const request: CreatePullRequestRequest = {
        title: prDetails.prTitle || 'Update design tokens',
        head: prDetails.branchName,
        base: baseBranch,
        body: prDetails.prBody || ''
      };

      ClientTracker.log('PullRequestService.createPullRequest - Creating PR', request);
      console.log('📝 Creating pull request...');
      console.log('   Title:', request.title);
      console.log('   Head:', request.head);
      console.log('   Base:', request.base);

      const response = await this.makeGitHubAPICall<PullRequestResponse>(
        repository,
        'POST',
        '/pulls',
        request
      );

      ClientTracker.log('PullRequestService.createPullRequest - PR created successfully', {
        number: response.number,
        url: response.html_url
      });

      console.log(`✅ Pull request #${response.number} created successfully`);

      return {
        success: true,
        prNumber: response.number,
        prUrl: response.html_url
      };

    } catch (error) {
      ClientTracker.log('❌ PullRequestService.createPullRequest - Failed', error);
      console.error('❌ Failed to create pull request:', error);

      return {
        success: false,
        error: this.parseError(error)
      };
    }
  }

  /**
   * Check if a branch exists
   */
  async branchExists(
    repository: RepositoryConfig,
    branchName: string
  ): Promise<boolean> {
    try {
      await this.makeGitHubAPICall(
        repository,
        'GET',
        `/git/refs/heads/${branchName}`
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate unique branch name (append suffix if exists)
   */
  async generateUniqueBranchName(
    repository: RepositoryConfig,
    baseName: string
  ): Promise<string> {
    let branchName = baseName;
    let counter = 2;

    while (await this.branchExists(repository, branchName)) {
      branchName = `${baseName}-${counter}`;
      counter++;
    }

    return branchName;
  }

  // =============================================================================
  // GITHUB API HELPERS
  // =============================================================================

  /**
   * Make a GitHub API call
   */
  private async makeGitHubAPICall<T = any>(
    repository: RepositoryConfig,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    body?: any
  ): Promise<T> {
    if (!this.client) {
      throw new Error('GitHub client not initialized');
    }

    const token = this.auth.getState().config?.credentials?.token;
    if (!token) {
      throw new Error('GitHub token not available');
    }

    const url = `https://api.github.com/repos/${repository.owner}/${repository.name}${endpoint}`;

    ClientTracker.log(`PullRequestService.makeGitHubAPICall - ${method} ${endpoint}`, {
      url,
      hasBody: !!body
    });

    console.log(`🌐 GitHub API: ${method} ${endpoint}`);

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    };

    const options: RequestInit = {
      method,
      headers
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      ClientTracker.log(`❌ PullRequestService.makeGitHubAPICall - HTTP ${response.status}`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });

      throw new Error(`GitHub API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    ClientTracker.log(`✅ PullRequestService.makeGitHubAPICall - Success`, {
      status: response.status
    });

    return data as T;
  }

  // =============================================================================
  // ERROR HANDLING
  // =============================================================================

  /**
   * Parse error into user-friendly message
   */
  private parseError(error: any): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      // Network errors
      if (message.includes('network') || message.includes('fetch')) {
        return 'Network connection failed. Please check your internet connection.';
      }

      // Authentication errors
      if (message.includes('401') || message.includes('unauthorized')) {
        return 'Authentication failed. Please check your GitHub token.';
      }

      // Permission errors
      if (message.includes('403') || message.includes('forbidden')) {
        return 'Access denied. Please check repository permissions.';
      }

      // Repository not found
      if (message.includes('404') || message.includes('not found')) {
        return 'Repository or branch not found.';
      }

      // Validation errors
      if (message.includes('422') || message.includes('validation')) {
        return 'Validation failed. The branch may already have an open pull request.';
      }

      return error.message;
    }

    return 'An unknown error occurred while creating the pull request.';
  }

  // =============================================================================
  // STATUS
  // =============================================================================

  /**
   * Check if service is ready
   */
  isReady(): boolean {
    return this.client !== null && this.auth.hasClient();
  }

  /**
   * Get current repository
   */
  getCurrentRepository(): RepositoryConfig | null {
    const config = this.auth.getPublicConfig();
    if (!config?.repository) {
      return null;
    }

    return {
      owner: config.repository.owner,
      name: config.repository.name,
      branch: config.repository.branch || 'main'
    };
  }
}
