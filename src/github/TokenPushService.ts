/**
 * Token Push Service
 *
 * High-level service that integrates Git operations with token extraction workflow.
 * Handles the complete flow from token extraction to GitHub push with user feedback.
 */

import { GitOperations, RepositoryConfig, TokenFileConfig, PushResult, ProgressCallback } from './GitOperations';
import { GitHubAuth } from './GitHubAuth';
import { ClientTracker } from '../debug/ClientTracker';
import { ExtractionResult } from '../TokenExtractor';
import { isHardCodedMode, getTestConfig, getTestFilePath } from './HardCodedConfig';
import { TokenTransformer } from '../TokenTransformer';

// =============================================================================
// TYPES FOR TOKEN PUSH SERVICE
// =============================================================================

export interface PushConfiguration {
  repository: RepositoryConfig;
  targetPath?: string;        // Default: 'tokens/raw/'
  filename?: string;          // Default: auto-generated with timestamp
  commitMessage?: string;     // Default: auto-generated from metadata
}

export interface PushWorkflowResult {
  success: boolean;
  pushResult?: PushResult;
  validation?: any;
  error?: string;
  duration?: number;
  fileInfo?: {
    path: string;
    size: string;
    url?: string;
  };
}

export interface UserFeedback {
  showProgress: (stage: string, message: string, progress?: number) => void;
  showSuccess: (message: string, details?: any) => void;
  showError: (message: string, error?: string) => void;
  showNotification: (message: string, options?: { timeout?: number; error?: boolean }) => void;
}

// =============================================================================
// TOKEN PUSH SERVICE
// =============================================================================

export class TokenPushService {
  private gitOps: GitOperations;
  private auth: GitHubAuth;

  constructor() {
    this.gitOps = new GitOperations();
    this.auth = GitHubAuth.getInstance();
  }

  /**
   * Initialize the service
   */
  async initialize(): Promise<void> {
    await this.gitOps.initialize();
  }

  // =============================================================================
  // MAIN PUSH WORKFLOW
  // =============================================================================

