/**
 * Git Operations for Design Token Push
 *
 * Handles core Git operations for pushing design token files to GitHub repositories.
 * Focuses on single-file pushes with validation, error handling, and user feedback.
 */

import { GitHubClientHybrid } from './GitHubClientHybrid';
import { GitHubAuth } from './GitHubAuth';
import { ClientTracker } from '../debug/ClientTracker';
import {
  GitHubRepository,
  ConnectionTestResult,
  CreateFileRequest,
  UpdateFileRequest,
  BoundGitHubClient
} from './GitHubTypes';

// =============================================================================
// TYPES FOR GIT OPERATIONS
// =============================================================================

export interface RepositoryConfig {
  owner: string;
  name: string;
  branch?: string;
}

export interface TokenFileConfig {
  path: string;          // e.g., 'tokens/raw/figma-tokens-20240923.json'
  content: any;          // Token data to push
  message?: string;      // Custom commit message
}

export interface PushResult {
  success: boolean;
  operation: 'created' | 'updated' | 'failed';
  filePath: string;
  commitSha?: string;
  commitUrl?: string;
  error?: string;
  fileSize?: number;
}

export interface RepositoryValidation {
  isValid: boolean;
  exists: boolean;
  hasAccess: boolean;
  canWrite: boolean;
  defaultBranch: string;
  error?: string;
  repository?: GitHubRepository;
}

export interface ProgressCallback {
  (stage: string, message: string, progress?: number): void;
}

// =============================================================================
// GIT OPERATIONS CLASS
// =============================================================================

export class GitOperations {
  private auth: GitHubAuth;
  private client: GitHubClientHybrid | null = null;
  private boundClient: BoundGitHubClient | null = null;

  constructor() {
    this.auth = GitHubAuth.getInstance();
  }

