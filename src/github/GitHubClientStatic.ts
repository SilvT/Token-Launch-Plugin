/**
 * Static GitHub API Client for Figma Plugin
 *
 * This static implementation avoids method binding issues that occur
 * in the Figma plugin environment during minification and compilation.
 * All methods are static and don't rely on 'this' context.
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

// =============================================================================
// STATIC GITHUB API CLIENT
// =============================================================================

export class GitHubClientStatic {
  private static readonly baseUrl = 'https://api.github.com';

  /**
   * Custom base64 encoder for Figma plugin environment
   */
  private static customBase64Encode(input: string): string {
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
   * Make authenticated request to GitHub API
   */
  private static async makeRequest<T>(
    credentials: GitHubCredentials,
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${GitHubClientStatic.baseUrl}${endpoint}`;

    const defaultHeaders = {
      'Authorization': `Bearer ${credentials.token}`,
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

    console.log(`🌐 GitHubStatic API Request: ${options.method || 'GET'} ${url}`);
    console.log(`🔑 Token: ${credentials.token.substring(0, 10)}...`);

    try {
      const response = await fetch(url, config);

      console.log(`📡 GitHubStatic API Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        await GitHubClientStatic.handleApiError(response);
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        console.log('✅ GitHubStatic API: No content response (success)');
        return {} as T;
      }

      const data = await response.json();
      console.log(`✅ GitHubStatic API: Response received (${JSON.stringify(data).length} chars)`);
      return data as T;
    } catch (error) {
      console.error('❌ GitHubStatic API Request failed:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`GitHub API request failed: ${String(error)}`);
    }
  }

  /**
   * Handle GitHub API errors with detailed messaging
   */
  private static async handleApiError(response: Response): Promise<never> {
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
  static async getUser(credentials: GitHubCredentials): Promise<GitHubUser> {
    return GitHubClientStatic.makeRequest<GitHubUser>(credentials, '/user');
  }

  /**
   * Test connection and get comprehensive status
   */
  static async testConnection(
    credentials: GitHubCredentials,
    repositoryConfig?: { owner: string; name: string }
  ): Promise<ConnectionTestResult> {
    try {
      // Test basic authentication
      const user = await GitHubClientStatic.getUser(credentials);

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
          const repository = await GitHubClientStatic.getRepository(
            credentials,
            repositoryConfig.owner,
            repositoryConfig.name
          );

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
  static async getRepository(
    credentials: GitHubCredentials,
    owner: string,
    repo: string
  ): Promise<GitHubRepository> {
    return GitHubClientStatic.makeRequest<GitHubRepository>(credentials, `/repos/${owner}/${repo}`);
  }

  /**
   * List user's repositories
   */
  static async listRepositories(
    credentials: GitHubCredentials,
    options: {
      type?: 'owner' | 'collaborator' | 'organization_member';
      sort?: 'created' | 'updated' | 'pushed' | 'full_name';
      per_page?: number;
    } = {}
  ): Promise<GitHubRepository[]> {
    // Build query string manually (URLSearchParams not available in Figma)
    const queryParts: string[] = [];

    if (options.type) queryParts.push(`type=${encodeURIComponent(options.type)}`);
    if (options.sort) queryParts.push(`sort=${encodeURIComponent(options.sort)}`);
    if (options.per_page) queryParts.push(`per_page=${encodeURIComponent(options.per_page.toString())}`);

    const queryString = queryParts.join('&');
    const endpoint = `/user/repos${queryString ? `?${queryString}` : ''}`;

    return GitHubClientStatic.makeRequest<GitHubRepository[]>(credentials, endpoint);
  }

  // =============================================================================
  // FILE OPERATIONS
  // =============================================================================

  /**
   * Get file contents from repository
   */
  static async getFile(
    credentials: GitHubCredentials,
    owner: string,
    repo: string,
    path: string,
    ref?: string
  ): Promise<GitHubFile> {
    const params = ref ? `?ref=${encodeURIComponent(ref)}` : '';
    return GitHubClientStatic.makeRequest<GitHubFile>(credentials, `/repos/${owner}/${repo}/contents/${path}${params}`);
  }

  /**
   * Create a new file in repository
   */
  static async createFile(
    credentials: GitHubCredentials,
    owner: string,
    repo: string,
    path: string,
    request: CreateFileRequest
  ): Promise<{ content: GitHubFile; commit: any }> {
    console.log(`🔧 GitHubStatic.createFile - owner: ${owner}, repo: ${repo}, path: ${path}`);
    console.log(`🔧 GitHubStatic.createFile - request keys:`, Object.keys(request));

    try {
      const result = await GitHubClientStatic.makeRequest<{ content: GitHubFile; commit: any }>(
        credentials,
        `/repos/${owner}/${repo}/contents/${path}`,
        {
          method: 'PUT',
          body: JSON.stringify(request)
        }
      );
      console.log(`✅ GitHubStatic.createFile - success, commit SHA:`, result.commit?.sha);
      return result;
    } catch (error) {
      console.error(`❌ GitHubStatic.createFile - failed:`, error);
      throw error;
    }
  }

  /**
   * Update existing file in repository
   */
  static async updateFile(
    credentials: GitHubCredentials,
    owner: string,
    repo: string,
    path: string,
    request: UpdateFileRequest
  ): Promise<{ content: GitHubFile; commit: any }> {
    return GitHubClientStatic.makeRequest<{ content: GitHubFile; commit: any }>(
      credentials,
      `/repos/${owner}/${repo}/contents/${path}`,
      {
        method: 'PUT',
        body: JSON.stringify(request)
      }
    );
  }

  /**
   * Check if file exists in repository
   */
  static async fileExists(
    credentials: GitHubCredentials,
    owner: string,
    repo: string,
    path: string
  ): Promise<boolean> {
    console.log(`🔧 GitHubStatic.fileExists - owner: ${owner}, repo: ${repo}, path: ${path}`);

    try {
      await GitHubClientStatic.getFile(credentials, owner, repo, path);
      console.log(`✅ GitHubStatic.fileExists - file found, returning true`);
      return true;
    } catch (error) {
      if ((error as any).status === 404) {
        console.log(`📁 GitHubStatic.fileExists - file not found (404), returning false`);
        return false;
      }
      console.error(`❌ GitHubStatic.fileExists - unexpected error:`, error);
      throw error;
    }
  }

  // =============================================================================
  // TOKEN PUSH OPERATIONS
  // =============================================================================

  /**
   * Push design tokens to GitHub repository
   */
  static async pushTokens(
    credentials: GitHubCredentials,
    request: TokenPushRequest
  ): Promise<TokenPushResult> {
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
      const encodedContent = GitHubClientStatic.customBase64Encode(tokenContent);

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
      const fileExists = await GitHubClientStatic.fileExists(
        credentials,
        repository.owner,
        repository.name,
        paths.rawTokens
      );

      if (fileExists) {
        // Update existing file
        const existingFile = await GitHubClientStatic.getFile(
          credentials,
          repository.owner,
          repository.name,
          paths.rawTokens
        );
        (fileRequest as UpdateFileRequest).sha = existingFile.sha;

        const updateResult = await GitHubClientStatic.updateFile(
          credentials,
          repository.owner,
          repository.name,
          paths.rawTokens,
          fileRequest as UpdateFileRequest
        );

        result.commitSha = updateResult.commit.sha;
        result.filesUpdated.push(paths.rawTokens);
      } else {
        // Create new file
        const createResult = await GitHubClientStatic.createFile(
          credentials,
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
  // UTILITY METHODS
  // =============================================================================

  /**
   * Validate token permissions
   */
  static async validateTokenPermissions(credentials: GitHubCredentials): Promise<{
    valid: boolean;
    permissions: string[];
    user?: GitHubUser;
    error?: string;
  }> {
    try {
      const user = await GitHubClientStatic.getUser(credentials);

      // Try to get user repositories to test repo access
      await GitHubClientStatic.listRepositories(credentials, { per_page: 1 });

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
  static async getRateLimit(credentials: GitHubCredentials): Promise<{
    limit: number;
    remaining: number;
    reset: number;
    used: number;
  }> {
    const response = await GitHubClientStatic.makeRequest<{
      rate: {
        limit: number;
        remaining: number;
        reset: number;
        used: number;
      };
    }>(credentials, '/rate_limit');

    return response.rate;
  }
}