  /**
   * Push extracted tokens to GitHub repository
   */
  async pushTokensToGitHub(
    tokenData: ExtractionResult,
    config: PushConfiguration,
    feedback?: UserFeedback
  ): Promise<PushWorkflowResult> {
    ClientTracker.log('TokenPushService.pushTokensToGitHub - Starting', {
      configRepo: `${config.repository.owner}/${config.repository.name}`,
      targetPath: config.targetPath,
      hasTokenData: !!tokenData
    });
    console.log('🔧 TokenPushService.pushTokensToGitHub - Starting...');
    console.log('🔧 Config received:', JSON.stringify(config, null, 2));
    console.log('🔧 GitOps instance:', typeof this.gitOps);
    console.log('🔧 GitOps.isReady():', this.gitOps.isReady());

    const startTime = Date.now();

    try {
      feedback?.showProgress('init', 'Initializing Git operations...', 5);

      // Check if Git operations are ready
      ClientTracker.log('TokenPushService.pushTokensToGitHub - Checking GitOps readiness');
      if (!this.gitOps.isReady()) {
        ClientTracker.log('❌ TokenPushService.pushTokensToGitHub - GitOps not ready');
        throw new Error('GitHub client not configured. Please setup GitHub integration first.');
      }
      ClientTracker.log('✅ TokenPushService.pushTokensToGitHub - GitOps is ready');

      feedback?.showProgress('validate', 'Validating repository access...', 15);

      // Validate repository
      ClientTracker.log('TokenPushService.pushTokensToGitHub - About to validate repository', config.repository);
      console.log('🔧 About to validate repository:', config.repository);
      console.log('🔧 GitOps.validateRepository type:', typeof this.gitOps.validateRepository);

      let validation;
      try {
        validation = await this.gitOps.validateRepository(config.repository);
        ClientTracker.log('TokenPushService.pushTokensToGitHub - Repository validation SUCCESS', {
          isValid: validation.isValid,
          canWrite: validation.canWrite
        });
        console.log('🔧 Repository validation result:', validation);
        if (!validation.isValid) {
          throw new Error(validation.error || 'Repository validation failed');
        }
      } catch (validationError) {
        ClientTracker.log('❌ TokenPushService.pushTokensToGitHub - Repository validation FAILED', validationError);
        console.error('❌ Repository validation error:', validationError);
        console.error('❌ Validation error type:', typeof validationError);
        throw validationError;
      }

      feedback?.showProgress('prepare', 'Preparing token data...', 30);

      // Prepare file configuration
      ClientTracker.log('TokenPushService.pushTokensToGitHub - Preparing file configuration');
      console.log('🔧 Preparing file configuration...');
      const fileConfig = this.prepareFileConfig(tokenData, config);
      ClientTracker.log('TokenPushService.pushTokensToGitHub - File config prepared', {
        path: fileConfig.path,
        contentSize: JSON.stringify(fileConfig.content).length
      });
      console.log('🔧 File config prepared:', {
        path: fileConfig.path,
        hasContent: !!fileConfig.content,
        contentSize: JSON.stringify(fileConfig.content).length,
        message: fileConfig.message?.substring(0, 100) + '...'
      });

      feedback?.showProgress('push', 'Pushing tokens to GitHub...', 50);

      // Create progress callback for Git operations
      const gitProgressCallback: ProgressCallback = (stage, message, progress) => {
        const adjustedProgress = 50 + (progress || 0) * 0.4; // Map 0-100 to 50-90
        feedback?.showProgress(stage, message, adjustedProgress);
      };

      // Push file to repository
      ClientTracker.log('TokenPushService.pushTokensToGitHub - About to call gitOps.pushTokenFile', {
        repository: `${config.repository.owner}/${config.repository.name}`,
        filePath: fileConfig.path,
        gitOpsType: typeof this.gitOps,
        pushTokenFileType: typeof this.gitOps.pushTokenFile
      });
      console.log('🔧 About to call gitOps.pushTokenFile...');
      console.log('🔧 Repository:', config.repository);
      console.log('🔧 File config path:', fileConfig.path);
      console.log('🔧 GitOps.pushTokenFile type:', typeof this.gitOps.pushTokenFile);

      let pushResult;
      try {
        pushResult = await this.gitOps.pushTokenFile(
          config.repository,
          fileConfig,
          gitProgressCallback
        );
        ClientTracker.log('TokenPushService.pushTokensToGitHub - pushTokenFile SUCCESS', {
          success: pushResult.success,
          operation: pushResult.operation,
          filePath: pushResult.filePath
        });
        console.log('🔧 pushTokenFile result:', pushResult);

        if (!pushResult.success) {
          throw new Error(pushResult.error || 'Failed to push tokens');
        }
      } catch (pushError) {
        ClientTracker.log('❌ TokenPushService.pushTokensToGitHub - pushTokenFile FAILED', pushError);
        console.error('❌ pushTokenFile error:', pushError);
        console.error('❌ Push error type:', typeof pushError);
        console.error('❌ Push error stack:', pushError instanceof Error ? pushError.stack : 'No stack trace');
        throw pushError;
      }

      ClientTracker.log('TokenPushService.pushTokensToGitHub - Completed successfully', {
        duration: Date.now() - startTime,
        operation: pushResult.operation
      });
      feedback?.showProgress('complete', 'Tokens pushed successfully!', 100);

      const duration = Date.now() - startTime;
      const result: PushWorkflowResult = {
        success: true,
        pushResult,
        validation,
        duration,
        fileInfo: {
          path: pushResult.filePath,
          size: GitOperations.formatFileSize(pushResult.fileSize || 0),
          url: pushResult.commitUrl
        }
      };

      // Show success feedback
      this.showSuccessFeedback(result, feedback);

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      ClientTracker.log('❌ TokenPushService.pushTokensToGitHub - FAILED with error', {
        error: errorMessage,
        duration,
        errorType: typeof error,
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });

      feedback?.showError('Push failed', errorMessage);

      return {
        success: false,
        error: errorMessage,
        duration
      };
    }
  }