  /**
   * Initialize Git operations
   */
  async initialize(): Promise<void> {
    ClientTracker.log('GitOperations.initialize - Starting');
    console.log('🔧 GitOperations.initialize - Starting...');

    await this.auth.initialize();
    ClientTracker.log('GitOperations.initialize - Auth initialized');
    console.log('🔧 GitOperations.initialize - Auth initialized');

    if (this.auth.hasClient()) {
      ClientTracker.log('GitOperations.initialize - Auth has client, getting it');
      console.log('🔧 GitOperations.initialize - Auth has client, getting it...');

      this.client = this.auth.getClient();
      this.boundClient = this.auth.createBoundClient();

      const clientId = this.client.getClientId();
      ClientTracker.log(`GitOperations.initialize - Client retrieved with ID: ${clientId}`);
      ClientTracker.log('GitOperations.initialize - Bound client created', {
        clientType: typeof this.client,
        boundClientType: typeof this.boundClient,
        clientId
      });

      console.log('🔧 GitOperations.initialize - Client retrieved:', typeof this.client);
      console.log('🔧 GitOperations.initialize - Bound client created:', typeof this.boundClient);
      console.log('🔧 GitOperations.initialize - Client ID:', clientId);
      console.log('🔧 GitOperations.initialize - Client prototype:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.client || {})));

      // Check specific methods with ClientTracker (without calling them)
      if (this.client) {
        ClientTracker.inspectObject('GitOperations.client', this.client);
        ClientTracker.inspectObject('GitOperations.boundClient', this.boundClient);

        console.log('🔧 Available methods on client:');
        console.log('  - fileExists:', typeof this.client.fileExists);
        console.log('  - createFile:', typeof this.client.createFile);
        console.log('  - updateFile:', typeof this.client.updateFile);
        console.log('  - getFile:', typeof this.client.getFile);
        console.log('  - getUser:', typeof this.client.getUser);

        // Additional debugging - check if methods exist at all
        console.log('🔧 Instance properties:', Object.getOwnPropertyNames(this.client));
        console.log('🔧 Instance methods in prototype:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.client)));
      }
    } else {
      ClientTracker.log('GitOperations.initialize - Auth does not have client');
      console.log('🔧 GitOperations.initialize - Auth does not have client');
    }

    ClientTracker.log('GitOperations.initialize - Completed successfully');
    console.log('🔧 GitOperations.initialize - Completed');
  }

  // =============================================================================
  // REPOSITORY VALIDATION
  // =============================================================================

  /**
   * Validate repository access and permissions
   */
  async validateRepository(config: RepositoryConfig): Promise<RepositoryValidation> {
    try {
      ClientTracker.log('GitOperations.validateRepository - Starting', config);

      if (!this.boundClient) {
        ClientTracker.log('❌ GitOperations.validateRepository - Bound client not initialized');
        throw new Error('GitHub bound client not initialized');
      }

      ClientTracker.log(`GitOperations.validateRepository - Validating ${config.owner}/${config.name}`);
      ClientTracker.inspectObject('validateRepository.boundClient', this.boundClient);
      ClientTracker.traceMethodCall('boundClient', 'getRepository', this.boundClient);
      ClientTracker.traceMethodCall('boundClient', 'testConnection', this.boundClient);

      console.log(`🔍 Validating repository: ${config.owner}/${config.name}`);
      console.log('🔧 validateRepository - Using bound client:', typeof this.boundClient);
      console.log('🔧 validateRepository - Bound client methods:');
      console.log('  - getRepository:', typeof this.boundClient.getRepository);
      console.log('  - testConnection:', typeof this.boundClient.testConnection);

      // Use bound client directly - no context binding issues
      const boundClient = this.boundClient;

      // Test repository access using bound client
      ClientTracker.log('GitOperations.validateRepository - About to call getRepository');
      console.log('🔧 About to call boundClient.getRepository...');
      let repository;
      try {
        repository = await boundClient.getRepository(config.owner, config.name);
        ClientTracker.log('GitOperations.validateRepository - getRepository SUCCESS', { name: repository.name });
        console.log('✅ getRepository successful:', repository.name);
      } catch (getRepoError) {
        ClientTracker.log('GitOperations.validateRepository - getRepository FAILED', getRepoError);
        console.error('❌ getRepository failed:', getRepoError);
        console.error('❌ getRepository error type:', typeof getRepoError);
        throw getRepoError;
      }

      // Test user permissions using bound client
      ClientTracker.log('GitOperations.validateRepository - About to call testConnection');
      console.log('🔧 About to call boundClient.testConnection...');
      let testResult;
      try {
        testResult = await boundClient.testConnection({
          owner: config.owner,
          name: config.name
        });
        ClientTracker.log('GitOperations.validateRepository - testConnection SUCCESS', {
          success: testResult.success,
          canWrite: testResult.permissions?.canWrite
        });
        console.log('✅ testConnection successful:', testResult.success);
      } catch (testConnError) {
        ClientTracker.log('GitOperations.validateRepository - testConnection FAILED', testConnError);
        console.error('❌ testConnection failed:', testConnError);
        console.error('❌ testConnection error type:', typeof testConnError);
        throw testConnError;
      }

      const validation: RepositoryValidation = {
        isValid: testResult.success,
        exists: true,
        hasAccess: testResult.success,
        canWrite: testResult.permissions?.canWrite || false,
        defaultBranch: repository.default_branch || 'main',
        repository
      };

      if (!validation.canWrite) {
        validation.error = 'Insufficient permissions to write to repository';
        validation.isValid = false;
      }

      ClientTracker.log(`GitOperations.validateRepository - Completed`, {
        isValid: validation.isValid,
        canWrite: validation.canWrite
      });
      console.log(`✅ Repository validation: ${validation.isValid ? 'PASSED' : 'FAILED'}`);
      return validation;

    } catch (error: any) {
      ClientTracker.log('❌ GitOperations.validateRepository - FAILED with error', error);
      console.error('❌ Repository validation failed:', error);

      return {
        isValid: false,
        exists: error.status !== 404,
        hasAccess: false,
        canWrite: false,
        defaultBranch: 'main',
        error: this.parseGitError(error)
      };
    }
  }

  /**
   * Quick repository connection test
   */
  async testRepositoryConnection(config: RepositoryConfig): Promise<ConnectionTestResult> {
    try {
      if (!this.boundClient) {
        throw new Error('GitHub bound client not initialized');
      }

      return await this.boundClient.testConnection({
        owner: config.owner,
        name: config.name
      });
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
  // FILE OPERATIONS
  // =============================================================================

  /**
   * Push a single token file to repository
   */
  async pushTokenFile(
    repository: RepositoryConfig,
    fileConfig: TokenFileConfig,
    progressCallback?: ProgressCallback
  ): Promise<PushResult> {
    try {
      console.log('🚀 Starting pushTokenFile...');
      console.log('📁 Repository:', repository);
      console.log('📄 File config:', { path: fileConfig.path, messageLength: fileConfig.message?.length });

      // Comprehensive initialization check
      if (!this.isReady()) {
        throw new Error('GitOperations not ready - please call initialize() first');
      }

      if (!this.boundClient) {
        throw new Error('GitHub bound client not initialized');
      }

      // Comprehensive method validation to prevent "not a function" errors
      const { MethodValidator } = await import('./MethodValidator');
      const requiredMethods = ['fileExists', 'createFile', 'updateFile', 'getFile'];

      const methodValidation = MethodValidator.validateMethods(
        this.boundClient,
        requiredMethods,
        'boundClient'
      );

      if (!methodValidation.isValid) {
        throw new Error(
          `BoundClient validation failed: ` +
          `Missing: [${methodValidation.missingMethods.join(', ')}], ` +
          `Invalid: [${methodValidation.invalidMethods.join(', ')}]. ` +
          `Available properties: [${methodValidation.debugInfo.availableProperties.slice(0, 10).join(', ')}...]`
        );
      }

      console.log('🔧 pushTokenFile - Using bound client:', typeof this.boundClient);
      console.log('🔧 pushTokenFile - Bound client methods available:');
      console.log('  - fileExists:', typeof this.boundClient.fileExists);
      console.log('  - createFile:', typeof this.boundClient.createFile);
      console.log('  - updateFile:', typeof this.boundClient.updateFile);
      console.log('  - getFile:', typeof this.boundClient.getFile);

      console.log('✅ GitHub client is initialized');

      const { owner, name, branch = 'main' } = repository;
      const { path, content, message } = fileConfig;

      progressCallback?.('validation', 'Validating repository access...', 10);

      // Validate repository first
      console.log('🔍 Validating repository...');
      const repoValidation = await this.validateRepository(repository);
      if (!repoValidation.isValid) {
        throw new Error(repoValidation.error || 'Repository validation failed');
      }
      console.log('✅ Repository validation passed');

      progressCallback?.('preparation', 'Preparing file content...', 30);

      // Prepare file content
      console.log('📝 Preparing file content...');
      const jsonContent = JSON.stringify(content, null, 2);

      // Custom base64 encoding for Figma plugin environment
      console.log('🔧 Encoding content to base64...');
      let encodedContent: string;
      try {
        // Try Node.js Buffer first (might be available in some environments)
        encodedContent = Buffer.from(jsonContent, 'utf8').toString('base64');
        console.log('✅ Used Buffer for base64 encoding');
      } catch (bufferError) {
        console.warn('⚠️ Buffer not available, trying btoa...');
        try {
          encodedContent = btoa(jsonContent);
          console.log('✅ Used btoa for base64 encoding');
        } catch (btoaError) {
          console.warn('⚠️ btoa not available, using custom base64 encoder...');
          // Custom base64 implementation for Figma plugin environment
          encodedContent = this.customBase64Encode(jsonContent);
          console.log('✅ Used custom base64 encoding');
        }
      }

      // Calculate file size without Blob and TextEncoder (not available in Figma plugins)
      console.log('🔧 Calculating file size...');
      let fileSize: number;
      try {
        // Try TextEncoder first (available in modern browsers)
        fileSize = new TextEncoder().encode(jsonContent).length;
        console.log('✅ Used TextEncoder for file size calculation');
      } catch (textEncoderError) {
        console.warn('⚠️ TextEncoder not available, using UTF-8 byte counting...');
        // Custom UTF-8 byte counting for Figma plugin environment
        fileSize = this.getUTF8ByteLength(jsonContent);
        console.log('✅ Used custom UTF-8 byte counting');
      }
      console.log(`📊 File size: ${fileSize} bytes, encoded length: ${encodedContent.length}`);

      // Generate commit message
      const commitMessage = message || this.generateCommitMessage(content);
      console.log('💬 Commit message generated:', commitMessage.substring(0, 100) + '...');

      progressCallback?.('checking', 'Checking if file exists...', 50);

      // Check if file already exists using bound client
      ClientTracker.log('GitOperations.pushTokenFile - About to check file existence');
      console.log('🔍 Checking if file exists...');
      console.log('🔧 About to call boundClient.fileExists');

      let fileExists: boolean;
      try {
        // Use bound client directly - no context issues
        ClientTracker.traceMethodCall('boundClient', 'fileExists', this.boundClient);
        ClientTracker.log('GitOperations.pushTokenFile - Executing fileExists', { owner, name, path });
        console.log('🔧 About to execute boundClient.fileExists with parameters:', { owner, name, path });

        // Additional safety check at call time
        if (typeof this.boundClient.fileExists !== 'function') {
          throw new Error(`fileExists is not a function at call time (type: ${typeof this.boundClient.fileExists})`);
        }

        fileExists = await this.boundClient.fileExists(owner, name, path);

        ClientTracker.log('GitOperations.pushTokenFile - fileExists SUCCESS', { result: fileExists });
        console.log(`📁 File exists: ${fileExists}`);
      } catch (fileExistsError) {
        ClientTracker.log('❌ GitOperations.pushTokenFile - fileExists FAILED', fileExistsError);
        console.error('❌ Error checking file existence:', fileExistsError);
        console.error('❌ Error type:', typeof fileExistsError);
        console.error('❌ Error message:', fileExistsError instanceof Error ? fileExistsError.message : String(fileExistsError));
        throw new Error(`Failed to check file existence: ${fileExistsError}`);
      }

      progressCallback?.('pushing', fileExists ? 'Updating file...' : 'Creating file...', 70);

      let result: PushResult;

      if (fileExists) {
        console.log('🔄 Updating existing file...');
        console.log('🔧 About to call updateExistingFile');
        try {
          result = await this.updateExistingFile(owner, name, path, {
            message: commitMessage,
            content: encodedContent,
            branch
          });
          result.operation = 'updated';
          console.log('✅ File update completed');
        } catch (updateError) {
          console.error('❌ Error updating file:', updateError);
          throw new Error(`Failed to update file: ${updateError}`);
        }
      } else {
        console.log('📄 Creating new file...');
        console.log('🔧 About to call createNewFile');
        try {
          result = await this.createNewFile(owner, name, path, {
            message: commitMessage,
            content: encodedContent,
            branch
          });
          result.operation = 'created';
          console.log('✅ File creation completed');
        } catch (createError) {
          console.error('❌ Error creating file:', createError);
          throw new Error(`Failed to create file: ${createError}`);
        }
      }

      result.filePath = path;
      result.fileSize = fileSize;

      progressCallback?.('complete', 'File pushed successfully!', 100);

      console.log(`✅ File ${result.operation}: ${path} (${fileSize} bytes)`);
      return result;

    } catch (error) {
      console.error('❌ Push failed in pushTokenFile:', error);
      console.error('❌ Error type:', typeof error);
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');

      const errorMessage = this.parseGitError(error);
      progressCallback?.('error', `Push failed: ${errorMessage}`, 0);

      return {
        success: false,
        operation: 'failed',
        filePath: fileConfig.path,
        error: errorMessage
      };
    }
  }

  /**
   * Create new file in repository
   */
  private async createNewFile(
    owner: string,
    repo: string,
    path: string,
    request: CreateFileRequest
  ): Promise<PushResult> {
    try {
      ClientTracker.log('GitOperations.createNewFile - Starting', { owner, repo, path });
      console.log('🔧 createNewFile - Starting...');
      console.log('🔧 createNewFile - Parameters:', { owner, repo, path });
      console.log('🔧 createNewFile - Request keys:', Object.keys(request));

      if (!this.boundClient) {
        ClientTracker.log('❌ GitOperations.createNewFile - Bound client is null');
        throw new Error('GitHub bound client is null in createNewFile');
      }

      ClientTracker.inspectObject('createNewFile.boundClient', this.boundClient);
      ClientTracker.traceMethodCall('boundClient', 'createFile', this.boundClient);

      console.log('🔧 createNewFile - Using bound client:', typeof this.boundClient);
      console.log('🔧 createNewFile - boundClient.createFile:', typeof this.boundClient.createFile);

      ClientTracker.log('GitOperations.createNewFile - About to call boundClient.createFile');
      console.log('🚀 Calling boundClient.createFile...');

      // Safety check at call time
      if (typeof this.boundClient.createFile !== 'function') {
        throw new Error(`createFile is not a function at call time (type: ${typeof this.boundClient.createFile})`);
      }

      let response;
      try {
        response = await this.boundClient.createFile(owner, repo, path, request);
        ClientTracker.log('GitOperations.createNewFile - createFile SUCCESS', { responseType: typeof response });
        console.log('✅ createFile response received:', typeof response);
      } catch (callError) {
        ClientTracker.log('❌ GitOperations.createNewFile - createFile FAILED', callError);
        console.error('❌ Error during createFile call:', callError);
        console.error('❌ Error type:', typeof callError);
        console.error('❌ Error message:', callError instanceof Error ? callError.message : String(callError));
        console.error('❌ Error stack:', callError instanceof Error ? callError.stack : 'No stack trace');
        throw callError;
      }

      const result = {
        success: true,
        operation: 'created' as const,
        filePath: path,
        commitSha: response.commit.sha,
        commitUrl: `https://github.com/${owner}/${repo}/commit/${response.commit.sha}`
      };

      ClientTracker.log('GitOperations.createNewFile - Completed successfully', {
        filePath: path,
        commitSha: response.commit.sha
      });

      return result;
    } catch (error) {
      ClientTracker.log('❌ GitOperations.createNewFile - FAILED with error', error);
      console.error('❌ createNewFile failed:', error);
      console.error('❌ Error in createNewFile - type:', typeof error);
      console.error('❌ Error in createNewFile - stack:', error instanceof Error ? error.stack : 'No stack');
      throw new Error(`Failed to create file: ${this.parseGitError(error)}`);
    }
  }

  /**
   * Update existing file in repository
   */
  private async updateExistingFile(
    owner: string,
    repo: string,
    path: string,
    request: Omit<UpdateFileRequest, 'sha'>
  ): Promise<PushResult> {
    try {
      ClientTracker.log('GitOperations.updateExistingFile - Starting', { owner, repo, path });
      console.log('🔧 updateExistingFile - Starting...');
      console.log('🔧 updateExistingFile - Parameters:', { owner, repo, path });

      if (!this.boundClient) {
        ClientTracker.log('❌ GitOperations.updateExistingFile - Bound client is null');
        throw new Error('GitHub bound client is null in updateExistingFile');
      }

      ClientTracker.inspectObject('updateExistingFile.boundClient', this.boundClient);
      ClientTracker.traceMethodCall('boundClient', 'getFile', this.boundClient);
      ClientTracker.traceMethodCall('boundClient', 'updateFile', this.boundClient);

      console.log('🔧 updateExistingFile - Using bound client:', typeof this.boundClient);
      console.log('🔧 updateExistingFile - boundClient.getFile:', typeof this.boundClient.getFile);
      console.log('🔧 updateExistingFile - boundClient.updateFile:', typeof this.boundClient.updateFile);

      // Get current file to obtain SHA using bound client
      ClientTracker.log('GitOperations.updateExistingFile - About to call getFile for SHA');
      console.log('🔍 Getting existing file for SHA...');

      // Safety check for getFile method
      if (typeof this.boundClient.getFile !== 'function') {
        throw new Error(`getFile is not a function at call time (type: ${typeof this.boundClient.getFile})`);
      }

      const existingFile = await this.boundClient.getFile(owner, repo, path);
      ClientTracker.log('GitOperations.updateExistingFile - getFile SUCCESS', { sha: existingFile.sha });
      console.log('✅ Existing file retrieved, SHA:', existingFile.sha);

      const updateRequest: UpdateFileRequest = {
        ...request,
        sha: existingFile.sha
      };

      ClientTracker.log('GitOperations.updateExistingFile - About to call updateFile');
      console.log('🚀 Calling boundClient.updateFile...');

      // Safety check for updateFile method
      if (typeof this.boundClient.updateFile !== 'function') {
        throw new Error(`updateFile is not a function at call time (type: ${typeof this.boundClient.updateFile})`);
      }

      let response;
      try {
        response = await this.boundClient.updateFile(owner, repo, path, updateRequest);
        ClientTracker.log('GitOperations.updateExistingFile - updateFile SUCCESS', { responseType: typeof response });
        console.log('✅ updateFile response received:', typeof response);
      } catch (callError) {
        ClientTracker.log('❌ GitOperations.updateExistingFile - updateFile FAILED', callError);
        console.error('❌ Error during updateFile call:', callError);
        console.error('❌ Error type:', typeof callError);
        console.error('❌ Error message:', callError instanceof Error ? callError.message : String(callError));
        console.error('❌ Error stack:', callError instanceof Error ? callError.stack : 'No stack trace');
        throw callError;
      }

      const result = {
        success: true,
        operation: 'updated' as const,
        filePath: path,
        commitSha: response.commit.sha,
        commitUrl: `https://github.com/${owner}/${repo}/commit/${response.commit.sha}`
      };

      ClientTracker.log('GitOperations.updateExistingFile - Completed successfully', {
        filePath: path,
        commitSha: response.commit.sha
      });

      return result;
    } catch (error) {
      ClientTracker.log('❌ GitOperations.updateExistingFile - FAILED with error', error);
      console.error('❌ updateExistingFile failed:', error);
      console.error('❌ Error in updateExistingFile - type:', typeof error);
      console.error('❌ Error in updateExistingFile - stack:', error instanceof Error ? error.stack : 'No stack');
      throw new Error(`Failed to update file: ${this.parseGitError(error)}`);
    }
  }

  // =============================================================================
  // BRANCH OPERATIONS
  // =============================================================================

  /**
   * Create a new branch from the default branch
   */
  async createBranch(
    repository: RepositoryConfig,
    branchName: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      ClientTracker.log('GitOperations.createBranch - Starting', { repository, branchName });

      if (!this.boundClient) {
        throw new Error('GitHub bound client not initialized');
      }

      const { owner, name, branch: baseBranch = 'main' } = repository;

      // Get the SHA of the base branch
      console.log(`🌿 Getting SHA for base branch: ${baseBranch}`);
      const baseRef = await this.getRef(owner, name, `heads/${baseBranch}`);
      const baseSha = baseRef.object.sha;

      console.log(`✅ Base branch SHA: ${baseSha}`);

      // Create new branch reference
      console.log(`🌿 Creating new branch: ${branchName}`);
      await this.createRef(owner, name, `refs/heads/${branchName}`, baseSha);

      console.log(`✅ Branch ${branchName} created successfully`);
      ClientTracker.log('GitOperations.createBranch - Success');

      return { success: true };

    } catch (error) {
      ClientTracker.log('❌ GitOperations.createBranch - Failed', error);
      console.error('❌ Failed to create branch:', error);

      return {
        success: false,
        error: this.parseGitError(error)
      };
    }
  }

  /**
   * Push token file to a specific branch
   */
  async pushToBranch(
    repository: RepositoryConfig,
    branchName: string,
    fileConfig: TokenFileConfig,
    progressCallback?: ProgressCallback
  ): Promise<PushResult> {
    try {
      console.log(`🚀 Pushing to branch: ${branchName}`);

      // Use the regular pushTokenFile but override the branch
      const branchRepository = {
        ...repository,
        branch: branchName
      };

      return await this.pushTokenFile(branchRepository, fileConfig, progressCallback);

    } catch (error) {
      console.error('❌ Failed to push to branch:', error);

      return {
        success: false,
        operation: 'failed',
        filePath: fileConfig.path,
        error: this.parseGitError(error)
      };
    }
  }

  /**
   * Get a Git reference (branch, tag, etc.)
   */
  private async getRef(owner: string, repo: string, ref: string): Promise<any> {
    if (!this.boundClient) {
      throw new Error('GitHub bound client not initialized');
    }

    const token = this.auth.getState().config?.credentials?.token;
    if (!token) {
      throw new Error('GitHub token not available');
    }

    const url = `https://api.github.com/repos/${owner}/${repo}/git/refs/${ref}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get ref ${ref}: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Create a Git reference (branch)
   */
  private async createRef(owner: string, repo: string, ref: string, sha: string): Promise<any> {
    if (!this.boundClient) {
      throw new Error('GitHub bound client not initialized');
    }

    const token = this.auth.getState().config?.credentials?.token;
    if (!token) {
      throw new Error('GitHub token not available');
    }

    const url = `https://api.github.com/repos/${owner}/${repo}/git/refs`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ref, sha })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create ref ${ref}: ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  }

  /**
   * List all branches in a repository
   */
  async listBranches(repository: RepositoryConfig): Promise<string[]> {
    if (!this.boundClient) {
      throw new Error('GitHub bound client not initialized');
    }

    const token = this.auth.getState().config?.credentials?.token;
    if (!token) {
      throw new Error('GitHub token not available');
    }

    const url = `https://api.github.com/repos/${repository.owner}/${repository.name}/branches`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to list branches: ${response.statusText}`);
    }

    const branches = await response.json();
    return branches.map((branch: any) => branch.name);
  }

  // =============================================================================
  // COMMIT MESSAGE GENERATION
  // =============================================================================

  /**
   * Generate meaningful commit message from token data
   */
  private generateCommitMessage(tokenData: any): string {
    try {
      const timestamp = new Date().toISOString().split('T')[0];

      // Extract metadata if available
      const metadata = tokenData.metadata || {};
      const documentName = metadata.sourceDocument?.name || metadata.documentName || 'Figma';

      // Count tokens if data is structured
      let tokenCount = 0;
      let variableCount = 0;

      if (tokenData.designTokens) {
        tokenCount = Array.isArray(tokenData.designTokens) ? tokenData.designTokens.length : 0;
      }

      if (tokenData.variables) {
        variableCount = Array.isArray(tokenData.variables) ? tokenData.variables.length : 0;
      }

      // Generate descriptive message
      let message = `feat: update design tokens from ${documentName}`;

      if (tokenCount > 0 || variableCount > 0) {
        const parts = [];
        if (tokenCount > 0) parts.push(`${tokenCount} tokens`);
        if (variableCount > 0) parts.push(`${variableCount} variables`);
        message += `\n\n- ${parts.join(', ')}`;
      }

      message += `\n- Exported: ${timestamp}`;

      if (metadata.extraction) {
        message += `\n- Processed: ${metadata.extraction.processedNodes || 0} nodes`;
      }

      return message;

    } catch (error) {
      // Fallback to simple message
      const timestamp = new Date().toISOString().split('T')[0];
      return `feat: update design tokens - ${timestamp}`;
    }
  }

  // =============================================================================
  // ERROR HANDLING
  // =============================================================================

  /**
   * Parse Git/GitHub errors into user-friendly messages
   */
  private parseGitError(error: any): string {
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
        return 'Repository not found or you don\'t have access to it.';
      }

      // File conflicts
      if (message.includes('409') || message.includes('conflict')) {
        return 'File conflict detected. The file may have been modified by someone else.';
      }

      // Rate limiting
      if (message.includes('rate limit')) {
        return 'GitHub API rate limit exceeded. Please try again later.';
      }

      // File too large
      if (message.includes('large') || message.includes('size')) {
        return 'File is too large for GitHub. Consider reducing token data size.';
      }

      return error.message;
    }

    return 'An unknown error occurred during Git operation.';
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  /**
   * Generate static filename (without timestamp)
   * Git commit history tracks changes, no need for timestamped files
   */
  static generateFileName(prefix: string = 'figma-tokens', extension: string = 'json'): string {
    return `${prefix}.${extension}`;
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  /**
   * Custom base64 encoder for Figma plugin environment
   * Since neither Buffer nor btoa are available in Figma plugins
   */
  private customBase64Encode(input: string): string {
    console.log('🔧 Using custom base64 encoder for Figma plugin environment');

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    let i = 0;

    while (i < input.length) {
      const a = input.charCodeAt(i++);
      const b = i < input.length ? input.charCodeAt(i++) : 0;
      const c = i < input.length ? input.charCodeAt(i++) : 0;

      const bitmap = (a << 16) | (b << 8) | c;

      result += chars.charAt((bitmap >> 18) & 63) +
                chars.charAt((bitmap >> 12) & 63) +
                chars.charAt((bitmap >> 6) & 63) +
                chars.charAt(bitmap & 63);
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
   * Calculate UTF-8 byte length for Figma plugin environment
   * Since TextEncoder is not available in Figma plugins
   */
  private getUTF8ByteLength(str: string): number {
    console.log('🔧 Calculating UTF-8 byte length using custom implementation');

    let byteLength = 0;
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);

      if (code < 0x80) {
        // 1-byte character (ASCII)
        byteLength += 1;
      } else if (code < 0x800) {
        // 2-byte character
        byteLength += 2;
      } else if ((code & 0xFC00) === 0xD800) {
        // High surrogate (start of 4-byte character)
        byteLength += 4;
        i++; // Skip the low surrogate
      } else {
        // 3-byte character
        byteLength += 3;
      }
    }

    return byteLength;
  }

  /**
   * Check if client is ready for operations
   */
  isReady(): boolean {
    console.log('🐛 DEBUG: GitOperations.isReady() - Checking readiness...');

    // Always refresh client state in case auth was configured after initialization
    const authHasClient = this.auth.hasClient();
    console.log('🐛 DEBUG: Auth hasClient:', authHasClient);

    // If auth has client but we don't have bound client, refresh it
    if (authHasClient && !this.boundClient) {
      console.log('🐛 DEBUG: Auth has client but bound client is null, refreshing...');
      try {
        this.client = this.auth.getClient();
        this.boundClient = this.auth.createBoundClient();
        console.log('🐛 DEBUG: Successfully refreshed client and bound client');
      } catch (error) {
        console.error('🐛 DEBUG: Failed to refresh client:', error);
        return false;
      }
    }

    const isReady = this.boundClient !== null && authHasClient;
    console.log('🐛 DEBUG: GitOperations.isReady() result:', isReady);
    return isReady;
  }

  /**
   * Get current repository configuration
   */
  getCurrentRepository(): RepositoryConfig | null {
    console.log('🐛 DEBUG: GitOperations.getCurrentRepository() - Called');

    const config = this.auth.getPublicConfig();
    console.log('🐛 DEBUG: getPublicConfig() returned:', {
      hasConfig: !!config,
      hasRepository: !!config?.repository,
      repository: config?.repository ? `${config.repository.owner}/${config.repository.name}` : 'null'
    });

    if (!config?.repository) {
      console.log('🐛 DEBUG: getCurrentRepository() - No repository config found, returning null');
      return null;
    }

    const result = {
      owner: config.repository.owner,
      name: config.repository.name,
      branch: config.repository.branch || 'main'
    };

    console.log('🐛 DEBUG: getCurrentRepository() - Returning:', result);
    return result;
  }
}