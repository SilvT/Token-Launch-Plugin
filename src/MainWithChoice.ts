/**
 * Enhanced Main Function with Export Choice
 *
 * Integrates the export choice workflow into the existing main function,
 * allowing users to choose between Git push and local download.
 */

import { TokenExtractor, ExtractionConfig } from './TokenExtractor';
import { ExportWorkflow } from './workflow/ExportWorkflow';
import { DocumentInfo, BasicTokenCount } from './types/CommonTypes';

// =============================================================================
// ENHANCED MAIN FUNCTION
// =============================================================================

/**
 * Enhanced main function with export choice workflow
 */
export async function mainWithExportChoice(): Promise<void> {
  console.log('FIGMA DESIGN SYSTEM DISTRIBUTOR - WITH EXPORT CHOICE');
  console.log('='.repeat(80));
  console.log('Plugin loading...');

  try {
    // Step 1: Validate Figma environment
    console.log('Step 1: Validating Figma environment...');
    if (!validateFigmaEnvironment()) {
      throw new Error('Invalid Figma environment. Please open a Figma document and try again.');
    }
    console.log('✓ Figma environment validation passed');
    figma.notify('✓ Environment validated', { timeout: 1500 });

    // Step 2: Test API access
    console.log('Step 2: Testing Figma API access...');
    if (!testFigmaAPIAccess()) {
      throw new Error('Figma API access test failed');
    }
    console.log('✓ Figma API access test passed');

    // Step 3: Get document information
    console.log('Step 3: Gathering document information...');
    const documentInfo = getDocumentInfo();
    displayDocumentInfo(documentInfo);
    console.log('✓ Document information gathered');

    // Step 4: Count basic tokens
    console.log('Step 4: Counting available tokens...');
    const tokenCount = countBasicTokens();
    displayTokenSummary(tokenCount);
    console.log('✓ Token counting completed');

    // Step 5: Initialize token extractor
    console.log('Step 5: Initializing token extraction...');
    const tokenExtractor = createTokenExtractor();
    console.log('✓ Token extractor initialized');

    // Step 6: Run export workflow (extraction + choice + action)
    console.log('Step 6: Starting export workflow...');
    const workflow = new ExportWorkflow({
      tokenExtractor,
      documentInfo
    });

    const workflowResult = await workflow.runWorkflow();

    if (workflowResult.success) {
      console.log(`✅ Export workflow completed successfully!`);
      console.log(`📊 Choice: ${workflowResult.choice}`);
      console.log(`⏱️  Duration: ${workflowResult.duration}ms`);

      if (workflowResult.extractionResult) {
        const totalTokens = workflowResult.extractionResult.tokens.length +
                           workflowResult.extractionResult.variables.length;
        console.log(`🎯 Total tokens processed: ${totalTokens}`);
      }

    } else {
      console.error(`❌ Export workflow failed: ${workflowResult.error}`);
      figma.notify(`Workflow failed: ${workflowResult.error}`, { error: true });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Main workflow failed:', errorMessage);
    figma.notify(`Plugin failed: ${errorMessage}`, { error: true, timeout: 5000 });
    figma.closePlugin('Plugin execution failed');
  }
}

// =============================================================================
// UTILITY FUNCTIONS (from main.ts)
// =============================================================================

/**
 * Validate Figma environment
 */
function validateFigmaEnvironment(): boolean {
  try {
    if (typeof figma === 'undefined') {
      console.error('✗ Figma API not available');
      return false;
    }

    if (!figma.root) {
      console.error('✗ No Figma document root available');
      return false;
    }

    console.log('✓ Figma API and document root available');
    return true;
  } catch (error) {
    console.error('✗ Figma environment validation failed:', error);
    return false;
  }
}

/**
 * Test Figma API access
 */
function testFigmaAPIAccess(): boolean {
  try {
    const collections = figma.variables.getLocalVariableCollections();
    console.log(`✓ Variables access: ${collections.length} collections`);

    console.log(`✓ Document access: ${figma.root.name}`);
    console.log(`✓ File key access: ${figma.fileKey || 'N/A'}`);

    figma.notify('✓ API access confirmed', { timeout: 1000 });
    return true;

  } catch (error) {
    console.error('✗ API access test failed:', error);
    return false;
  }
}

/**
 * Get document information
 */
function getDocumentInfo(): DocumentInfo {
  const root = figma.root;
  const pages = root.children as PageNode[];

  let totalNodes = 0;
  pages.forEach(page => {
    totalNodes += countNodes(page);
  });

  const variableCollections = figma.variables.getLocalVariableCollections();
  let totalVariables = 0;
  try {
    variableCollections.forEach(collection => {
      totalVariables += collection.variableIds.length;
    });
  } catch (error) {
    console.warn('Error counting variables:', error);
  }

  return {
    name: root.name,
    id: figma.fileKey || '',
    pageCount: pages.length,
    totalNodes,
    paintStyles: figma.getLocalPaintStyles().length,
    textStyles: figma.getLocalTextStyles().length,
    effectStyles: figma.getLocalEffectStyles().length,
    variableCollections: variableCollections.length,
    localVariables: totalVariables
  };
}

/**
 * Count nodes recursively
 */
function countNodes(node: BaseNode): number {
  let count = 1;

  if ('children' in node) {
    node.children.forEach(child => {
      count += countNodes(child);
    });
  }

  return count;
}

/**
 * Display document information
 */
function displayDocumentInfo(info: DocumentInfo): void {
  console.log('='.repeat(60));
  console.log('DOCUMENT INFORMATION');
  console.log('='.repeat(60));
  console.log(`Document: ${info.name}`);
  console.log(`File ID: ${info.id}`);
  console.log(`Pages: ${info.pageCount}`);
  console.log(`Total Nodes: ${info.totalNodes}`);
  console.log('='.repeat(60));
}

/**
 * Count basic tokens
 */
function countBasicTokens(): BasicTokenCount {
  const paintStyles = figma.getLocalPaintStyles().length;
  const textStyles = figma.getLocalTextStyles().length;
  const effectStyles = figma.getLocalEffectStyles().length;

  const collections = figma.variables.getLocalVariableCollections();
  let totalVariables = 0;
  try {
    collections.forEach(collection => {
      totalVariables += collection.variableIds.length;
    });
  } catch (error) {
    console.warn('Error counting variables:', error);
  }

  return {
    paintStyles,
    textStyles,
    effectStyles,
    variables: totalVariables,
    collections: collections.length
  };
}

/**
 * Display token summary
 */
function displayTokenSummary(tokens: BasicTokenCount): void {
  const totalTokens = tokens.paintStyles + tokens.textStyles + tokens.effectStyles + tokens.variables;

  console.log('='.repeat(60));
  console.log('TOKEN SUMMARY');
  console.log('='.repeat(60));
  console.log(`Paint Styles: ${tokens.paintStyles}`);
  console.log(`Text Styles: ${tokens.textStyles}`);
  console.log(`Effect Styles: ${tokens.effectStyles}`);
  console.log(`Variables: ${tokens.variables}`);
  console.log(`Collections: ${tokens.collections}`);
  console.log(`Total Tokens: ${totalTokens}`);
  console.log('='.repeat(60));

  figma.notify(`Found ${totalTokens} total tokens (${tokens.paintStyles} colors, ${tokens.textStyles} text, ${tokens.effectStyles} effects, ${tokens.variables} variables)`, { timeout: 4000 });
}

/**
 * Create token extractor with configuration
 */
function createTokenExtractor(): TokenExtractor {
  const config: ExtractionConfig = {
    includeLocalStyles: true,
    includeComponentTokens: true,
    includeVariables: true,
    traverseInstances: true,
    maxDepth: 10,
    includeHiddenLayers: false,
    includeMetadata: true
  };

  return new TokenExtractor(config);
}

// =============================================================================
// EXPORT FOR MAIN.TS INTEGRATION
// =============================================================================

/**
 * Drop-in replacement for the original main function
 */
export async function enhancedMain(): Promise<void> {
  await mainWithExportChoice();
}

/**
 * For gradual migration - run alongside existing main
 */
export async function runWithChoice(): Promise<void> {
  try {
    console.log('🚀 Running enhanced workflow with export choice...');
    await mainWithExportChoice();
  } catch (error) {
    console.error('❌ Enhanced workflow failed, falling back to original:', error);
    // Could call original main() here as fallback
    throw error;
  }
}