  /**
   * Quick push with default configuration
   */
  async quickPush(
    tokenData: ExtractionResult,
    feedback?: UserFeedback
  ): Promise<PushWorkflowResult> {
    console.log('🔧 TokenPushService.quickPush - Starting...');
    console.log('🔧 TokenData summary:', {
      tokens: tokenData.tokens.length,
      variables: tokenData.variables.length,
      collections: tokenData.collections.length,
      documentName: tokenData.metadata.documentName
    });

    try {
      let config: PushConfiguration;

      // Use hard-coded configuration if enabled
      if (isHardCodedMode()) {
        console.log('🚀 Using hard-coded configuration for quick push...');

        const testConfig = getTestConfig();
        config = {
          repository: {
            owner: testConfig.repository.owner,
            name: testConfig.repository.name,
            branch: testConfig.repository.branch || 'main'
          },
          targetPath: 'tokens/raw/',
          filename: getTestFilePath().split('/').pop(), // Extract filename from path
          commitMessage: `feat: update design tokens from Figma

- ${tokenData.tokens.length} design tokens
- ${tokenData.variables.length} variables
- ${tokenData.collections.length} collections
- Exported: ${new Date().toISOString().split('T')[0]}
- Source: ${tokenData.metadata.documentName}

🤖 Generated with Figma Design System Distributor`
        };

        console.log(`📁 Target: ${config.repository.owner}/${config.repository.name}`);
        console.log(`📂 Path: ${config.targetPath}${config.filename}`);
        console.log('🔧 Hard-coded config created:', JSON.stringify(config, null, 2));

      } else {
        // Normal flow - get repository from auth config
        console.log('🐛 DEBUG: TokenPushService.quickPush - Getting repository from GitOps...');
        const repository = this.gitOps.getCurrentRepository();
        console.log('🐛 DEBUG: GitOps.getCurrentRepository() returned:', repository);

        if (!repository) {
          console.error('🐛 DEBUG: TokenPushService.quickPush - No repository configured!');

          // Let's also check the auth state directly
          const authState = this.auth.getState();
          console.error('🐛 DEBUG: Auth state when repository is null:', {
            isConfigured: authState.isConfigured,
            isConnected: authState.isConnected,
            hasConfig: !!authState.config,
            hasClient: this.auth.hasClient()
          });

          throw new Error('No repository configured. Please setup GitHub integration first.');
        }

        console.log('🐛 DEBUG: Creating config with repository:', repository);
        config = { repository };
      }

      console.log('🔧 About to call pushTokensToGitHub with config:', config);
      console.log('🔧 TokenPushService - this.pushTokensToGitHub type:', typeof this.pushTokensToGitHub);

      const result = await this.pushTokensToGitHub(tokenData, config, feedback);
      console.log('🔧 pushTokensToGitHub result:', result.success ? 'SUCCESS' : 'FAILED');
      return result;

    } catch (error) {
      console.error('❌ Error in TokenPushService.quickPush:', error);
      console.error('❌ Error type:', typeof error);
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      const errorMessage = error instanceof Error ? error.message : 'Quick push failed';
      feedback?.showError('Quick push failed', errorMessage);

      return {
        success: false,
        error: errorMessage,
        duration: 0
      };
    }
  }

  // =============================================================================
  // CONFIGURATION HELPERS
  // =============================================================================

  /**
   * Prepare file configuration from token data and push config
   */
  private prepareFileConfig(
    tokenData: ExtractionResult,
    config: PushConfiguration
  ): TokenFileConfig {
    console.log('🔧 prepareFileConfig - Input config:', config);
    console.log('🔧 prepareFileConfig - TokenData metadata:', tokenData.metadata);
    // Generate filename if not provided
    const filename = config.filename || GitOperations.generateFileName('figma-tokens', 'json');

    // Construct full path
    const basePath = config.targetPath || 'tokens/raw/';
    const fullPath = basePath.endsWith('/') ? `${basePath}${filename}` : `${basePath}/${filename}`;

    // Prepare structured data for GitHub
    console.log('🔧 Creating structured token data...');
    const structuredData = this.createStructuredTokenData(tokenData);
    console.log('🔧 Structured data created, size:', JSON.stringify(structuredData).length, 'bytes');

    const result = {
      path: fullPath,
      content: structuredData,
      message: config.commitMessage
    };

    console.log('🔧 prepareFileConfig - Result:', {
      path: result.path,
      hasContent: !!result.content,
      hasMessage: !!result.message
    });

    return result;
  }

