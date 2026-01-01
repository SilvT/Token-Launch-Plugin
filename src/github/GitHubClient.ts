/**
 * Token Launch - Figma Plugin for Design Token Automation
 * Copyright (c) 2026 Silvia Travieso
 * Licensed under the MIT License
 *
 * GitHub API Client for Figma Plugin
 *
 * Handles all GitHub API interactions within Figma's plugin environment.
 * Supports Personal Access Token authentication and provides methods
 * for repository operations, file management, and user authentication.
 */

import {
  GitHubCredentials,
  GitHubUser,
  GitHubRepository,
  GitHubFile,
  ConnectionTestResult,
  CreateFileRequest,
  UpdateFileRequest,
  TokenPushRequest,
  TokenPushResult,
  GitHubError
} from './GitHubTypes';

import { log as debugLog } from '../config/logging';

// =============================================================================
// GITHUB API CLIENT
// =============================================================================

export class GitHubClient {
  private baseUrl = 'https://api.github.com';
  private credentials: GitHubCredentials;
  private readonly clientId: string;

  constructor(credentials: GitHubCredentials) {
    // Generate unique ID for this client instance
    this.clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    debugLog.githubDebug('🔧 GitHubClient constructor - Creating new client with ID: ' + this.clientId);
    debugLog.githubDebug('🔧 GitHubClient constructor - Called with: ' + JSON.stringify({ token: credentials.token.substring(0, 10) + '...', username: credentials.username }));
    this.credentials = credentials;

    // Test arrow function methods immediately after assignment
    this.validateArrowFunctionMethods();

    debugLog.githubDebug('🔧 GitHubClient constructor - Completed initialization for client: ' + this.clientId);
  }

  /**
   * Custom base64 encoder for Figma plugin environment
   */
  private customBase64Encode(input: string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    let i = 0;

    while (i < input.length) {
      const a = input.charCodeAt(i++);
      const b = i < input.length ? input.charCodeAt(i++) : 0;
      const c = i < input.length ? input.charCodeAt(i++) : 0;

      const bitmap = (a << 16) | (b << 8) | c;

      result += chars.charAt((bitmap >> 18) & 63);
      result += chars.charAt((bitmap >> 12) & 63);
      result += chars.charAt((bitmap >> 6) & 63);
      result += chars.charAt(bitmap & 63);
    }

    // Add padding
    const padding = input.length % 3;
    if (padding === 1) {
      result = result.slice(0, -2) + '==';
    } else if (padding === 2) {
      result = result.slice(0, -1) + '=';
    }

    return result;
  }

  /**
   * Validate that arrow function methods are properly assigned
   */
  private validateArrowFunctionMethods(): void {
    debugLog.githubDebug('🔍 GitHubClient - Validating arrow function methods...');

    const arrowMethods = ['fileExists', 'createFile', 'updateFile', 'getFile', 'getRepository', 'testConnection', 'getUser'];

    for (const methodName of arrowMethods) {
      const method = (this as any)[methodName];
      const methodType = typeof method;

      debugLog.githubDebug(`  📋 ${methodName}: ${methodType}`);

      if (methodType !== 'function') {
        console.error(`  ❌ CRITICAL: ${methodName} is not a function! Type: ${methodType}`);
        continue;
      }

      try {
        // Check if it's an arrow function
        const methodSource = method.toString();
        const isArrowFunction = methodSource.includes('=>');
        const hasProperBinding = methodSource.includes('this.');

        debugLog.githubDebug(`    - Is arrow function: ${isArrowFunction}`);
        debugLog.githubDebug(`    - Has 'this' reference: ${hasProperBinding}`);
        debugLog.githubDebug(`    - Method length: ${method.length} parameters`);

        // Test that the method can be called (with wrong args to avoid actual API calls)
        const canBeCalled = typeof method.call === 'function';
        debugLog.githubDebug(`    - Can be called: ${canBeCalled}`);

        if (isArrowFunction && hasProperBinding) {
          debugLog.githubDebug(`    ✅ ${methodName} appears correctly configured as arrow function`);
        } else {
          console.warn(`    ⚠️ ${methodName} may have binding issues`);
        }

      } catch (error) {
        console.error(`    ❌ Error inspecting ${methodName}:`, error);
      }
    }

    debugLog.githubDebug('✅ Arrow function method validation completed');
  }

