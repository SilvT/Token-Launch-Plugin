/**
 * Figma Design System Distributor - Token Extraction with JSON Output
 *
 * Enhanced implementation that performs real token extraction using TokenExtractor
 * and outputs complete design token datasets as structured JSON to the console.
 *
 * @version 1.0.0 (Token Extraction)
 */

import { TokenExtractor, ExtractionConfig, ExtractionResult } from './TokenExtractor';
import { DocumentInfo, BasicTokenCount } from './types/CommonTypes';
import { ExportWorkflow } from './workflow/ExportWorkflow';

// =============================================================================
// BASIC INTERFACES
// =============================================================================

interface ExtractedTokenDataset {
  metadata: {
    exportTimestamp: string;
    extractionDuration: number;
    sourceDocument: {
      name: string;
      id: string;
      totalNodes: number;
      pageCount: number;
    };
    tokenCounts: {
      totalTokens: number;
      totalVariables: number;
      totalCollections: number;
      errors: number;
      warnings: number;
    };
  };
  variables: any[];
  collections: any[];
  designTokens: any[];
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Safely check if Figma environment is available
 */
function validateFigmaEnvironment(): boolean {
  try {
    return !!(figma && figma.root && figma.root.type === 'DOCUMENT');
  } catch (error) {
    console.error('Figma environment validation failed:', error);
    return false;
  }
}

/**
 * Count total nodes in the document recursively
 */
function countTotalNodes(node: BaseNode): number {
  let count = 1;
  if ('children' in node) {
    for (const child of node.children) {
      count += countTotalNodes(child);
    }
  }
  return count;
}

/**
 * Get basic document information
 */
function getDocumentInfo(): DocumentInfo {
  const paintStyles = figma.getLocalPaintStyles();
  const textStyles = figma.getLocalTextStyles();
  const effectStyles = figma.getLocalEffectStyles();
  const variableCollections = figma.variables.getLocalVariableCollections();

  // Count all local variables across collections
  let totalVariables = 0;
  try {
    variableCollections.forEach(collection => {
      totalVariables += collection.variableIds.length;
    });
  } catch (error) {
    console.warn('Error counting variables:', error);
  }

  return {
    name: figma.root.name,
    id: figma.fileKey || 'unknown',
    pageCount: figma.root.children.length,
    totalNodes: countTotalNodes(figma.root),
    paintStyles: paintStyles.length,
    textStyles: textStyles.length,
    effectStyles: effectStyles.length,
    variableCollections: variableCollections.length,
    localVariables: totalVariables
  };
}

/**
 * Count basic tokens available in the document
 */
function countBasicTokens(): BasicTokenCount {
  const paintStyles = figma.getLocalPaintStyles();
  const textStyles = figma.getLocalTextStyles();
  const effectStyles = figma.getLocalEffectStyles();
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
    paintStyles: paintStyles.length,
    textStyles: textStyles.length,
    effectStyles: effectStyles.length,
    variables: totalVariables,
    collections: collections.length
  };
}

/**
 * Display document information via console and figma.notify
 */
function displayDocumentInfo(info: DocumentInfo): void {
  console.log('='.repeat(60));
  console.log('DOCUMENT INFORMATION');
  console.log('='.repeat(60));
  console.log(`Name: ${info.name}`);
  console.log(`ID: ${info.id}`);
  console.log(`Pages: ${info.pageCount}`);
  console.log(`Total Nodes: ${info.totalNodes}`);
  console.log(`Paint Styles: ${info.paintStyles}`);
  console.log(`Text Styles: ${info.textStyles}`);
  console.log(`Effect Styles: ${info.effectStyles}`);
  console.log(`Variable Collections: ${info.variableCollections}`);
  console.log(`Local Variables: ${info.localVariables}`);
  console.log('='.repeat(60));

  figma.notify(`Document: ${info.name} | Nodes: ${info.totalNodes} | Styles: ${info.paintStyles + info.textStyles + info.effectStyles}`, { timeout: 3000 });
}

/**
 * Display token count summary
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
 * Test basic Figma API access
 */
function testFigmaAPIAccess(): boolean {
  console.log('Testing Figma API access...');

  try {
    // Test document access
    const documentName = figma.root.name;
    console.log(`✓ Document access: ${documentName}`);

    // Test styles access
    const paintStyles = figma.getLocalPaintStyles();
    console.log(`✓ Paint styles access: ${paintStyles.length} styles`);

    // Test variables access
    const collections = figma.variables.getLocalVariableCollections();
    console.log(`✓ Variables access: ${collections.length} collections`);

    // Test notification system
    console.log('✓ Notification system test');

    figma.notify('✓ All Figma API tests passed!', { timeout: 2000 });
    return true;

  } catch (error) {
    console.error('✗ Figma API test failed:', error);
    figma.notify('✗ Figma API test failed', { error: true });
    return false;
  }
}

