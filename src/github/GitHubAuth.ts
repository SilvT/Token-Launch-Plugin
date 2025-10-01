/**
 * GitHub Authentication Manager for Figma Plugin
 *
 * Manages GitHub authentication state, credential validation,
 * and connection testing within Figma's plugin environment.
 */

import { GitHubClientHybrid } from './GitHubClientHybrid';
import { SecureStorage } from '../storage/SecureStorage';
import { isHardCodedMode, getTestConfig, validateHardCodedToken, logTestConfiguration } from './HardCodedConfig';
import { ClientTracker } from '../debug/ClientTracker';
import {
  GitHubCredentials,
  GitHubConfig,
  GitHubConfigState,
  ConnectionTestResult,
  GitHubConnectionStatus,
  BoundGitHubClient,
  CreateFileRequest,
  UpdateFileRequest,
  GitHubFile,
  GitHubRepository,
  GitHubUser
} from './GitHubTypes';

// =============================================================================
// AUTHENTICATION MANAGER
// =============================================================================

export class GitHubAuth {
  private static instance: GitHubAuth;
  private client: GitHubClientHybrid | null = null;
  private state: GitHubConfigState = {
    isConfigured: false,
    isConnected: false,
    errors: []
  };

  private constructor() {
    console.log('🔧 GitHubAuth constructor - Creating singleton instance');
    ClientTracker.log('GitHubAuth constructor called');
  }

  /**
   * Get singleton instance
   */
  static getInstance(): GitHubAuth {
    if (!GitHubAuth.instance) {
      console.log('🔧 GitHubAuth.getInstance - Creating new singleton instance');
      ClientTracker.log('Creating NEW GitHubAuth singleton instance');
      GitHubAuth.instance = new GitHubAuth();
    } else {
      console.log('🔧 GitHubAuth.getInstance - Returning existing singleton instance');
      ClientTracker.log('Reusing EXISTING GitHubAuth singleton instance');
    }
    return GitHubAuth.instance;
  }

  // =============================================================================
  // INITIALIZATION & STATE MANAGEMENT
  // =============================================================================

