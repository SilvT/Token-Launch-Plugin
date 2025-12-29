/**
 * Export Workflow Manager
 *
 * Manages the complete workflow from token extraction through user choice
 * to either Git push or local download, integrating all components.
 */

import { ExtractionResult, TokenExtractor } from '../TokenExtractor';
import { DocumentInfo } from '../types/CommonTypes';
import { UnifiedExportUI, UnifiedExportUIOptions, ExportChoice } from '../ui/UnifiedExportUI';
import { GitHubSetupUI } from '../ui/GitHubSetupUI';
import { TokenPushService } from '../github/TokenPushService';
import { GitHubAuth } from '../github/GitHubAuth';
import { TokenTransformer } from '../TokenTransformer';
import { PRWorkflowUI, PRDetails, PRSuccess } from '../ui/PRWorkflowUI';
import { PullRequestService } from '../github/PullRequestService';
import { GitOperations, TokenFileConfig } from '../github/GitOperations';
import { ErrorHandler } from '../errors/ErrorHandler';
import { WorkflowTriggerConfig, WorkflowTriggerResult } from '../github/GitHubTypes';

// =============================================================================
// TYPES
// =============================================================================

export interface WorkflowOptions {
  tokenExtractor: TokenExtractor;
  documentInfo: DocumentInfo;
}

export interface WorkflowResult {
  success: boolean;
  choice: 'git-push' | 'download' | 'cancel';
  extractionResult?: ExtractionResult;
  gitResult?: any;
  downloadResult?: any;
  error?: string;
  duration: number;
}

// =============================================================================
// EXPORT WORKFLOW MANAGER
// =============================================================================

export class ExportWorkflow {
  private tokenExtractor: TokenExtractor;
  private documentInfo: DocumentInfo;
  private githubAuth: GitHubAuth;
  private pushService: TokenPushService;
  private prService: PullRequestService;
  private gitOps: GitOperations;
  private cancelCount: number = 0;

  constructor(options: WorkflowOptions) {
    this.tokenExtractor = options.tokenExtractor;
    this.documentInfo = options.documentInfo;
    this.githubAuth = GitHubAuth.getInstance();
    this.pushService = new TokenPushService();
    this.prService = new PullRequestService();
    this.gitOps = new GitOperations();
  }