/**
 * Run diagnostic tests for GitHub integration
 */
async function runGitHubDiagnostics(): Promise<void> {
  console.log('🔬 === STARTING GITHUB DIAGNOSTICS ===');

  try {
    // Import diagnostic modules dynamically to avoid issues if they fail
    const { DiagnosticTester } = await import('./github/DiagnosticTester');
    const { BuildEnvironmentDetector } = await import('./github/BuildEnvironmentDetector');

    // Quick environment check first
    console.log('⚡ Running quick environment diagnostic...');
    BuildEnvironmentDetector.quickDiagnostic();

    // Quick test of essential functionality
    console.log('⚡ Running quick integration test...');
    const quickTestPassed = await DiagnosticTester.quickTest();

    if (quickTestPassed) {
      console.log('✅ Quick diagnostic PASSED - GitHub integration should work');
      figma.notify('✅ GitHub diagnostic: PASSED', { timeout: 3000 });
    } else {
      console.log('❌ Quick diagnostic FAILED - GitHub integration may have issues');
      figma.notify('⚠️ GitHub diagnostic: ISSUES DETECTED', { error: true, timeout: 5000 });

      // Run full diagnostic for detailed analysis
      console.log('🔬 Running full diagnostic for detailed analysis...');
      const fullResult = await DiagnosticTester.runFullDiagnostic();

      if (fullResult.summary.riskLevel === 'HIGH') {
        console.log('🚨 HIGH RISK detected - consider alternative build configuration');
        figma.notify('🚨 HIGH RISK: Use npm run build:dev', { error: true, timeout: 5000 });
      }
    }

  } catch (error) {
    console.error('❌ Diagnostic test failed:', error);
    figma.notify('❌ Diagnostic test failed', { error: true, timeout: 3000 });
  }

  console.log('🔬 === GITHUB DIAGNOSTICS COMPLETE ===');
}

/**
 * Perform real token extraction using TokenExtractor
 */
async function performRealExtraction(): Promise<ExtractionResult> {
  console.log('Starting real token extraction...');

  try {
    // Configure extraction
    const config: ExtractionConfig = {
      includeLocalStyles: true,
      includeComponentTokens: true,
      includeVariables: true,
      traverseInstances: false,
      maxDepth: 10,
      includeHiddenLayers: false,
      includeMetadata: true
    };

    // Real progress notifications
    figma.notify('Initializing TokenExtractor...', { timeout: 1000 });
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create extractor
    const extractor = new TokenExtractor(config);

    figma.notify('Analyzing document structure...', { timeout: 1000 });
    await new Promise(resolve => setTimeout(resolve, 800));

    figma.notify('Extracting design tokens...', { timeout: 1500 });
    await new Promise(resolve => setTimeout(resolve, 700));

    // Perform actual extraction
    const startTime = Date.now();
    const result = await extractor.extractAllTokens();
    const extractionTime = Date.now() - startTime;

    figma.notify('Processing extraction results...', { timeout: 1000 });
    await new Promise(resolve => setTimeout(resolve, 600));

    console.log(`✓ Real extraction completed in ${extractionTime}ms`);
    console.log(`✓ Found ${result.tokens.length} tokens, ${result.variables.length} variables, ${result.collections.length} collections`);

    return result;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('✗ Token extraction failed:', errorMessage);
    figma.notify('✗ Token extraction failed', { error: true });
    throw error;
  }
}

/**
 * Create structured JSON dataset from extraction results
 */
function createJSONDataset(result: ExtractionResult, documentInfo: DocumentInfo, extractionDuration: number): ExtractedTokenDataset {
  return {
    metadata: {
      exportTimestamp: new Date().toISOString(),
      extractionDuration,
      sourceDocument: {
        name: documentInfo.name,
        id: documentInfo.id,
        totalNodes: documentInfo.totalNodes,
        pageCount: documentInfo.pageCount
      },
      tokenCounts: {
        totalTokens: result.tokens.length,
        totalVariables: result.variables.length,
        totalCollections: result.collections.length,
        errors: result.metadata.errors.length,
        warnings: result.metadata.warnings.length
      }
    },
    variables: result.variables,
    collections: result.collections,
    designTokens: result.tokens
  };
}