  /**
   * Get client ID for debugging
   */
  getClientId(): string {
    return this.clientId;
  }

  /**
   * Make authenticated request to GitHub API
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders = {
      'Authorization': `Bearer ${this.credentials.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Figma-Design-System-Distributor/1.0.0',
      'Content-Type': 'application/json'
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    };

    // Enhanced logging for testing
    debugLog.githubDebug(`🌐 GitHub API Request: ${options.method || 'GET'} ${url}`);
    debugLog.githubDebug(`🔑 Token: ${this.credentials.token.substring(0, 10)}...`);

    try {
      const response = await fetch(url, config);

      debugLog.githubDebug(`📡 GitHub API Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        await this.handleApiError(response);
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        debugLog.githubDebug('✅ GitHub API: No content response (success)');
        return {} as T;
      }

      const data = await response.json();
      debugLog.githubDebug(`✅ GitHub API: Response received (${JSON.stringify(data).length} chars)`);
      return data as T;
    } catch (error) {
      console.error('❌ GitHub API Request failed:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`GitHub API request failed: ${String(error)}`);
    }
  }

  /**
   * Handle GitHub API errors with detailed messaging
   */
  private async handleApiError(response: Response): Promise<never> {
    let errorData: GitHubError;

    try {
      errorData = await response.json();
    } catch {
      errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
    }

    let errorMessage = errorData.message || 'Unknown GitHub API error';

    // Enhance error messages based on status codes
    switch (response.status) {
      case 401:
        errorMessage = 'Invalid GitHub token. Please check your Personal Access Token.';
        break;
      case 403:
        if (errorMessage.includes('rate limit')) {
          errorMessage = 'GitHub API rate limit exceeded. Please try again later.';
        } else {
          errorMessage = 'Insufficient permissions. Please check your token permissions and repository access.';
        }
        break;
      case 404:
        errorMessage = 'Repository not found or you don\'t have access to it.';
        break;
      case 422:
        errorMessage = `Validation failed: ${errorData.message}`;
        if (errorData.errors) {
          const details = errorData.errors.map(e => `${e.field}: ${e.code}`).join(', ');
          errorMessage += ` (${details})`;
        }
        break;
    }

    const error = new Error(errorMessage);
    (error as any).status = response.status;
    (error as any).githubError = errorData;
    throw error;
  }

  // =============================================================================
  // AUTHENTICATION & USER INFO
  // =============================================================================

  /**
   * Get authenticated user information
   */
  getUser = async (): Promise<GitHubUser> => {
    return this.makeRequest<GitHubUser>('/user');
  }

  /**
   * Test connection and get comprehensive status
   * Using arrow function to preserve context through minification
   */
  testConnection = async (repositoryConfig?: { owner: string; name: string }): Promise<ConnectionTestResult> => {
    try {
      // Test basic authentication
      const user = await this.getUser();

      const result: ConnectionTestResult = {
        success: true,
        user,
        permissions: {
          canRead: true,
          canWrite: false,
          canAdmin: false
        }
      };

      // Test repository access if provided
      if (repositoryConfig) {
        try {
          const repository = await this.getRepository(repositoryConfig.owner, repositoryConfig.name);

          result.repository = repository;
          result.permissions = {
            canRead: true,
            canWrite: repository.permissions?.push || false,
            canAdmin: repository.permissions?.admin || false
          };
        } catch (repoError) {
          result.success = false;
          result.error = repoError instanceof Error ? repoError.message : 'Repository access failed';
        }
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection test failed',
        permissions: {
          canRead: false,
          canWrite: false,
          canAdmin: false
        }
      };
    }
  }

  // =============================================================================
  // REPOSITORY OPERATIONS
  // =============================================================================

  /**
   * Get repository information
   */
  getRepository = async (owner: string, repo: string): Promise<GitHubRepository> => {
    return this.makeRequest<GitHubRepository>(`/repos/${owner}/${repo}`);
  }

