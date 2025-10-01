/**
 * GitHub Configuration Interface for Figma Plugin
 *
 * Provides the main interface for GitHub setup, connection testing,
 * and credential management within the Figma plugin environment.
 */

import { GitHubAuth } from './GitHubAuth';
import {
  GitHubConfig,
  ConnectionTestResult,
  GitHubConnectionStatus,
  TokenPushRequest,
  TokenPushResult
} from './GitHubTypes';

// =============================================================================
// CONFIGURATION INTERFACE
// =============================================================================

export class GitHubConfigManager {
  private auth: GitHubAuth;

  constructor() {
    this.auth = GitHubAuth.getInstance();
  }

  /**
   * Initialize GitHub configuration
   */
  async initialize(): Promise<void> {
    await this.auth.initialize();
  }

  // =============================================================================
  // SETUP & CONFIGURATION
  // =============================================================================

  /**
   * Setup GitHub integration with Personal Access Token
   */
  async setupGitHub(config: {
    token: string;
    repository: {
      owner: string;
      name: string;
      branch?: string;
    };
    paths?: {
      rawTokens?: string;
      processedTokens?: string;
    };
  }): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate inputs
      if (!config.token.trim()) {
        throw new Error('GitHub Personal Access Token is required');
      }

      if (!config.repository.owner.trim() || !config.repository.name.trim()) {
        throw new Error('Repository owner and name are required');
      }

      // Create full configuration
      const fullConfig: GitHubConfig = {
        credentials: {
          token: config.token.trim()
        },
        repository: {
          owner: config.repository.owner.trim(),
          name: config.repository.name.trim(),
          branch: config.repository.branch || 'main'
        },
        paths: {
          rawTokens: config.paths?.rawTokens || 'raw/figma-export.json',
          processedTokens: config.paths?.processedTokens || 'tokens/'
        },
        commitMessage: `Update design tokens from Figma - {{timestamp}}`
      };

      // Configure authentication
      const result = await this.auth.configure(fullConfig);