/**
 * Format extraction result as JSON and output to console
 */
function outputJSONToConsole(result: ExtractionResult, documentInfo: DocumentInfo, extractionDuration: number): void {
  const dataset = createJSONDataset(result, documentInfo, extractionDuration);

  // Output with professional formatting
  console.log('\n' + '='.repeat(80));
  console.log('📊 EXTRACTED DESIGN TOKENS (JSON DATASET)');
  console.log('='.repeat(80));

  // Output the complete JSON
  console.log(JSON.stringify(dataset, null, 2));

  console.log('\n' + '='.repeat(80));
  console.log('✅ JSON EXPORT SUMMARY');
  console.log('='.repeat(80));
  console.log(`📅 Export Time: ${dataset.metadata.exportTimestamp}`);
  console.log(`🎯 Total Tokens: ${dataset.metadata.tokenCounts.totalTokens}`);
  console.log(`🔧 Variables: ${dataset.metadata.tokenCounts.totalVariables}`);
  console.log(`📚 Collections: ${dataset.metadata.tokenCounts.totalCollections}`);
  console.log(`⏱️  Extraction Duration: ${extractionDuration}ms`);
  console.log(`📏 JSON Size: ${JSON.stringify(dataset).length.toLocaleString()} characters`);
  console.log('='.repeat(80));
}

/**
 * Generate filename for JSON export based on document info
 */
function generateJSONFilename(documentInfo: DocumentInfo): string {
  // Clean document name for use in filename
  const cleanName = documentInfo.name
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  return `${cleanName}-design-tokens-${timestamp}.json`;
}

/**
 * Download JSON dataset as file using Figma's showUI and postMessage API
 * @deprecated - This function is no longer used but kept for reference
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function downloadJSONFile(result: ExtractionResult, documentInfo: DocumentInfo, extractionDuration: number): Promise<void> {
  try {
    console.log('Preparing JSON file for download...');

    const dataset = createJSONDataset(result, documentInfo, extractionDuration);
    const jsonString = JSON.stringify(dataset, null, 2);
    const filename = generateJSONFilename(documentInfo);

    // Create a simple HTML page for file download
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Download JSON</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            padding: 20px;
            background: #f5f5f5;
            margin: 0;
          }
          .container {
            max-width: 400px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            text-align: center;
          }
          .download-btn {
            background: #18a0fb;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            margin: 10px 0;
            display: inline-block;
            text-decoration: none;
          }
          .download-btn:hover {
            background: #0d8ce8;
          }
          .file-info {
            color: #666;
            font-size: 12px;
            margin: 10px 0;
          }
          .success {
            color: #0d8a00;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>🎉 Tokens Extracted Successfully!</h2>
          <div class="file-info">
            <strong>File:</strong> ${filename}<br>
            <strong>Size:</strong> ${(jsonString.length / 1024).toFixed(1)} KB<br>
            <strong>Tokens:</strong> ${dataset.metadata.tokenCounts.totalTokens}<br>
            <strong>Variables:</strong> ${dataset.metadata.tokenCounts.totalVariables}
          </div>
          <button id="downloadBtn" class="download-btn">
            📥 Download JSON File
          </button>
          <div id="downloadStatus"></div>
          <div class="file-info">
            Click the button above to download your design tokens as a JSON file.
          </div>
        </div>

        <script>
          const jsonData = ${JSON.stringify(jsonString)};
          const filename = ${JSON.stringify(filename)};

          document.getElementById('downloadBtn').addEventListener('click', function() {
            try {
              // Create blob and download link
              const blob = new Blob([jsonData], { type: 'application/json' });
              const url = URL.createObjectURL(blob);

              // Create temporary link element
              const link = document.createElement('a');
              link.href = url;
              link.download = filename;
              link.style.display = 'none';

              // Trigger download
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              // Clean up object URL
              URL.revokeObjectURL(url);

              // Show success message
              const statusElement = document.getElementById('downloadStatus');
              if (statusElement) {
                statusElement.textContent = '✅ Download started! Check your Downloads folder.';
                statusElement.className = 'success';
              }

              // Auto-close after successful download
              setTimeout(function() {
                parent.postMessage({ pluginMessage: { type: 'close-plugin' } }, '*');
              }, 2000);

            } catch (error) {
              const statusElement = document.getElementById('downloadStatus');
              if (statusElement) {
                statusElement.textContent = '❌ Download failed: ' + error.message;
                statusElement.style.color = 'red';
              }
            }
          });

          // Handle auto-download on load (optional)
          // Uncomment the next line if you want automatic download
          // document.getElementById('downloadBtn').click();
        </script>
      </body>
      </html>
    `;

    // Show UI for file download
    figma.showUI(htmlContent, {
      width: 450,
      height: 300,
      title: 'Download Design Tokens'
    });

    // Handle messages from UI
    figma.ui.onmessage = (msg) => {
      if (msg.type === 'close-plugin') {
        figma.closePlugin('JSON file download completed!');
      }
    };

    console.log(`✓ JSON download UI opened - file: ${filename}`);
    console.log(`✓ File size: ${(jsonString.length / 1024).toFixed(1)} KB`);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('✗ Failed to setup JSON download:', errorMessage);
    figma.notify('Failed to setup JSON download', { error: true });
    throw error;
  }
}

// =============================================================================
// MAIN PLUGIN FUNCTION
// =============================================================================

/**
 * Main plugin entry point - Simplified for testing
 */
