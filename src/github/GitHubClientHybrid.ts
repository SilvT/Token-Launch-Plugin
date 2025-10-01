/**
 * Hybrid GitHub Client
 *
 * Automatically falls back to static implementation when method binding issues occur.
 * Provides seamless compatibility with the original GitHubClient interface.
 */

import { GitHubClient } from './GitHubClient';
import { GitHubClientStatic } from './GitHubClientStatic';
import {
  GitHubCredentials,
  GitHubUser,
  GitHubRepository,
  GitHubFile,
  ConnectionTestResult,
  CreateFileRequest,
  UpdateFileRequest,
  TokenPushRequest,
  TokenPushResult
} from './GitHubTypes';

export class GitHubClientHybrid {
  private credentials: GitHubCredentials;
  private regularClient: GitHubClient | null = null;
  private useStaticFallback: boolean = false;
  private readonly clientId: string;

  constructor(credentials: GitHubCredentials) {
    this.credentials = credentials;
    this.clientId = `hybrid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log('🔧 GitHubClientHybrid constructor - Creating hybrid client with ID:', this.clientId);

    // Initialize client synchronously but detect issues on first method call
    this.initializeClient();
  }

  private initializeClient(): void {
    try {
      console.log('🔧 GitHubClientHybrid - Attempting to create regular GitHubClient...');
      this.regularClient = new GitHubClient(this.credentials);

      // Test if the regular client's methods work (basic synchronous check)
      console.log('🔧 GitHubClientHybrid - Testing regular client methods...');
      this.testClientMethods();

      console.log('✅ GitHubClientHybrid - Regular client methods appear valid, will test async methods on first call');
      this.useStaticFallback = false;

    } catch (error) {
      console.warn('⚠️ GitHubClientHybrid - Regular client failed, falling back to static implementation');
      console.warn('⚠️ Error details:', error);
      this.useStaticFallback = true;
    }
  }

  private testClientMethods(): void {
    if (!this.regularClient) {
      throw new Error('Regular client not available');
    }

    // Test key methods that often fail due to binding issues
    const testMethods = [
      'fileExists',
      'getUser',
      'testConnection',
      'getRepository'
    ];

    for (const methodName of testMethods) {
      const method = (this.regularClient as any)[methodName];
      if (typeof method !== 'function') {
        throw new Error(`Method ${methodName} is not a function (type: ${typeof method})`);
      }
    }

    // Try a simple method call to ensure binding works
    try {
      // This should not make an actual API call but test method binding
      const methodType = typeof this.regularClient.getClientId;
      if (methodType !== 'function') {
        throw new Error(`getClientId method binding failed (type: ${methodType})`);
      }

      // Test that getClientId actually works
      const clientId = this.regularClient.getClientId();
      if (typeof clientId !== 'string') {
        throw new Error('getClientId returned non-string value');
      }

    } catch (bindingError) {
      throw new Error(`Method binding test failed: ${bindingError}`);
    }
  }

  getClientId(): string {
    return this.clientId;
  }

  // =============================================================================
  // AUTHENTICATION & USER INFO
  // =============================================================================

  async getUser(): Promise<GitHubUser> {
    if (this.useStaticFallback) {
      console.log('🔄 GitHubClientHybrid.getUser - Using static fallback');
      return GitHubClientStatic.getUser(this.credentials);
    } else if (this.regularClient) {
      try {
        console.log('🔄 GitHubClientHybrid.getUser - Using regular client');
        return await this.regularClient.getUser();
      } catch (error) {
        console.warn('⚠️ GitHubClientHybrid.getUser - Regular client failed, switching to static fallback');
        console.warn('⚠️ Error:', error);
        this.useStaticFallback = true;
        return GitHubClientStatic.getUser(this.credentials);
      }
    } else {
      throw new Error('No client available');
    }
  }

  async testConnection(repositoryConfig?: { owner: string; name: string }): Promise<ConnectionTestResult> {
    if (this.useStaticFallback) {
      console.log('🔄 GitHubClientHybrid.testConnection - Using static fallback');
      return GitHubClientStatic.testConnection(this.credentials, repositoryConfig);
    } else if (this.regularClient) {
      console.log('🔄 GitHubClientHybrid.testConnection - Using regular client');
      return this.regularClient.testConnection(repositoryConfig);
    } else {
      throw new Error('No client available');
    }
  }

  // =============================================================================
  // REPOSITORY OPERATIONS
  // =============================================================================

  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    if (this.useStaticFallback) {
      console.log('🔄 GitHubClientHybrid.getRepository - Using static fallback');
      return GitHubClientStatic.getRepository(this.credentials, owner, repo);
    } else if (this.regularClient) {
      console.log('🔄 GitHubClientHybrid.getRepository - Using regular client');
      return this.regularClient.getRepository(owner, repo);
    } else {
      throw new Error('No client available');
    }
  }

  async listRepositories(options: {
    type?: 'owner' | 'collaborator' | 'organization_member';
    sort?: 'created' | 'updated' | 'pushed' | 'full_name';
    per_page?: number;
  } = {}): Promise<GitHubRepository[]> {
    if (this.useStaticFallback) {
      console.log('🔄 GitHubClientHybrid.listRepositories - Using static fallback');
      return GitHubClientStatic.listRepositories(this.credentials, options);
    } else if (this.regularClient) {
      console.log('🔄 GitHubClientHybrid.listRepositories - Using regular client');
      return this.regularClient.listRepositories(options);
    } else {
      throw new Error('No client available');
    }
  }

  // =============================================================================
  // FILE OPERATIONS
  // =============================================================================

  async getFile(owner: string, repo: string, path: string, ref?: string): Promise<GitHubFile> {
    if (this.useStaticFallback) {
      console.log('🔄 GitHubClientHybrid.getFile - Using static fallback');
      return GitHubClientStatic.getFile(this.credentials, owner, repo, path, ref);
    } else if (this.regularClient) {
      console.log('🔄 GitHubClientHybrid.getFile - Using regular client');
      return this.regularClient.getFile(owner, repo, path, ref);
    } else {
      throw new Error('No client available');
    }
  }

  async createFile(
    owner: string,
    repo: string,
    path: string,
    request: CreateFileRequest
  ): Promise<{ content: GitHubFile; commit: any }> {
    if (this.useStaticFallback) {
      console.log('🔄 GitHubClientHybrid.createFile - Using static fallback');
      return GitHubClientStatic.createFile(this.credentials, owner, repo, path, request);
    } else if (this.regularClient) {
      console.log('🔄 GitHubClientHybrid.createFile - Using regular client');
      return this.regularClient.createFile(owner, repo, path, request);
    } else {
      throw new Error('No client available');
    }
  }

  async updateFile(
    owner: string,
    repo: string,
    path: string,
    request: UpdateFileRequest
  ): Promise<{ content: GitHubFile; commit: any }> {
    if (this.useStaticFallback) {
      console.log('🔄 GitHubClientHybrid.updateFile - Using static fallback');
      return GitHubClientStatic.updateFile(this.credentials, owner, repo, path, request);
    } else if (this.regularClient) {
      console.log('🔄 GitHubClientHybrid.updateFile - Using regular client');
      return this.regularClient.updateFile(owner, repo, path, request);
    } else {
      throw new Error('No client available');
    }
  }

  async fileExists(owner: string, repo: string, path: string): Promise<boolean> {
    if (this.useStaticFallback) {
      console.log('🔄 GitHubClientHybrid.fileExists - Using static fallback');
      return GitHubClientStatic.fileExists(this.credentials, owner, repo, path);
    } else if (this.regularClient) {
      try {
        console.log('🔄 GitHubClientHybrid.fileExists - Using regular client');
        return await this.regularClient.fileExists(owner, repo, path);
      } catch (error) {
        console.warn('⚠️ GitHubClientHybrid.fileExists - Regular client failed, switching to static fallback');
        console.warn('⚠️ Error:', error);
        this.useStaticFallback = true;
        return GitHubClientStatic.fileExists(this.credentials, owner, repo, path);
      }
    } else {
      throw new Error('No client available');
    }
  }

  // =============================================================================
  // TOKEN PUSH OPERATIONS
  // =============================================================================

  async pushTokens(request: TokenPushRequest): Promise<TokenPushResult> {
    if (this.useStaticFallback) {
      console.log('🔄 GitHubClientHybrid.pushTokens - Using static fallback');
      return GitHubClientStatic.pushTokens(this.credentials, request);
    } else if (this.regularClient) {
      console.log('🔄 GitHubClientHybrid.pushTokens - Using regular client');
      return this.regularClient.pushTokens(request);
    } else {
      throw new Error('No client available');
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  async validateTokenPermissions(): Promise<{
    valid: boolean;
    permissions: string[];
    user?: GitHubUser;
    error?: string;
  }> {
    if (this.useStaticFallback) {
      console.log('🔄 GitHubClientHybrid.validateTokenPermissions - Using static fallback');
      return GitHubClientStatic.validateTokenPermissions(this.credentials);
    } else if (this.regularClient) {
      console.log('🔄 GitHubClientHybrid.validateTokenPermissions - Using regular client');
      return this.regularClient.validateTokenPermissions();
    } else {
      throw new Error('No client available');
    }
  }

  async getRateLimit(): Promise<{
    limit: number;
    remaining: number;
    reset: number;
    used: number;
  }> {
    if (this.useStaticFallback) {
      console.log('🔄 GitHubClientHybrid.getRateLimit - Using static fallback');
      return GitHubClientStatic.getRateLimit(this.credentials);
    } else if (this.regularClient) {
      console.log('🔄 GitHubClientHybrid.getRateLimit - Using regular client');
      return this.regularClient.getRateLimit();
    } else {
      throw new Error('No client available');
    }
  }

  /**
   * Get information about which implementation is being used
   */
  getImplementationInfo(): {
    type: 'regular' | 'static';
    clientId: string;
    isReady: boolean;
  } {
    return {
      type: this.useStaticFallback ? 'static' : 'regular',
      clientId: this.clientId,
      isReady: this.useStaticFallback || !!this.regularClient
    };
  }
}