/**
 * Main Integration Example
 *
 * Shows how to integrate Git operations with your existing main.ts workflow.
 * Demonstrates the complete flow from token extraction to GitHub push.
 */

import { TokenExtractor, ExtractionConfig } from '../TokenExtractor';
import { TokenPushService, PushConfiguration } from './TokenPushService';
import { GitHubAuth } from './GitHubAuth';

// =============================================================================
// MAIN WORKFLOW WITH GIT INTEGRATION
// =============================================================================

/**
 * Enhanced main workflow with GitHub push capability
 */
export async function mainWithGitPush(): Promise<void> {
  try {
    console.log('🚀 Starting Design System Distributor with Git Push...');

    // Step 1: Initialize services
    const { tokenExtractor, pushService, feedback } = await initializeServices();

    // Step 2: Check GitHub connection
    const connectionStatus = await pushService.testConnection();
    if (!connectionStatus.success) {
      console.warn('⚠️ GitHub not connected:', connectionStatus.message);
      feedback.showNotification('GitHub not connected - proceeding with local extraction only');

      // Fallback to local extraction
      await runLocalExtractionOnly(tokenExtractor);
      return;
    }

    console.log('✅ GitHub connected:', connectionStatus.message);

    // Step 3: Extract tokens
    feedback.showProgress('extract', 'Extracting design tokens from Figma...', 0);
    const extractionResult = await tokenExtractor.extractAllTokens();

    if (extractionResult.metadata.errors.length > 0) {
      console.warn(`⚠️ Extraction completed with ${extractionResult.metadata.errors.length} errors`);
    }

    // const totalTokens = extractionResult.tokens.length + extractionResult.variables.length;
    console.log(`📊 Extracted: ${extractionResult.tokens.length} tokens, ${extractionResult.variables.length} variables`);

    // Step 4: Push to GitHub
    feedback.showProgress('git', 'Preparing to push to GitHub...', 25);

    const pushResult = await pushService.quickPush(extractionResult, feedback);

    if (pushResult.success) {
      console.log('🎉 Complete workflow successful!');
      showSuccessDetails(extractionResult, pushResult);
    } else {
      console.error('❌ Push failed, but tokens were extracted');
      feedback.showError('Push to GitHub failed', pushResult.error);

      // Fallback: offer local download
      feedback.showNotification('Tokens extracted successfully - use download for local file');
    }

  } catch (error) {
    console.error('❌ Main workflow failed:', error);
    figma.notify(
      `Workflow failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { error: true, timeout: 5000 }
    );
  }
}

/**
 * Initialize all required services
 */
async function initializeServices() {
  // Token extraction configuration
  const extractionConfig: ExtractionConfig = {
    includeLocalStyles: true,
    includeVariables: true,
    includeComponentTokens: true,
    traverseInstances: true,
    maxDepth: 10,
    includeHiddenLayers: false,
    includeMetadata: true
  };

  const tokenExtractor = new TokenExtractor(extractionConfig);

  // Git push service
  const pushService = new TokenPushService();
  await pushService.initialize();

  // Figma-compatible feedback interface
  const feedback = TokenPushService.createFigmaFeedback();

  return { tokenExtractor, pushService, feedback };
}

/**
 * Fallback to local extraction when GitHub is not available
 */
async function runLocalExtractionOnly(tokenExtractor: TokenExtractor): Promise<void> {
  try {
    console.log('📁 Running local token extraction...');

    figma.notify('Extracting tokens locally...', { timeout: 2000 });

    const extractionResult = await tokenExtractor.extractAllTokens();
    const totalTokens = extractionResult.tokens.length + extractionResult.variables.length;

    console.log(`✅ Local extraction completed: ${totalTokens} total tokens`);
    figma.notify(
      `Extracted ${totalTokens} tokens! Use download to save JSON file.`,
      { timeout: 4000 }
    );

    // Here you would trigger your existing download workflow
    // For example: triggerJSONDownload(extractionResult);

  } catch (error) {
    console.error('❌ Local extraction failed:', error);
    figma.notify('Token extraction failed', { error: true });
  }
}

/**
 * Show detailed success information
 */
function showSuccessDetails(extractionResult: any, pushResult: any): void {
  const details = {
    tokens: extractionResult.tokens.length,
    variables: extractionResult.variables.length,
    file: pushResult.fileInfo?.path,
    size: pushResult.fileInfo?.size,
    duration: pushResult.duration,
    operation: pushResult.pushResult?.operation
  };

  console.log('📈 Success Details:', details);

  // You could show a custom UI here with detailed results
  // showSuccessUI(details);
}

// =============================================================================
// GITHUB SETUP HELPERS
// =============================================================================

/**
 * Setup GitHub integration (call this from UI)
 */
export async function setupGitHubIntegration(config: {
  token: string;
  repository: string;  // e.g., "SilvT/ds-distributor"
}): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = GitHubAuth.getInstance();
    await auth.initialize();

    // Parse repository
    const [owner, name] = config.repository.split('/');
    if (!owner || !name) {
      throw new Error('Invalid repository format. Use: owner/repository');
    }

    // Configure GitHub
    const result = await auth.configure({
      credentials: { token: config.token },
      repository: { owner, name, branch: 'main' },
      paths: {
        rawTokens: 'tokens/raw/figma-tokens.json',
        processedTokens: 'tokens/processed/'
      }
    });

    if (result.success) {
      // Test connection
      const pushService = new TokenPushService();
      await pushService.initialize();

      const testResult = await pushService.testConnection();
      if (!testResult.success) {
        throw new Error(testResult.error || 'Connection test failed');
      }

      console.log('✅ GitHub integration setup successful');
      figma.notify('GitHub integration configured successfully!');
    }

    return result;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Setup failed';
    console.error('❌ GitHub setup failed:', errorMessage);
    figma.notify(`GitHub setup failed: ${errorMessage}`, { error: true });

    return { success: false, error: errorMessage };
  }
}

/**
 * Test current GitHub connection
 */
export async function testGitHubConnection(): Promise<{
  success: boolean;
  message: string;
  repository?: string;
}> {
  try {
    const pushService = new TokenPushService();
    await pushService.initialize();

    const status = pushService.getStatus();
    if (!status.isReady || !status.hasRepository) {
      return {
        success: false,
        message: 'GitHub not configured. Please setup GitHub integration first.'
      };
    }

    const testResult = await pushService.testConnection();

    return {
      success: testResult.success,
      message: testResult.message,
      repository: status.repositoryInfo
    };

  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Connection test failed'
    };
  }
}

// =============================================================================
// USAGE EXAMPLES
// =============================================================================

/**
 * Example: Push with custom configuration
 */
export async function pushWithCustomConfig(tokenData: any): Promise<void> {
  const pushService = new TokenPushService();
  await pushService.initialize();

  const customConfig: PushConfiguration = {
    repository: {
      owner: 'SilvT',
      name: 'ds-distributor',
      branch: 'main'
    },
    targetPath: 'tokens/raw/',
    filename: `figma-tokens-${new Date().toISOString().split('T')[0]}.json`,
    commitMessage: `feat: update design tokens from ${figma.root.name}\n\nExtracted from Figma with Design System Distributor`
  };

  const feedback = TokenPushService.createFigmaFeedback();
  const result = await pushService.pushTokensToGitHub(tokenData, customConfig, feedback);

  if (result.success) {
    console.log('✅ Custom push successful:', result.fileInfo);
  } else {
    console.error('❌ Custom push failed:', result.error);
  }
}

/**
 * Example: Quick status check
 */
export async function checkGitStatus(): Promise<void> {
  const pushService = new TokenPushService();
  await pushService.initialize();

  const status = pushService.getStatus();
  console.log('Git Status:', {
    ready: status.isReady,
    hasRepo: status.hasRepository,
    repo: status.repositoryInfo
  });

  if (status.isReady && status.hasRepository) {
    const connectionTest = await pushService.testConnection();
    console.log('Connection Test:', connectionTest);
  }
}