  /**
   * List user's repositories
   */
  async listRepositories(options: {
    type?: 'owner' | 'collaborator' | 'organization_member';
    sort?: 'created' | 'updated' | 'pushed' | 'full_name';
    per_page?: number;
  } = {}): Promise<GitHubRepository[]> {
    // Build query string manually (URLSearchParams not available in Figma)
    const queryParts: string[] = [];

    if (options.type) queryParts.push(`type=${encodeURIComponent(options.type)}`);
    if (options.sort) queryParts.push(`sort=${encodeURIComponent(options.sort)}`);
    if (options.per_page) queryParts.push(`per_page=${encodeURIComponent(options.per_page.toString())}`);

    const queryString = queryParts.join('&');
    const endpoint = `/user/repos${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<GitHubRepository[]>(endpoint);
  }

  // =============================================================================
  // FILE OPERATIONS
  // =============================================================================

  /**
   * Get file contents from repository
   * Using arrow function to preserve context through minification
   */
  getFile = async (owner: string, repo: string, path: string, ref?: string): Promise<GitHubFile> => {
    const params = ref ? `?ref=${encodeURIComponent(ref)}` : '';
    return this.makeRequest<GitHubFile>(`/repos/${owner}/${repo}/contents/${path}${params}`);
  }

  /**
   * Create a new file in repository
   * Using arrow function to preserve context through minification
   */
  createFile = async (
    owner: string,
    repo: string,
    path: string,
    request: CreateFileRequest
  ): Promise<{ content: GitHubFile; commit: any }> => {
    debugLog.githubDebug(`🔧 [${this.clientId}] createFile called - owner: ${owner}, repo: ${repo}, path: ${path}`);
    debugLog.githubDebug(`🔧 [${this.clientId}] createFile - 'this' context: ${!!this}, clientId: ${this.clientId}`);
    debugLog.githubDebug(`🔧 [${this.clientId}] createFile - request keys: ${Object.keys(request).join(', ')}`);

    try {
      const result = await this.makeRequest<{ content: GitHubFile; commit: any }>(`/repos/${owner}/${repo}/contents/${path}`, {
        method: 'PUT',
        body: JSON.stringify(request)
      });
      debugLog.githubDebug(`✅ [${this.clientId}] createFile - success, commit SHA: ${result.commit?.sha}`);
      return result;
    } catch (error) {
      console.error(`❌ [${this.clientId}] createFile - failed:`, error);
      throw error;
    }
  }

  /**
   * Update existing file in repository
   * Using arrow function to preserve context through minification
   */
  updateFile = async (
    owner: string,
    repo: string,
    path: string,
    request: UpdateFileRequest
  ): Promise<{ content: GitHubFile; commit: any }> => {
    return this.makeRequest<{ content: GitHubFile; commit: any }>(`/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify(request)
    });
  }

  /**
   * Check if file exists in repository
   * Using arrow function to preserve context through minification
   */
  fileExists = async (owner: string, repo: string, path: string): Promise<boolean> => {
    debugLog.githubDebug(`🔧 [${this.clientId}] fileExists called - owner: ${owner}, repo: ${repo}, path: ${path}`);
    debugLog.githubDebug(`🔧 [${this.clientId}] fileExists - 'this' context: ${!!this}, clientId: ${this.clientId}`);

    try {
      await this.getFile(owner, repo, path);
      debugLog.githubDebug(`✅ [${this.clientId}] fileExists - file found, returning true`);
      return true;
    } catch (error) {
      if ((error as any).status === 404) {
        debugLog.githubDebug(`📁 [${this.clientId}] fileExists - file not found (404), returning false`);
        return false;
      }
      console.error(`❌ [${this.clientId}] fileExists - unexpected error:`, error);
      throw error;
    }
  }

  // =============================================================================
  // TOKEN PUSH OPERATIONS
  // =============================================================================

  /**
   * Push design tokens to GitHub repository
   */
  async pushTokens(request: TokenPushRequest): Promise<TokenPushResult> {
    const { tokens, config, options = {} } = request;
    const { repository, paths } = config;

    try {
      const result: TokenPushResult = {
        success: false,
        filesCreated: [],
        filesUpdated: []
      };

      // Prepare file content
      const tokenContent = JSON.stringify(tokens, null, 2);
      const encodedContent = this.customBase64Encode(tokenContent);

      // Generate commit message
      const commitMessage = options.commitMessage ||
        `Update design tokens from Figma - ${new Date().toISOString().split('T')[0]}`;

      // Prepare file request
      const fileRequest: CreateFileRequest | UpdateFileRequest = {
        message: commitMessage,
        content: encodedContent,
        branch: options.branchName || repository.branch || 'main'
      };

      // Check if file exists
      const fileExists = await this.fileExists(repository.owner, repository.name, paths.rawTokens);

      if (fileExists) {
        // Update existing file
        const existingFile = await this.getFile(repository.owner, repository.name, paths.rawTokens);
        (fileRequest as UpdateFileRequest).sha = existingFile.sha;

        const updateResult = await this.updateFile(
          repository.owner,
          repository.name,
          paths.rawTokens,
          fileRequest as UpdateFileRequest
        );

        result.commitSha = updateResult.commit.sha;
        result.filesUpdated.push(paths.rawTokens);
      } else {
        // Create new file
        const createResult = await this.createFile(
          repository.owner,
          repository.name,
          paths.rawTokens,
          fileRequest
        );

        result.commitSha = createResult.commit.sha;
        result.filesCreated.push(paths.rawTokens);
      }

      result.success = true;
      return result;

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
  // GITHUB ACTIONS OPERATIONS
  // =============================================================================

  /**
   * Triggers a GitHub Actions workflow dispatch event
   * @param owner Repository owner
   * @param repo Repository name
   * @param workflowId Workflow file name (e.g., 'transform-tokens.yml')
   * @param ref Branch name to run workflow on
   * @param inputs Optional workflow inputs
   * @returns Promise<{success: boolean; error?: string}> - true if successful, false if failed
   */
  async triggerWorkflow(
    owner: string,
    repo: string,
    workflowId: string,
    ref: string,
    inputs?: Record<string, string>
  ): Promise<{ success: boolean; error?: string }> {
    debugLog.githubDebug(`🔧 [${this.clientId}] triggerWorkflow called - owner: ${owner}, repo: ${repo}, workflow: ${workflowId}, ref: ${ref}`);

    try {
      await this.makeRequest(`/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`, {
        method: 'POST',
        body: JSON.stringify({
          ref,
          inputs: inputs || {}
        })
      });

      debugLog.githubDebug(`✅ [${this.clientId}] triggerWorkflow - workflow triggered successfully`);
      return { success: true };
    } catch (error: any) {
      console.error(`❌ [${this.clientId}] triggerWorkflow - failed:`, error);

      // Handle specific error cases
      if (error.status === 404) {
        return {
          success: false,
          error: 'Workflow file not found. Please add the workflow to your repository.'
        };
      }
      if (error.status === 403) {
        return {
          success: false,
          error: 'Insufficient permissions. Token needs "actions:write" scope.'
        };
      }
      return {
        success: false,
        error: error.message || 'Failed to trigger workflow'
      };
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  /**
   * Validate token permissions
   */
  async validateTokenPermissions(): Promise<{
    valid: boolean;
    permissions: string[];
    user?: GitHubUser;
    error?: string;
  }> {
    try {
      const user = await this.getUser();

      // Try to get user repositories to test repo access
      await this.listRepositories({ per_page: 1 });

      return {
        valid: true,
        permissions: ['user', 'repo'], // Basic permissions we can verify
        user
      };
    } catch (error) {
      return {
        valid: false,
        permissions: [],
        error: error instanceof Error ? error.message : 'Token validation failed'
      };
    }
  }

  /**
   * Get rate limit information
   */
  async getRateLimit(): Promise<{
    limit: number;
    remaining: number;
    reset: number;
    used: number;
  }> {
    const response = await this.makeRequest<{
      rate: {
        limit: number;
        remaining: number;
        reset: number;
        used: number;
      };
    }>('/rate_limit');

    return response.rate;
  }
}