  /**
   * Initialize authentication from stored credentials or hard-coded config
   */
  async initialize(): Promise<void> {
    try {
      console.log('🐛 DEBUG: GitHubAuth.initialize() - START');
      console.log('🐛 DEBUG: Hard-coded mode?', isHardCodedMode());

      // Check for hard-coded configuration first (for testing)
      if (isHardCodedMode()) {
        console.log('🔧 Using hard-coded GitHub configuration for testing...');

        if (!validateHardCodedToken()) {
          throw new Error('Invalid hard-coded token format');
        }

        logTestConfiguration();

        const config = getTestConfig();
        console.log('🔧 GitHubAuth - Creating GitHubClient with credentials...');
        console.log('🔧 GitHubAuth - Credentials:', { token: config.credentials.token.substring(0, 10) + '...', username: config.credentials.username });
        this.client = new GitHubClientHybrid(config.credentials);
        console.log('🔧 GitHubAuth - GitHubClient created:', typeof this.client);
        console.log('🔧 GitHubAuth - Client methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.client)));
        this.state = {
          isConfigured: true,
          isConnected: true, // Assume connected for testing
          config,
          errors: [],
          lastTestResult: {
            success: true,
            user: { login: config.credentials.username || 'TestUser' } as any,
            permissions: {
              canRead: true,
              canWrite: true,
              canAdmin: false
            }
          }
        };

        console.log('🐛 DEBUG: Hard-coded state set:', this.state.isConfigured, this.state.isConnected);
        console.log('✅ Hard-coded configuration initialized successfully');
        return;
      }

      // Normal stored credentials flow
      console.log('🐛 DEBUG: Loading stored configuration...');
      const config = await SecureStorage.getCompleteConfig();
      console.log('🐛 DEBUG: Stored config loaded:', !!config, !!config?.credentials?.token);

      if (config?.credentials?.token) {
        console.log('🐛 DEBUG: Creating client from stored config...');
        console.log('🐛 DEBUG: Token preview:', config.credentials.token.substring(0, 10) + '...');
        console.log('🐛 DEBUG: Repository:', config.repository?.owner + '/' + config.repository?.name);

        this.client = new GitHubClientHybrid(config.credentials);
        this.state = {
          isConfigured: true,
          isConnected: false,
          config,
          errors: []
        };

        console.log('🐛 DEBUG: Dynamic state set:', this.state.isConfigured, this.state.isConnected);
        console.log('🐛 DEBUG: Config stored in state:', !!this.state.config);

        // Try to restore last connection test result
        const lastTest = await SecureStorage.getLastConnectionTest();
        if (lastTest) {
          this.state.lastTestResult = lastTest;
          this.state.isConnected = lastTest.success;
          console.log('🐛 DEBUG: Last test result restored:', lastTest.success);
        }
      } else {
        console.log('🐛 DEBUG: No stored configuration found');
        this.state = {
          isConfigured: false,
          isConnected: false,
          errors: []
        };
      }

      console.log('🐛 DEBUG: GitHubAuth.initialize() - END, final state:', {
        isConfigured: this.state.isConfigured,
        isConnected: this.state.isConnected,
        hasClient: !!this.client,
        hasConfig: !!this.state.config
      });

    } catch (error) {
      console.error('🐛 DEBUG: GitHubAuth.initialize() - ERROR:', error);
      this.state = {
        isConfigured: false,
        isConnected: false,
        errors: [error instanceof Error ? error.message : 'Initialization failed']
      };
    }
  }

  /**
   * Get current authentication state
   */
  getState(): GitHubConfigState {
    return { ...this.state };
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): GitHubConnectionStatus {
    if (!this.state.isConfigured) {
      return 'not-configured';
    }

    if (!this.state.lastTestResult) {
      return 'not-configured';
    }

    if (!this.state.lastTestResult.success) {
      const error = this.state.lastTestResult.error?.toLowerCase() || '';

      if (error.includes('token') || error.includes('401')) {
        return 'invalid-token';
      }
      if (error.includes('not found') || error.includes('404')) {
        return 'repository-not-found';
      }
      if (error.includes('permission') || error.includes('403')) {
        return 'insufficient-permissions';
      }
      return 'error';
    }

    return 'connected';
  }

  // =============================================================================
  // CREDENTIAL MANAGEMENT
  // =============================================================================

  /**
   * Configure GitHub credentials and repository
   */
  async configure(config: GitHubConfig): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🐛 DEBUG: GitHubAuth.configure() - START');
      console.log('🐛 DEBUG: Input config:', {
        hasToken: !!config.credentials?.token,
        tokenPreview: config.credentials?.token?.substring(0, 10) + '...',
        repository: config.repository?.owner + '/' + config.repository?.name,
        branch: config.repository?.branch
      });

      // Validate token format
      if (!config.credentials.token || config.credentials.token.trim().length === 0) {
        throw new Error('GitHub token is required');
      }

      // Validate repository config
      if (!config.repository.owner || !config.repository.name) {
        throw new Error('Repository owner and name are required');
      }

      console.log('🐛 DEBUG: Storing configuration to SecureStorage...');
      // Store credentials and config
      await SecureStorage.storeCredentials(config.credentials);
      await SecureStorage.storeConfig(config);
      console.log('🐛 DEBUG: Configuration stored successfully');

      console.log('🐛 DEBUG: Creating new GitHubClientHybrid...');
      // Create client and update state
      this.client = new GitHubClientHybrid(config.credentials);
      console.log('🐛 DEBUG: Client created with ID:', this.client.getClientId());

      this.state = {
        isConfigured: true,
        isConnected: false,
        config,
        errors: []
      };

      console.log('🐛 DEBUG: GitHubAuth.configure() - SUCCESS, state updated:', {
        isConfigured: this.state.isConfigured,
        isConnected: this.state.isConnected,
        hasClient: !!this.client,
        hasConfig: !!this.state.config
      });

      return { success: true };
    } catch (error) {
      console.error('🐛 DEBUG: GitHubAuth.configure() - ERROR:', error);
      const errorMessage = error instanceof Error ? error.message : 'Configuration failed';
      this.state.errors = [errorMessage];
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Update GitHub token
   */
  async updateToken(token: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!token || token.trim().length === 0) {
        throw new Error('Token cannot be empty');
      }

      const currentConfig = await SecureStorage.getConfig();
      if (!currentConfig) {
        throw new Error('No existing configuration found');
      }

      const newCredentials: GitHubCredentials = { token: token.trim() };
      const newConfig: GitHubConfig = {
        ...currentConfig,
        credentials: newCredentials
      } as GitHubConfig;

      await SecureStorage.storeCredentials(newCredentials);
      this.client = new GitHubClientHybrid(newCredentials);

      this.state.config = newConfig;
      this.state.isConnected = false; // Reset connection status
      this.state.lastTestResult = undefined;
      this.state.errors = [];

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Token update failed';
      this.state.errors = [errorMessage];
      return { success: false, error: errorMessage };
    }
  }

  // =============================================================================
  // CONNECTION TESTING
  // =============================================================================

  /**
   * Test GitHub connection
   */
  async testConnection(): Promise<ConnectionTestResult> {
    try {
      if (!this.client) {
        throw new Error('GitHub client not configured');
      }

      if (!this.state.config?.repository) {
        throw new Error('Repository configuration not found');
      }

      const result = await this.client.testConnection({
        owner: this.state.config.repository.owner,
        name: this.state.config.repository.name
      });

      // Store test result
      await SecureStorage.storeLastConnectionTest(result);

      // Update state
      this.state.lastTestResult = result;
      this.state.isConnected = result.success;

      if (!result.success) {
        this.state.errors = [result.error || 'Connection test failed'];
      } else {
        this.state.errors = [];
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection test failed';
      const result: ConnectionTestResult = {
        success: false,
        error: errorMessage,
        permissions: {
          canRead: false,
          canWrite: false,
          canAdmin: false
        }
      };

      this.state.lastTestResult = result;
      this.state.isConnected = false;
      this.state.errors = [errorMessage];

      return result;
    }
  }

  /**
   * Quick validation of current credentials
   */
  async validateCredentials(): Promise<{ valid: boolean; error?: string }> {
    try {
      if (!this.client) {
        return { valid: false, error: 'No GitHub client configured' };
      }

      const validation = await this.client.validateTokenPermissions();
      return {
        valid: validation.valid,
        error: validation.error
      };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Credential validation failed'
      };
    }
  }

  // =============================================================================
  // CLIENT ACCESS
  // =============================================================================

  /**
   * Get GitHub client (throws if not configured)
   */
  getClient(): GitHubClientHybrid {
    console.log('🐛 DEBUG: GitHubAuth.getClient() - Called');
    console.log('🐛 DEBUG: Current state:', {
      isConfigured: this.state.isConfigured,
      isConnected: this.state.isConnected,
      hasClient: !!this.client,
      hasConfig: !!this.state.config,
      clientId: this.client?.getClientId()
    });

    if (!this.client) {
      console.error('🐛 DEBUG: GitHubAuth.getClient() - NO CLIENT AVAILABLE!');
      console.error('🐛 DEBUG: State dump:', JSON.stringify(this.state, null, 2));
      throw new Error('GitHub client not configured. Please configure your GitHub credentials first.');
    }

    console.log('🐛 DEBUG: GitHubAuth.getClient() - Returning client ID:', this.client.getClientId());
    return this.client;
  }

  /**
   * Create a bound client with methods that maintain proper context
   */
  createBoundClient(): BoundGitHubClient {
    if (!this.client) {
      ClientTracker.log('❌ Cannot create bound client - original client not configured');
      throw new Error('GitHub client not configured. Please configure your GitHub credentials first.');
    }

    console.log('🔧 GitHubAuth.createBoundClient - Creating bound client with closures');
    ClientTracker.log(`Creating bound client for client ID: ${this.client.getClientId()}`);

    const originalClient = this.client;
    const clientId = originalClient.getClientId();
    const boundMethods: string[] = [];

    // Verify original client methods before binding
    ClientTracker.inspectObject('originalClient', originalClient);
    ClientTracker.traceMethodCall('originalClient', 'fileExists', originalClient);
    ClientTracker.traceMethodCall('originalClient', 'createFile', originalClient);
    ClientTracker.traceMethodCall('originalClient', 'updateFile', originalClient);
    ClientTracker.traceMethodCall('originalClient', 'getFile', originalClient);

    // Create bound methods using closures to capture the client instance
    const boundClient: BoundGitHubClient = {
      // File operations with proper context binding
      fileExists: async (owner: string, repo: string, path: string): Promise<boolean> => {
        ClientTracker.log(`[${clientId}] EXECUTING fileExists`, { owner, repo, path });
        console.log('🔧 BoundClient.fileExists - Called with proper context');

        try {
          // Verify original client is still valid
          if (!originalClient) throw new Error('Original client is null');
          if (typeof originalClient.fileExists !== 'function') throw new Error('fileExists method is not a function');

          const result = await originalClient.fileExists(owner, repo, path);
          ClientTracker.log(`[${clientId}] fileExists SUCCESS`, { result });
          return result;
        } catch (error) {
          ClientTracker.log(`[${clientId}] fileExists FAILED`, error);
          throw error;
        }
      },

      createFile: async (owner: string, repo: string, path: string, request: CreateFileRequest): Promise<{ content: GitHubFile; commit: any }> => {
        ClientTracker.log(`[${clientId}] EXECUTING createFile`, { owner, repo, path });
        console.log('🔧 BoundClient.createFile - Called with proper context');

        try {
          if (!originalClient) throw new Error('Original client is null');
          if (typeof originalClient.createFile !== 'function') throw new Error('createFile method is not a function');

          const result = await originalClient.createFile(owner, repo, path, request);
          ClientTracker.log(`[${clientId}] createFile SUCCESS`);
          return result;
        } catch (error) {
          ClientTracker.log(`[${clientId}] createFile FAILED`, error);
          throw error;
        }
      },

      updateFile: async (owner: string, repo: string, path: string, request: UpdateFileRequest): Promise<{ content: GitHubFile; commit: any }> => {
        ClientTracker.log(`[${clientId}] EXECUTING updateFile`, { owner, repo, path });
        console.log('🔧 BoundClient.updateFile - Called with proper context');

        try {
          if (!originalClient) throw new Error('Original client is null');
          if (typeof originalClient.updateFile !== 'function') throw new Error('updateFile method is not a function');

          const result = await originalClient.updateFile(owner, repo, path, request);
          ClientTracker.log(`[${clientId}] updateFile SUCCESS`);
          return result;
        } catch (error) {
          ClientTracker.log(`[${clientId}] updateFile FAILED`, error);
          throw error;
        }
      },

      getFile: async (owner: string, repo: string, path: string): Promise<GitHubFile> => {
        ClientTracker.log(`[${clientId}] EXECUTING getFile`, { owner, repo, path });
        console.log('🔧 BoundClient.getFile - Called with proper context');

        try {
          if (!originalClient) throw new Error('Original client is null');
          if (typeof originalClient.getFile !== 'function') throw new Error('getFile method is not a function');

          const result = await originalClient.getFile(owner, repo, path);
          ClientTracker.log(`[${clientId}] getFile SUCCESS`);
          return result;
        } catch (error) {
          ClientTracker.log(`[${clientId}] getFile FAILED`, error);
          throw error;
        }
      },

      // Repository operations
      getRepository: async (owner: string, repo: string): Promise<GitHubRepository> => {
        ClientTracker.log(`[${clientId}] EXECUTING getRepository`, { owner, repo });
        console.log('🔧 BoundClient.getRepository - Called with proper context');

        try {
          if (!originalClient) throw new Error('Original client is null');
          if (typeof originalClient.getRepository !== 'function') throw new Error('getRepository method is not a function');

          const result = await originalClient.getRepository(owner, repo);
          ClientTracker.log(`[${clientId}] getRepository SUCCESS`);
          return result;
        } catch (error) {
          ClientTracker.log(`[${clientId}] getRepository FAILED`, error);
          throw error;
        }
      },

      testConnection: async (config: { owner: string; name: string }): Promise<ConnectionTestResult> => {
        ClientTracker.log(`[${clientId}] EXECUTING testConnection`, config);
        console.log('🔧 BoundClient.testConnection - Called with proper context');

        try {
          if (!originalClient) throw new Error('Original client is null');
          if (typeof originalClient.testConnection !== 'function') throw new Error('testConnection method is not a function');

          const result = await originalClient.testConnection(config);
          ClientTracker.log(`[${clientId}] testConnection SUCCESS`);
          return result;
        } catch (error) {
          ClientTracker.log(`[${clientId}] testConnection FAILED`, error);
          throw error;
        }
      },

      getUser: async (): Promise<GitHubUser> => {
        ClientTracker.log(`[${clientId}] EXECUTING getUser`);
        console.log('🔧 BoundClient.getUser - Called with proper context');

        try {
          if (!originalClient) throw new Error('Original client is null');
          if (typeof originalClient.getUser !== 'function') throw new Error('getUser method is not a function');

          const result = await originalClient.getUser();
          ClientTracker.log(`[${clientId}] getUser SUCCESS`);
          return result;
        } catch (error) {
          ClientTracker.log(`[${clientId}] getUser FAILED`, error);
          throw error;
        }
      }
    };

    boundMethods.push('fileExists', 'createFile', 'updateFile', 'getFile', 'getRepository', 'testConnection', 'getUser');

    // Verify all bound methods are functions
    boundMethods.forEach(methodName => {
      const method = (boundClient as any)[methodName];
      ClientTracker.log(`Method verification: ${methodName} is ${typeof method}`, {
        isFunction: typeof method === 'function',
        isAsync: method.constructor.name === 'AsyncFunction'
      });
    });

    ClientTracker.log(`Bound client created with methods: ${boundMethods.join(', ')}`);
    ClientTracker.inspectObject('boundClient', boundClient);

    return boundClient;
  }

  /**
   * Check if client is available
   */
  hasClient(): boolean {
    return this.client !== null;
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  /**
   * Clear all GitHub configuration
   */
  async clearConfiguration(): Promise<void> {
    try {
      await SecureStorage.clearAll();
      this.client = null;
      this.state = {
        isConfigured: false,
        isConnected: false,
        errors: []
      };
    } catch (error) {
      this.state.errors = [error instanceof Error ? error.message : 'Failed to clear configuration'];
      throw error;
    }
  }

  /**
   * Get repository information if configured
   */
  async getRepositoryInfo(): Promise<any> {
    if (!this.client || !this.state.config?.repository) {
      throw new Error('GitHub not configured');
    }

    return this.client.getRepository(
      this.state.config.repository.owner,
      this.state.config.repository.name
    );
  }

  /**
   * List available repositories
   */
  async listRepositories(): Promise<any[]> {
    if (!this.client) {
      throw new Error('GitHub not configured');
    }

    return this.client.listRepositories({
      type: 'owner',
      sort: 'updated',
      per_page: 100
    });
  }

  /**
   * Check if user has push permissions to configured repository
   */
  canPushToRepository(): boolean {
    return this.state.lastTestResult?.permissions?.canWrite || false;
  }

  /**
   * Get current configuration (without sensitive data)
   */
  getPublicConfig(): Partial<GitHubConfig> | null {
    if (!this.state.config) {
      return null;
    }

    return {
      repository: this.state.config.repository,
      paths: this.state.config.paths,
      commitMessage: this.state.config.commitMessage
    };
  }
}