async function main(): Promise<void> {
  console.log('='.repeat(80));
  console.log('FIGMA DESIGN SYSTEM DISTRIBUTOR - BASIC TEST MODE');
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

    // Step 3.5: Run GitHub diagnostics
    console.log('Step 3.5: Running GitHub integration diagnostics...');
    await runGitHubDiagnostics();
    console.log('✓ Document information gathered');

    // Step 4: Count basic tokens
    console.log('Step 4: Counting available tokens...');
    const tokenCount = countBasicTokens();
    displayTokenSummary(tokenCount);
    console.log('✓ Token counting completed');

    // Step 5: Extract design tokens
    console.log('Step 5: Extracting design tokens...');
    const extractionStartTime = Date.now();
    const extractionResult = await performRealExtraction();
    const extractionDuration = Date.now() - extractionStartTime;
    console.log('✓ Token extraction completed');

    // Step 6: Format and output JSON
    console.log('Step 6: Formatting tokens as JSON...');
    outputJSONToConsole(extractionResult, documentInfo, extractionDuration);
    console.log('✓ JSON output completed');

    // Step 7: Show export choice and handle user selection
    console.log('Step 7: Starting export choice workflow...');

    // Create TokenExtractor with the same config used for extraction
    const config: ExtractionConfig = {
      includeLocalStyles: true,
      includeComponentTokens: true,
      includeVariables: true,
      traverseInstances: false,
      maxDepth: 10,
      includeHiddenLayers: false,
      includeMetadata: true
    };
    const tokenExtractor = new TokenExtractor(config);

    const workflow = new ExportWorkflow({
      tokenExtractor,
      documentInfo
    });

    const workflowResult = await workflow.runWorkflow();

    if (workflowResult.success) {
      console.log(`✅ Export completed via ${workflowResult.choice}`);
    } else {
      console.error(`❌ Export failed: ${workflowResult.error}`);
      figma.notify(`Export failed: ${workflowResult.error}`, { error: true });
    }
    console.log('✓ Export workflow completed');

    // Step 8: Final summary (only if workflow didn't handle closing)
    if (workflowResult.choice !== 'cancel') {
      console.log('Step 8: Generating final summary...');
      const totalTokens = extractionResult.tokens.length;

      console.log('\n' + '='.repeat(80));
      console.log('🎉 TOKEN EXTRACTION AND EXPORT COMPLETED');
      console.log('='.repeat(80));
      console.log(`📄 Document: ${documentInfo.name}`);
      console.log(`🌐 Total Nodes: ${documentInfo.totalNodes}`);
      console.log(`🎯 Extracted Tokens: ${totalTokens}`);
      console.log(`🔧 Variables: ${extractionResult.variables.length}`);
      console.log(`📚 Collections: ${extractionResult.collections.length}`);
      console.log(`⏱️  Total Time: ${extractionDuration}ms`);
      console.log(`✅ Export Method: ${workflowResult.choice.toUpperCase()}`);
      console.log('='.repeat(80));
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.error('\n' + '='.repeat(80));
    console.error('PLUGIN TEST FAILED');
    console.error('='.repeat(80));
    console.error(`Error: ${errorMessage}`);
    console.error('='.repeat(80));

    figma.notify(`✗ Plugin test failed: ${errorMessage}`, { error: true, timeout: 5000 });

    // Close plugin with error message
    setTimeout(() => {
      figma.closePlugin(`Plugin test failed: ${errorMessage}`);
    }, 1000);
  }
}

// =============================================================================
// EXPORT
// =============================================================================

export default main;