  /**
   * Create structured token data for GitHub storage
   */
  private createStructuredTokenData(tokenData: ExtractionResult): any {
    // Use TokenTransformer to create clean output
    const transformer = new TokenTransformer();

    const rawData = {
      metadata: {
        sourceDocument: {
          name: tokenData.metadata.documentName
        },
        tokenCounts: {
          totalTokens: tokenData.tokens.length,
          totalVariables: tokenData.variables.length
        }
      },
      variables: tokenData.variables,
      collections: tokenData.collections,
      designTokens: tokenData.tokens
    };

    return transformer.transform(rawData);
  }

  // =============================================================================
  // USER FEEDBACK
  // =============================================================================

  /**
   * Show success feedback to user
   */
  private showSuccessFeedback(result: PushWorkflowResult, feedback?: UserFeedback): void {
    if (!feedback || !result.pushResult) return;

    const { pushResult, fileInfo, duration } = result;
    const operation = pushResult.operation === 'created' ? 'Created' : 'Updated';

    // Main success message
    feedback.showSuccess(
      `🎉 Tokens ${pushResult.operation} successfully!`,
      {
        file: fileInfo?.path,
        size: fileInfo?.size,
        duration: duration ? `${duration}ms` : undefined,
        commit: pushResult.commitSha?.substring(0, 8)
      }
    );

    // Notification
    feedback.showNotification(
      `${operation} ${fileInfo?.path} (${fileInfo?.size})`,
      { timeout: 4000 }
    );
  }

  // =============================================================================
  // VALIDATION AND STATUS
  // =============================================================================

  /**
   * Test repository connection before push
   */
  async testConnection(repository?: RepositoryConfig): Promise<{
    success: boolean;
    message: string;
    canPush: boolean;
    error?: string;
  }> {
    try {
      const repo = repository || this.gitOps.getCurrentRepository();
      if (!repo) {
        throw new Error('No repository configured');
      }

      const validation = await this.gitOps.validateRepository(repo);

      return {
        success: validation.isValid,
        message: validation.isValid
          ? `✅ Connected to ${repo.owner}/${repo.name}`
          : `❌ ${validation.error}`,
        canPush: validation.canWrite,
        error: validation.error
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Connection failed`,
        canPush: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get service status
   */
  getStatus(): {
    isReady: boolean;
    hasRepository: boolean;
    repositoryInfo?: string;
  } {
    const isReady = this.gitOps.isReady();
    const repository = this.gitOps.getCurrentRepository();

    return {
      isReady,
      hasRepository: !!repository,
      repositoryInfo: repository ? `${repository.owner}/${repository.name}` : undefined
    };
  }

  // =============================================================================
  // FIGMA INTEGRATION HELPERS
  // =============================================================================

  /**
   * Create Figma UI-compatible feedback interface
   */
  static createFigmaFeedback(): UserFeedback {
    return {
      showProgress: (stage: string, message: string, progress?: number) => {
        console.log(`[${stage.toUpperCase()}] ${message} ${progress ? `(${progress}%)` : ''}`);

        // Show Figma notification for key stages
        if (['validate', 'push', 'complete', 'error'].includes(stage)) {
          figma.notify(message, {
            timeout: stage === 'complete' ? 3000 : 1500,
            error: stage === 'error'
          });
        }
      },

      showSuccess: (message: string, details?: any) => {
        console.log('✅ SUCCESS:', message, details);
        figma.notify(message, { timeout: 4000 });
      },

      showError: (message: string, error?: string) => {
        console.error('❌ ERROR:', message, error);
        figma.notify(`${message}${error ? `: ${error}` : ''}`, {
          error: true,
          timeout: 6000
        });
      },

      showNotification: (message: string, options?: { timeout?: number; error?: boolean }) => {
        figma.notify(message, {
          timeout: options?.timeout || 3000,
          error: options?.error || false
        });
      }
    };
  }
}