  /**
   * Run the complete export workflow
   */
  async runWorkflow(): Promise<WorkflowResult> {
    const startTime = Date.now();

    try {
      console.log('🚀 Starting export workflow...');

      // Step 1: Initialize GitHub services only (no setup wizard)
      await this.initializeGitHubServices();

      // Step 2: Extract tokens
      figma.notify('Extracting design tokens...', { timeout: 2000 });
      const extractionResult = await this.extractTokens();

      // Step 3: Show unified UI (includes both export options and GitHub setup)
      const userChoice = await this.showUnifiedUI(extractionResult);

      // Step 4: Handle user choice
      const result = await this.handleUserChoice(userChoice, extractionResult);

      const duration = Date.now() - startTime;
      return {
        ...result,
        extractionResult,
        duration
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error('❌ Workflow failed:', error);

      return {
        success: false,
        choice: 'cancel',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration
      };
    }
  }

  /**
   * Initialize GitHub services without running setup wizard
   */
  private async initializeGitHubServices(): Promise<void> {
    try {
      console.log('🐛 DEBUG: ExportWorkflow.initializeGitHubServices() - START');

      console.log('🐛 DEBUG: Initializing GitHubAuth...');
      await this.githubAuth.initialize();
      console.log('🐛 DEBUG: GitHubAuth initialized');

      const authState = this.githubAuth.getState();
      console.log('🐛 DEBUG: GitHubAuth state after init:', {
        isConfigured: authState.isConfigured,
        isConnected: authState.isConnected,
        hasConfig: !!authState.config,
        hasClient: this.githubAuth.hasClient(),
        errors: authState.errors
      });

      console.log('🐛 DEBUG: Initializing TokenPushService...');
      await this.pushService.initialize();
      console.log('🐛 DEBUG: TokenPushService initialized');

      console.log('🐛 DEBUG: Initializing PullRequestService...');
      await this.prService.initialize();
      console.log('🐛 DEBUG: PullRequestService initialized');

      console.log('🐛 DEBUG: Initializing GitOperations...');
      await this.gitOps.initialize();
      console.log('🐛 DEBUG: GitOperations initialized');

      // Verify the complete initialization chain
      if (this.githubAuth.hasClient()) {
        console.log('🐛 DEBUG: Verifying client availability...');
        const client = this.githubAuth.getClient();
        console.log('🐛 DEBUG: Client verification:', {
          available: !!client,
          clientId: client.getClientId(),
          methodTypes: {
            fileExists: typeof client.fileExists,
            createFile: typeof client.createFile,
            getRepository: typeof client.getRepository
          }
        });
      } else {
        console.log('🐛 DEBUG: No client available after initialization');
      }

      console.log('🐛 DEBUG: ExportWorkflow.initializeGitHubServices() - END, SUCCESS');
    } catch (error) {
      console.error('🐛 DEBUG: ExportWorkflow.initializeGitHubServices() - ERROR:', error);
      console.error('🐛 DEBUG: Error type:', typeof error);
      console.error('🐛 DEBUG: Error stack:', error instanceof Error ? error.stack : 'No stack');
      console.warn('⚠️ GitHub service initialization partial, continuing anyway');
      // Continue anyway - Git operations might not be available
    }
  }

  /**
   * Extract design tokens from Figma
   */
  private async extractTokens(): Promise<ExtractionResult> {
    console.log('📊 Extracting design tokens...');

    const result = await this.tokenExtractor.extractAllTokens();

    const totalTokens = result.tokens.length + result.variables.length;
    console.log(`✅ Extracted ${totalTokens} tokens (${result.tokens.length} design tokens, ${result.variables.length} variables)`);

    if (result.metadata.errors.length > 0) {
      console.warn(`⚠️ Extraction completed with ${result.metadata.errors.length} errors`);
    }

    return result;
  }


  /**
   * Show the unified UI with export options and GitHub setup
   */
  private async showUnifiedUI(
    extractionResult: ExtractionResult
  ): Promise<ExportChoice> {
    // Get existing GitHub configuration from storage
    const authState = this.githubAuth.getState();
    const existingConfig = authState.config;

    const uiOptions: UnifiedExportUIOptions = {
      extractionResult,
      documentInfo: this.documentInfo,
      existingGitConfig: existingConfig
    };

    const unifiedUI = new UnifiedExportUI(uiOptions);
    return await unifiedUI.showChoice();
  }

  /**
   * Handle the user's export choice
   */
  private async handleUserChoice(
    choice: ExportChoice,
    extractionResult: ExtractionResult
  ): Promise<Omit<WorkflowResult, 'extractionResult' | 'duration'>> {
    switch (choice.type) {
      case 'git-push':
        return await this.handleGitPush(extractionResult, choice);

      case 'download':
        return await this.handleDownload(extractionResult);

      case 'cancel':
        console.log('👋 User cancelled export');
        figma.notify('Export cancelled');
        return {
          success: false,
          choice: 'cancel'
        };

      default:
        throw new Error(`Unknown choice type: ${choice.type}`);
    }
  }

  /**
   * Handle Git push workflow using PR-based workflow
   */
  private async handleGitPush(
    extractionResult: ExtractionResult,
    choice: ExportChoice
  ): Promise<Omit<WorkflowResult, 'extractionResult' | 'duration'>> {
    try {
      console.log('🐛 DEBUG: ExportWorkflow.handleGitPush() - Using PR Workflow');

      // Configure GitHub services with the provided configuration
      if (choice.gitConfig) {
        const configResult = await this.githubAuth.configure(choice.gitConfig);
        if (!configResult.success) {
          throw new Error(configResult.error || 'Failed to configure GitHub services');
        }
      }

      // Get repository configuration
      const repository = this.gitOps.getCurrentRepository();
      if (!repository) {
        throw new Error('No repository configured');
      }

      // Get base branch from config (default to 'main')
      const config = this.githubAuth.getPublicConfig();
      const baseBranch = config?.repository?.branch || 'main';

      console.log('📝 Starting PR workflow...');
      console.log('   Repository:', `${repository.owner}/${repository.name}`);
      console.log('   Base branch:', baseBranch);

      // Fetch available branches
      let availableBranches: string[] = [];
      try {
        availableBranches = await this.gitOps.listBranches(repository);
        console.log('   Available branches:', availableBranches);
      } catch (error) {
        console.warn('⚠️ Could not fetch branches:', error);
        // Continue with just the base branch if fetch fails
        availableBranches = [baseBranch];
      }

      // Show PR workflow UI and wait for user confirmation
      const prDetails = await new Promise<PRDetails | null>((resolve) => {
        const prUI = new PRWorkflowUI({
          tokenData: extractionResult,
          defaultBranch: baseBranch,
          availableBranches,
          onComplete: (details) => resolve(details),
          onCancel: () => resolve(null)
        });

        prUI.show();
      });

      // User cancelled - return to landing page
      if (!prDetails) {
        this.cancelCount++;
        console.log(`↩️ User cancelled PR workflow (attempt ${this.cancelCount}), returning to landing page...`);

        // Prevent infinite loop - after 3 cancellations, end the workflow
        if (this.cancelCount >= 3) {
          console.log('⚠️ Maximum cancellations reached, ending workflow');
          figma.notify('Workflow cancelled after multiple attempts');
          return {
            success: false,
            choice: 'cancel'
          };
        }

        figma.notify('Returning to export options...');

        // Re-show the unified UI to let user choose again
        const newChoice = await this.showUnifiedUI(extractionResult);

        // Reset cancel counter if user chooses a different option
        if (newChoice.type !== 'git-push') {
          this.cancelCount = 0;
        }

        // Handle the new choice recursively
        return await this.handleUserChoice(newChoice, extractionResult);
      }

      console.log('✅ User confirmed details:', {
        action: prDetails.action,
        branchName: prDetails.branchName
      });

      // Reset cancel counter on successful confirmation
      this.cancelCount = 0;

      // Execute workflow based on action
      if (prDetails.action === 'push-to-branch') {
        return await this.executePushToBranch(
          extractionResult,
          repository,
          prDetails
        );
      } else {
        return await this.executeCreatePR(
          extractionResult,
          repository,
          prDetails,
          baseBranch
        );
      }

    } catch (error) {
      console.error('❌ PR workflow failed:', error);

      // Handle error with comprehensive dialog
      const errorResult = await ErrorHandler.handle({
        error,
        context: 'GitHub PR Workflow',
        showDialog: true,
        showTechnicalDetails: true,
        onRetry: undefined, // Can't retry from here - would need to restart workflow
        onFallback: async () => {
          await this.handleDownload(extractionResult);
        }
      });

      // Check if user chose fallback
      if (errorResult.dialogResult?.action === 'fallback') {
        return await this.handleDownload(extractionResult);
      }

      return {
        success: false,
        choice: 'git-push',
        error: errorResult.metadata.userMessage
      };
    }
  }

  /**
   * Execute push to branch workflow (no PR)
   */
  private async executePushToBranch(
    extractionResult: ExtractionResult,
    repository: any,
    prDetails: PRDetails
  ): Promise<Omit<WorkflowResult, 'extractionResult' | 'duration'>> {
    try {
      const branchName = prDetails.branchName;

      figma.notify(`Pushing to branch: ${branchName}...`, { timeout: 2000 });
      console.log(`📤 Pushing tokens to branch: ${branchName}`);

      // If creating new branch, create it first
      if (prDetails.isNewBranch) {
        console.log(`🌿 Creating new branch: ${branchName}`);
        const branchResult = await this.gitOps.createBranch(repository, branchName);

        if (!branchResult.success) {
          throw new Error(branchResult.error || 'Failed to create branch');
        }
      }

      // Push tokens to branch
      const fileConfig: TokenFileConfig = {
        path: 'tokens/raw/figma-tokens.json',
        content: this.prepareTokenData(extractionResult),
        message: prDetails.commitMessage
      };

      const pushResult = await this.gitOps.pushToBranch(
        repository,
        branchName,
        fileConfig
      );

      if (!pushResult.success) {
        throw new Error(pushResult.error || 'Failed to push tokens');
      }

      console.log(`✅ Tokens pushed to branch: ${branchName}`);
      figma.notify(`✅ Pushed to ${branchName}`, { timeout: 3000 });

      // Show success
      const prUI = new PRWorkflowUI({
        tokenData: extractionResult,
        onComplete: () => {},
        onCancel: () => {}
      });

      prUI.showSuccess({
        action: 'push-to-branch',
        branchName: branchName,
        prUrl: `https://github.com/${repository.owner}/${repository.name}/tree/${branchName}`
      });

      return {
        success: true,
        choice: 'git-push',
        gitResult: {
          branchName,
          pushResult
        }
      };

    } catch (error) {
      console.error('❌ Push to branch failed:', error);
      throw error;
    }
  }

  /**
   * Execute create PR workflow: create branch, push tokens, create PR
   */
  private async executeCreatePR(
    extractionResult: ExtractionResult,
    repository: any,
    prDetails: PRDetails,
    baseBranch: string
  ): Promise<Omit<WorkflowResult, 'extractionResult' | 'duration'>> {
    try {
      // Step 1: Ensure branch name is unique
      figma.notify('Creating branch...', { timeout: 2000 });
      console.log('🌿 Ensuring unique branch name...');

      const uniqueBranchName = await this.prService.generateUniqueBranchName(
        repository,
        prDetails.branchName
      );

      if (uniqueBranchName !== prDetails.branchName) {
        console.log(`   Branch ${prDetails.branchName} exists, using ${uniqueBranchName}`);
        prDetails.branchName = uniqueBranchName;
      }

      // Step 2: Create new branch
      console.log(`🌿 Creating branch: ${prDetails.branchName}`);
      const branchResult = await this.gitOps.createBranch(repository, prDetails.branchName);

      if (!branchResult.success) {
        throw new Error(branchResult.error || 'Failed to create branch');
      }

      console.log('✅ Branch created successfully');

      // Step 3: Push tokens to new branch
      figma.notify('Pushing tokens to branch...', { timeout: 2000 });
      console.log(`📤 Pushing tokens to branch: ${prDetails.branchName}`);

      const fileConfig: TokenFileConfig = {
        path: 'tokens/raw/figma-tokens.json',
        content: this.prepareTokenData(extractionResult),
        message: prDetails.commitMessage
      };

      const pushResult = await this.gitOps.pushToBranch(
        repository,
        prDetails.branchName,
        fileConfig
      );

      if (!pushResult.success) {
        throw new Error(pushResult.error || 'Failed to push tokens');
      }

      console.log('✅ Tokens pushed successfully');

      // Step 4: Create Pull Request
      figma.notify('Creating pull request...', { timeout: 2000 });
      console.log('📝 Creating pull request...');

      const prResult = await this.prService.createPullRequest(
        repository,
        prDetails,
        baseBranch
      );

      if (!prResult.success) {
        throw new Error(prResult.error || 'Failed to create pull request');
      }

      console.log(`✅ Pull request #${prResult.prNumber} created!`);

      // Step 5: Optionally trigger GitHub Actions workflow
      let workflowResult: WorkflowTriggerResult = { triggered: false };

      if (prDetails.workflowTrigger?.enabled) {
        console.log('🔄 Triggering GitHub Actions workflow...');
        const triggerStart = performance.now();

        workflowResult = await this.triggerWorkflowSafely(
          repository,
          prDetails.workflowTrigger,
          prDetails.branchName
        );

        const triggerDuration = performance.now() - triggerStart;
        console.log(`✅ Workflow trigger completed in ${triggerDuration.toFixed(0)}ms`);
      }

      // Step 6: Show success
      const prSuccess: PRSuccess = {
        action: 'create-pr',
        prNumber: prResult.prNumber!,
        prUrl: prResult.prUrl!,
        branchName: prDetails.branchName,
        workflowTrigger: workflowResult  // NEW: Include workflow trigger result
      };

      // Show success modal through PR workflow UI
      const prUI = new PRWorkflowUI({
        tokenData: extractionResult,
        defaultBranch: baseBranch,
        onComplete: () => {},
        onCancel: () => {}
      });
      prUI.showSuccess(prSuccess);

      return {
        success: true,
        choice: 'git-push',
        gitResult: {
          prNumber: prResult.prNumber,
          prUrl: prResult.prUrl,
          branchName: prDetails.branchName,
          pushResult
        }
      };

    } catch (error) {
      console.error('❌ PR workflow execution failed:', error);
      throw error;
    }
  }

  /**
   * Safely triggers workflow without throwing errors
   * Failures here should NOT prevent PR creation success
   */
  private async triggerWorkflowSafely(
    repository: any,
    workflowConfig: WorkflowTriggerConfig,
    branchName: string
  ): Promise<WorkflowTriggerResult> {
    try {
      // Get the client from GitHubAuth
      const client = this.githubAuth.getClient();
      if (!client) {
        return {
          triggered: true,
          success: false,
          error: 'GitHub client not available'
        };
      }

      const result = await client.triggerWorkflow(
        repository.owner,
        repository.name,
        workflowConfig.workflowFileName,
        branchName,
        workflowConfig.inputs
      );

      if (result.success) {
        const workflowUrl = `https://github.com/${repository.owner}/${repository.name}/actions`;
        return {
          triggered: true,
          success: true,
          workflowUrl
        };
      } else {
        console.warn('⚠️ Workflow trigger failed:', result.error);
        return {
          triggered: true,
          success: false,
          error: result.error
        };
      }
    } catch (error: any) {
      console.error('❌ Unexpected error triggering workflow:', error);
      return {
        triggered: true,
        success: false,
        error: error.message || 'Unexpected error'
      };
    }
  }

  /**
   * Prepare token data for GitHub push
   */
  private prepareTokenData(extractionResult: ExtractionResult): any {
    const transformer = new TokenTransformer();

    const rawData = {
      metadata: {
        sourceDocument: {
          name: extractionResult.metadata.documentName
        },
        tokenCounts: {
          totalTokens: extractionResult.tokens.length,
          totalVariables: extractionResult.variables.length
        }
      },
      variables: extractionResult.variables,
      collections: extractionResult.collections,
      designTokens: extractionResult.tokens
    };

    return transformer.transform(rawData);
  }

  /**
   * Handle local download workflow
   */
  private async handleDownload(
    extractionResult: ExtractionResult
  ): Promise<Omit<WorkflowResult, 'extractionResult' | 'duration'>> {
    try {
      console.log('💾 Starting download workflow...');

      // Use the existing download function
      const extractionDuration = Date.now() - new Date(extractionResult.metadata.extractedAt).getTime();
      await this.triggerDownload(extractionResult, extractionDuration);

      return {
        success: true,
        choice: 'download',
        downloadResult: { initiated: true }
      };

    } catch (error) {
      console.error('❌ Download failed:', error);

      const errorMessage = error instanceof Error ? error.message : 'Download failed';
      figma.notify(`Download failed: ${errorMessage}`, { error: true });

      return {
        success: false,
        choice: 'download',
        error: errorMessage
      };
    }
  }

  /**
   * Trigger the existing download functionality
   */
  private async triggerDownload(result: ExtractionResult, extractionDuration: number): Promise<void> {
    // Import the download function from main.ts (you'll need to export it)
    // For now, recreate the functionality here

    const dataset = this.createJSONDataset(result, extractionDuration);
    const jsonString = JSON.stringify(dataset, null, 2);

    // Generate filename
    const timestamp = new Date().toISOString()
      .replace(/:/g, '-')
      .replace(/\..+/, '')
      .replace('T', '-');
    const filename = `figma-tokens-${timestamp}.json`;

    // Create download UI (simplified version)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <link href="https://unpkg.com/phosphor-icons@1.4.2/src/css/icons.css" rel="stylesheet">
        <style>
          body { font-family: Inter, sans-serif; padding: 20px; text-align: center; }
          .download-btn {
            background: #000000; color: white; border: none;
            padding: 12px 24px; border-radius: 8px; cursor: pointer;
            font-size: 14px; font-weight: 600; margin: 10px;
            transition: all 150ms ease;
          }
          .download-btn:hover {
            background: #404040;
          }
          .file-info {
            background: #F5F5F5; padding: 16px; border-radius: 8px;
            margin: 16px 0; text-align: left;
          }
        </style>
      </head>
      <body>
        <h2><i class="ph-file-text" data-weight="duotone"></i> Download Design Tokens</h2>
        <div class="file-info">
          <strong>File:</strong> ${filename}<br>
          <strong>Size:</strong> ${(jsonString.length / 1024).toFixed(1)} KB<br>
          <strong>Tokens:</strong> ${result.tokens.length + result.variables.length}
        </div>
        <button class="download-btn" onclick="downloadFile()">Download JSON File</button>
        <button class="download-btn" onclick="closePlugin()" style="background: var(--color-text-secondary);">Close</button>

        <script>
          const jsonData = ${JSON.stringify(jsonString)};
          const filename = "${filename}";

          function downloadFile() {
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);

            setTimeout(() => {
              parent.postMessage({ pluginMessage: { type: 'close-plugin' } }, '*');
            }, 1000);
          }

          function closePlugin() {
            parent.postMessage({ pluginMessage: { type: 'close-plugin' } }, '*');
          }
        </script>
      </body>
      </html>
    `;

    figma.showUI(htmlContent, {
      width: 450,
      height: 300,
      title: 'Download Design Tokens'
    });

    figma.ui.onmessage = (msg) => {
      if (msg.type === 'close-plugin') {
        figma.closePlugin('JSON file download completed!');
      }
    };
  }

  /**
   * Create JSON dataset for download
   */
  private createJSONDataset(result: ExtractionResult, extractionDuration: number): any {
    // Use TokenTransformer to create clean output
    const transformer = new TokenTransformer();

    const rawData = {
      metadata: {
        sourceDocument: {
          name: this.documentInfo.name
        },
        tokenCounts: {
          totalTokens: result.tokens.length,
          totalVariables: result.variables.length
        }
      },
      variables: result.variables,
      collections: result.collections,
      designTokens: result.tokens
    };

    return transformer.transform(rawData);
  }

  /**
   * Offer download fallback when Git push fails
   */
  private async offerDownloadFallback(): Promise<boolean> {
    return new Promise((resolve) => {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <link href="https://unpkg.com/phosphor-icons@1.4.2/src/css/icons.css" rel="stylesheet">
          <style>
            body { font-family: Inter, sans-serif; padding: 20px; text-align: center; }
            .btn {
              padding: 12px 24px; margin: 8px; border: none; border-radius: 8px;
              cursor: pointer; font-size: 14px; font-weight: 600;
              transition: all 150ms ease;
            }
            .primary { background: #000000; color: white; }
            .primary:hover { background: #404040; }
            .secondary { background: #F5F5F5; color: #000000; border: 2px solid #000000; }
            .secondary:hover { background: #E5E5E5; }
          </style>
        </head>
        <body>
          <h3><i class="ph-prohibit" data-weight="fill"></i> Git Push Failed</h3>
          <p>Would you like to download the tokens locally instead?</p>
          <button class="btn primary" onclick="fallback(true)">Yes, Download</button>
          <button class="btn secondary" onclick="fallback(false)">No, Cancel</button>

          <script>
            function fallback(shouldDownload) {
              parent.postMessage({
                pluginMessage: { type: 'fallback-choice', download: shouldDownload }
              }, '*');
            }
          </script>
        </body>
        </html>
      `;

      figma.showUI(htmlContent, { width: 350, height: 200, title: 'Git Push Failed' });

      figma.ui.onmessage = (msg) => {
        if (msg.type === 'fallback-choice') {
          resolve(msg.download);
        }
      };
    });
  }

  /**
   * Run GitHub setup wizard for dynamic configuration
   * @deprecated - This method is no longer used but kept for reference
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async runGitHubSetup(): Promise<void> {
    try {
      console.log('🔧 Starting GitHub setup wizard...');
      figma.notify('Setting up GitHub integration...', { timeout: 3000 });

      const setupUI = new GitHubSetupUI();
      const setupResult = await setupUI.runSetup();

      if (setupResult.success && setupResult.config) {
        console.log('✅ GitHub setup completed successfully');

        // Configure GitHubAuth with the new configuration
        const configResult = await this.githubAuth.configure(setupResult.config);

        if (!configResult.success) {
          throw new Error(configResult.error || 'Failed to apply GitHub configuration');
        }

        console.log('✅ GitHub configuration applied and stored');
        figma.notify('GitHub integration configured successfully!', { timeout: 2000 });
      } else {
        throw new Error(setupResult.error || 'GitHub setup was cancelled or failed');
      }
    } catch (error) {
      console.error('❌ GitHub setup failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Setup failed';
      figma.notify(`GitHub setup failed: ${errorMessage}`, { error: true, timeout: 5000 });
      throw error;
    }
  }

  /**
   * Get repository string for display
   * @deprecated - This method is no longer used but kept for reference
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private getRepositoryString(): string | undefined {
    const config = this.githubAuth.getPublicConfig();
    return config?.repository
      ? `${config.repository.owner}/${config.repository.name}`
      : undefined;
  }
}