      if (result.success) {
        // Test connection immediately after setup
        const testResult = await this.testConnection();
        if (!testResult.success) {
          return {
            success: false,
            error: `Configuration saved but connection failed: ${testResult.error}`
          };
        }
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Setup failed'
      };
    }
  }

  /**
   * Update GitHub token
   */
  async updateToken(token: string): Promise<{ success: boolean; error?: string }> {
    return this.auth.updateToken(token);
  }

  /**
   * Update repository configuration
   */
  async updateRepository(repository: {
    owner: string;
    name: string;
    branch?: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const currentState = this.auth.getState();
      if (!currentState.config) {
        throw new Error('GitHub not configured');
      }

      const updatedConfig: GitHubConfig = {
        ...currentState.config,
        repository: {
          owner: repository.owner.trim(),
          name: repository.name.trim(),
          branch: repository.branch || 'main'
        }
      };

      return this.auth.configure(updatedConfig);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Repository update failed'
      };
    }
  }

  // =============================================================================
  // CONNECTION TESTING
  // =============================================================================

  /**
   * Test GitHub connection
   */
  async testConnection(): Promise<ConnectionTestResult> {
    return this.auth.testConnection();
  }

  /**
   * Validate credentials only (quick check)
   */
  async validateCredentials(): Promise<{ valid: boolean; error?: string }> {
    return this.auth.validateCredentials();
  }

  /**
   * Get detailed connection status
   */
  getConnectionStatus(): GitHubConnectionStatus {
    return this.auth.getConnectionStatus();
  }

  /**
   * Get connection status with user-friendly message
   */
  getConnectionStatusMessage(): { status: GitHubConnectionStatus; message: string } {
    const status = this.getConnectionStatus();

    const messages = {
      'not-configured': 'GitHub integration not set up. Please configure your GitHub credentials.',
      'testing': 'Testing connection to GitHub...',
      'connected': 'Successfully connected to GitHub repository.',
      'error': 'Connection failed. Please check your configuration.',
      'invalid-token': 'Invalid GitHub token. Please check your Personal Access Token.',
      'repository-not-found': 'Repository not found or access denied. Please check repository name and permissions.',
      'insufficient-permissions': 'Insufficient permissions. Please ensure your token has repository access.'
    };

    return {
      status,
      message: messages[status]
    };
  }

  // =============================================================================
  // REPOSITORY OPERATIONS
  // =============================================================================

  /**
   * List user's repositories
   */
  async listRepositories(): Promise<{ success: boolean; repositories?: any[]; error?: string }> {
    try {
      if (!this.auth.hasClient()) {
        throw new Error('GitHub not configured');
      }

      const repositories = await this.auth.listRepositories();
      return { success: true, repositories };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list repositories'
      };
    }
  }

  /**
   * Get repository information
   */
  async getRepositoryInfo(): Promise<{ success: boolean; repository?: any; error?: string }> {
    try {
      const repository = await this.auth.getRepositoryInfo();
      return { success: true, repository };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get repository info'
      };
    }
  }

  // =============================================================================
  // TOKEN PUSH OPERATIONS
  // =============================================================================

  /**
   * Push design tokens to GitHub
   */
  async pushTokens(
    tokens: any,
    options?: {
      commitMessage?: string;
      branchName?: string;
    }
  ): Promise<TokenPushResult> {
    try {
      if (!this.auth.hasClient()) {
        throw new Error('GitHub not configured');
      }

      const state = this.auth.getState();
      if (!state.config) {
        throw new Error('GitHub configuration not found');
      }

      if (!this.auth.canPushToRepository()) {
        throw new Error('Insufficient permissions to push to repository');
      }

      const client = this.auth.getClient();
      const request: TokenPushRequest = {
        tokens,
        config: state.config,
        options
      };

      return client.pushTokens(request);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to push tokens',
        filesCreated: [],
        filesUpdated: []
      };
    }
  }

  // =============================================================================
  // STATE & CONFIGURATION
  // =============================================================================

  /**
   * Check if GitHub is configured
   */
  isConfigured(): boolean {
    return this.auth.getState().isConfigured;
  }

  /**
   * Check if GitHub is connected
   */
  isConnected(): boolean {
    return this.auth.getState().isConnected;
  }

  /**
   * Get current configuration (public data only)
   */
  getConfiguration(): {
    isConfigured: boolean;
    isConnected: boolean;
    repository?: {
      owner: string;
      name: string;
      branch?: string;
    };
    paths?: {
      rawTokens: string;
      processedTokens: string;
    };
    lastTestResult?: ConnectionTestResult;
    errors: string[];
  } {
    const state = this.auth.getState();
    const publicConfig = this.auth.getPublicConfig();

    return {
      isConfigured: state.isConfigured,
      isConnected: state.isConnected,
      repository: publicConfig?.repository,
      paths: publicConfig?.paths,
      lastTestResult: state.lastTestResult,
      errors: state.errors
    };
  }

  /**
   * Clear GitHub configuration
   */
  async clearConfiguration(): Promise<void> {
    await this.auth.clearConfiguration();
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  /**
   * Generate Personal Access Token URL for GitHub
   */
  getTokenSetupUrl(): string {
    const scopes = ['repo'].join(',');
    const description = 'Figma Design System Distributor Plugin';

    return `https://github.com/settings/personal-access-tokens/new?description=${encodeURIComponent(description)}&scopes=${scopes}`;
  }

  /**
   * Validate GitHub repository URL format
   */
  static parseRepositoryUrl(url: string): { owner: string; name: string } | null {
    const patterns = [
      /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?(?:\/)?$/,
      /^git@github\.com:([^\/]+)\/([^\/]+)(?:\.git)?$/,
      /^([^\/]+)\/([^\/]+)$/
    ];

    for (const pattern of patterns) {
      const match = url.trim().match(pattern);
      if (match) {
        return {
          owner: match[1],
          name: match[2].replace(/\.git$/, '')
        };
      }
    }

    return null;
  }

  /**
   * Generate commit message with timestamp
   */
  static generateCommitMessage(template?: string): string {
    const timestamp = new Date().toISOString().split('T')[0];
    const defaultTemplate = `Update design tokens from Figma - {{timestamp}}`;

    return (template || defaultTemplate).replace('{{timestamp}}', timestamp);
  }
}