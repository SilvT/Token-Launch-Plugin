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
// Lazy load heavy modules to improve startup time
// import { ExportWorkflow } from './workflow/ExportWorkflow';
import { TokenTransformer, CleanTokenOutput } from './TokenTransformer';
import { LogLevel, log } from './config/logging';
import { PLUGIN_DIMENSIONS } from './design-system/tokens';

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
 * Cached style and collection data to avoid redundant API calls
 */
interface CachedDocumentData {
  paintStyles: PaintStyle[];
  textStyles: TextStyle[];
  effectStyles: EffectStyle[];
  variableCollections: VariableCollection[];
  totalVariables: number;
  totalNodes: number;
}

let cachedDocData: CachedDocumentData | null = null;

/**
 * Get or compute cached document data (only fetch once)
 * Uses async API methods required for documentAccess: dynamic-page
 */
async function getCachedDocumentData(): Promise<CachedDocumentData> {
  if (cachedDocData) {
    return cachedDocData;
  }

  // Use async versions of API methods for dynamic-page mode
  const paintStyles = await figma.getLocalPaintStylesAsync();
  const textStyles = await figma.getLocalTextStylesAsync();
  const effectStyles = await figma.getLocalEffectStylesAsync();
  const variableCollections = await figma.variables.getLocalVariableCollectionsAsync();

  let totalVariables = 0;
  try {
    variableCollections.forEach(collection => {
      totalVariables += collection.variableIds.length;
    });
  } catch (error) {
    console.warn('Error counting variables:', error);
  }

  cachedDocData = {
    paintStyles,
    textStyles,
    effectStyles,
    variableCollections,
    totalVariables,
    totalNodes: 0  // Cannot count nodes in dynamic-page mode without loading pages
  };

  return cachedDocData;
}

/**
 * Get basic document information
 */
async function getDocumentInfo(): Promise<DocumentInfo> {
  const data = await getCachedDocumentData();

  // In dynamic-page mode, we cannot access page count without loading pages
  // This would defeat the purpose of dynamic loading, so we omit it
  return {
    name: figma.root.name,
    id: figma.fileKey || 'unknown',
    pageCount: 0, // Not available in dynamic-page mode
    totalNodes: data.totalNodes,
    paintStyles: data.paintStyles.length,
    textStyles: data.textStyles.length,
    effectStyles: data.effectStyles.length,
    variableCollections: data.variableCollections.length,
    localVariables: data.totalVariables
  };
}

/**
 * Count basic tokens available in the document
 */
async function countBasicTokens(): Promise<BasicTokenCount> {
  const data = await getCachedDocumentData();

  return {
    paintStyles: data.paintStyles.length,
    textStyles: data.textStyles.length,
    effectStyles: data.effectStyles.length,
    variables: data.totalVariables,
    collections: data.variableCollections.length
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

    // Create extractor and perform extraction without artificial delays
    figma.notify('Extracting design tokens...', { timeout: 2000 });
    const extractor = new TokenExtractor(config);

    const startTime = Date.now();
    const result = await extractor.extractAllTokens();
    const extractionTime = Date.now() - startTime;

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
function createJSONDataset(result: ExtractionResult, documentInfo: DocumentInfo, extractionDuration: number): CleanTokenOutput {
  // Transform to clean format
  const transformer = new TokenTransformer();

  const rawData = {
    metadata: {
      sourceDocument: {
        name: documentInfo.name
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
 * Format extraction result as JSON and output to console
 */
function outputJSONToConsole(result: ExtractionResult, documentInfo: DocumentInfo, extractionDuration: number): void {
  const dataset = createJSONDataset(result, documentInfo, extractionDuration);

  // Output with professional formatting
  console.log('\n' + '='.repeat(80));
  console.log('📊 EXTRACTED DESIGN TOKENS (CLEAN JSON FORMAT)');
  console.log('='.repeat(80));

  // Output the complete JSON
  // Note: Commented out to avoid console clutter - full JSON is exported to file
  // console.log(JSON.stringify(dataset, null, 2));

  console.log('\n' + '='.repeat(80));
  console.log('✅ JSON EXPORT SUMMARY');
  console.log('='.repeat(80));
  console.log(`📅 Export Time: ${dataset.generatedAt}`);
  console.log(`🎯 Total Collections: ${Object.keys(dataset.collections).length}`);
  console.log(`🔧 Source Variables: ${dataset.source.originalVariableCount}`);
  console.log(`📚 Source Tokens: ${dataset.source.originalTokenCount}`);
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
        <link href="https://unpkg.com/phosphor-icons@1.4.2/src/css/icons.css" rel="stylesheet">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "Roboto", "Helvetica Neue", Arial, sans-serif;
            padding: 24px;
            background: linear-gradient(135deg, #DEE3FC 0%, #FFFFFF 100%);
            margin: 0;
            min-height: 100vh;
          }
          .container {
            max-width: 400px;
            margin: 0 auto;
            background: white;
            padding: 32px;
            border-radius: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            text-align: center;
          }
          .download-btn {
            background: #000000;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            margin: 16px 0;
            display: inline-block;
            text-decoration: none;
            transition: all 150ms ease;
          }
          .download-btn:hover {
            background: var(--color-text-secondary);
          }
          .file-info {
            color: #525252;
            font-size: 12px;
            margin: 16px 0;
          }
          .success {
            color: #166534;
            margin: 16px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2><i class="ph-party-popper ph-duotone"></i> Tokens Extracted Successfully!</h2>
          <div class="file-info">
            <strong>File:</strong> ${filename}<br>
            <strong>Size:</strong> ${(jsonString.length / 1024).toFixed(1)} KB<br>
            <strong>Collections:</strong> ${Object.keys(dataset.collections).length}<br>
            <strong>Variables:</strong> ${dataset.source.originalVariableCount}
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
 * Show instant loading screen
 * Ultra-minimal HTML for fastest possible rendering (<1ms)
 */
function showLoadingScreen(): void {
  // Minimal HTML with new design system styling
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://unpkg.com/phosphor-icons@1.4.2/src/css/icons.css" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Inter","Roboto","Helvetica Neue",Arial,sans-serif;background:linear-gradient(135deg,#DEE3FC 0%,#FFFFFF 100%);display:flex;align-items:center;justify-content:center;height:100vh;overflow:hidden;padding:24px}
.container{text-align:center;color:#0F1112;padding:32px;background:white;border-radius:16px;box-shadow:0 2px 8px rgba(15,17,18,0.04);max-width:400px}
.logo{font-size:64px;margin-bottom:24px;animation:scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)}
.title{font-size:24px;font-weight:700;margin-bottom:8px;animation:fadeIn 0.5s ease-out;color:#0F1112}
.subtitle{font-size:14px;color:#B1B2B6;margin-bottom:24px;animation:fadeIn 0.7s ease-out}
.spinner{width:24px;height:24px;border:3px solid #E5E7E9;border-top-color:#C084FC;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
</style>
</head>
<body>
<div class="container">
<div class="logo"><i class="ph-palette ph-duotone"></i></div>
<div class="title">Design System Distributor</div>
<div class="subtitle">Loading your design tokens...</div>
<div class="spinner"></div>
</div>
</body>
</html>`;

  figma.showUI(html, {
    width: PLUGIN_DIMENSIONS.DEFAULT_WIDTH,
    height: PLUGIN_DIMENSIONS.DEFAULT_HEIGHT,
    themeColors: true
  });
}

/**
 * Main plugin entry point - with loading screen and minimal logging
 */
async function main(): Promise<void> {
  const launchTime = Date.now();
  const timings: { [key: string]: number } = {};
  const userFacingTimings = {
    launch: launchTime,
    loadingScreenShown: 0,
    mainUIShown: 0
  };

  log.critical(`\n🚀 Plugin launched`);

  try {
    // Step 1: Show loading screen IMMEDIATELY
    const step1Start = Date.now();
    showLoadingScreen();
    userFacingTimings.loadingScreenShown = Date.now();
    const timeToLoadingScreen = userFacingTimings.loadingScreenShown - launchTime;

    log.critical(`🎨 Loading screen visible (+${timeToLoadingScreen}ms)`);

    timings['1_show_loading_screen'] = Date.now() - step1Start;
    log.debug(`⏱️  [${timings['1_show_loading_screen']}ms] Loading screen displayed`);

    // Step 2: Validate environment
    const step2Start = Date.now();
    if (!validateFigmaEnvironment()) {
      throw new Error('Invalid Figma environment. Please open a Figma document and try again.');
    }
    timings['2_validate_environment'] = Date.now() - step2Start;
    console.log(`⏱️  [${timings['2_validate_environment']}ms] Environment validated`);

    // Step 3: Get document info
    const step3Start = Date.now();
    const documentInfo = await getDocumentInfo();
    timings['3_get_document_info'] = Date.now() - step3Start;
    console.log(`⏱️  [${timings['3_get_document_info']}ms] Document info retrieved: ${documentInfo.name}`);

    // Step 4: Import ExportWorkflow module
    const step4Start = Date.now();
    const { ExportWorkflow } = await import('./workflow/ExportWorkflow');
    timings['4_import_workflow'] = Date.now() - step4Start;
    console.log(`⏱️  [${timings['4_import_workflow']}ms] ExportWorkflow module imported`);

    // Step 5: Create TokenExtractor
    const step5Start = Date.now();
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
    timings['5_create_extractor'] = Date.now() - step5Start;
    console.log(`⏱️  [${timings['5_create_extractor']}ms] TokenExtractor created`);

    // Step 6: Create workflow instance
    const step6Start = Date.now();
    const workflow = new ExportWorkflow({
      tokenExtractor,
      documentInfo
    });
    timings['6_create_workflow'] = Date.now() - step6Start;
    console.log(`⏱️  [${timings['6_create_workflow']}ms] Workflow instance created`);

    // Step 7: Run workflow (shows main UI)
    const step7Start = Date.now();
    const workflowResult = await workflow.runWorkflow();
    timings['7_run_workflow'] = Date.now() - step7Start;

    // =============================================================================
    // ✨ MAIN UI VISIBLE - Full interface displayed to user
    // =============================================================================
    userFacingTimings.mainUIShown = Date.now();
    const timeToMainUI = userFacingTimings.mainUIShown - launchTime;
    const loadingScreenDuration = userFacingTimings.mainUIShown - userFacingTimings.loadingScreenShown;
    console.log('\n' + '✨'.repeat(40));
    console.log(`✨ MAIN UI VISIBLE after ${timeToMainUI}ms`);
    console.log(`   (Loading screen was visible for ${loadingScreenDuration}ms)`);
    console.log('✨'.repeat(40) + '\n');

    console.log(`⏱️  [${timings['7_run_workflow']}ms] Workflow executed and UI shown`);

    // Calculate total time
    const totalDuration = Date.now() - launchTime;
    timings['TOTAL'] = totalDuration;

    // Print detailed performance report
    console.log('\n' + '='.repeat(80));
    console.log('📊 PERFORMANCE BREAKDOWN');
    console.log('='.repeat(80));
    console.log(`Step 1 - Show loading screen:     ${timings['1_show_loading_screen'].toString().padStart(6)}ms  (${((timings['1_show_loading_screen'] / totalDuration) * 100).toFixed(1)}%)`);
    console.log(`Step 2 - Validate environment:    ${timings['2_validate_environment'].toString().padStart(6)}ms  (${((timings['2_validate_environment'] / totalDuration) * 100).toFixed(1)}%)`);
    console.log(`Step 3 - Get document info:       ${timings['3_get_document_info'].toString().padStart(6)}ms  (${((timings['3_get_document_info'] / totalDuration) * 100).toFixed(1)}%)`);
    console.log(`Step 4 - Import workflow module:  ${timings['4_import_workflow'].toString().padStart(6)}ms  (${((timings['4_import_workflow'] / totalDuration) * 100).toFixed(1)}%)`);
    console.log(`Step 5 - Create TokenExtractor:   ${timings['5_create_extractor'].toString().padStart(6)}ms  (${((timings['5_create_extractor'] / totalDuration) * 100).toFixed(1)}%)`);
    console.log(`Step 6 - Create workflow:         ${timings['6_create_workflow'].toString().padStart(6)}ms  (${((timings['6_create_workflow'] / totalDuration) * 100).toFixed(1)}%)`);
    console.log(`Step 7 - Run workflow & show UI:  ${timings['7_run_workflow'].toString().padStart(6)}ms  (${((timings['7_run_workflow'] / totalDuration) * 100).toFixed(1)}%)`);
    console.log('─'.repeat(80));
    console.log(`TOTAL PLUGIN LOAD TIME:           ${totalDuration.toString().padStart(6)}ms  (100.0%)`);
    console.log('='.repeat(80));

    // Identify bottlenecks
    const sortedTimings = Object.entries(timings)
      .filter(([key]) => key !== 'TOTAL')
      .sort(([, a], [, b]) => b - a);

    console.log('\n🔍 SLOWEST OPERATIONS:');
    sortedTimings.slice(0, 3).forEach(([step, time], index) => {
      const stepName = step.replace(/^\d+_/, '').replace(/_/g, ' ');
      console.log(`  ${index + 1}. ${stepName}: ${time}ms`);
    });

    if (totalDuration > 1000) {
      console.log('\n⚠️  WARNING: Load time exceeds 1 second. Consider further optimization.');
    } else if (totalDuration < 500) {
      console.log('\n✅ EXCELLENT: Load time under 500ms!');
    } else {
      console.log('\n✓ GOOD: Load time acceptable.');
    }
    console.log('='.repeat(80));

    // Print user-facing timing summary
    console.log('\n' + '👤'.repeat(40));
    console.log('👤 USER-FACING PERFORMANCE MILESTONES');
    console.log('👤'.repeat(40));
    console.log(`\n🚀 Plugin launched:           ${new Date(userFacingTimings.launch).toTimeString().split(' ')[0]}`);
    console.log(`🎨 Loading screen shown:      +${userFacingTimings.loadingScreenShown - userFacingTimings.launch}ms`);
    console.log(`✨ Main UI shown:              +${userFacingTimings.mainUIShown - userFacingTimings.launch}ms`);
    console.log(`\n📊 Loading screen duration:    ${loadingScreenDuration}ms`);
    console.log(`📊 Total time to interactive:  ${timeToMainUI}ms`);
    console.log('\n' + '👤'.repeat(40) + '\n');

    if (!workflowResult.success && workflowResult.error) {
      figma.notify(`Export failed: ${workflowResult.error}`, { error: true });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Plugin failed:', errorMessage);
    figma.notify(`❌ Plugin failed: ${errorMessage}`, { error: true, timeout: 5000 });
    figma.closePlugin(`Plugin failed: ${errorMessage}`);
  }
}

// =============================================================================
// OLD CODE - KEPT FOR REFERENCE
// =============================================================================
/*
async function mainOLD(): Promise<void> {
    const mainStartTime = Date.now();
    if (false) {
      // Step 1: Validate Figma environment
      const step1Start = Date.now();
      console.log('Step 1: Validating Figma environment...');
      if (!validateFigmaEnvironment()) {
        throw new Error('Invalid Figma environment. Please open a Figma document and try again.');
      }
      const step1Duration = Date.now() - step1Start;
      console.log(`✓ Figma environment validation passed (${step1Duration}ms)`);
      figma.notify('✓ Environment validated', { timeout: 1500 });

      // Step 2: Test API access
      const step2Start = Date.now();
      console.log('Step 2: Testing Figma API access...');
      if (!testFigmaAPIAccess()) {
        throw new Error('Figma API access test failed');
      }
      const step2Duration = Date.now() - step2Start;
      console.log(`✓ Figma API access test passed (${step2Duration}ms)`);

      // Step 3: Get document information
      const step3Start = Date.now();
      console.log('Step 3: Gathering document information...');
      const documentInfo2 = getDocumentInfo();
      displayDocumentInfo(documentInfo2);
      const step3Duration = Date.now() - step3Start;
      console.log(`✓ Document information gathered (${step3Duration}ms)`);

      // Step 4: Count basic tokens
      const step4Start = Date.now();
      console.log('Step 4: Counting available tokens...');
      const tokenCount = countBasicTokens();
      displayTokenSummary(tokenCount);
      const step4Duration = Date.now() - step4Start;
      console.log(`✓ Token counting completed (${step4Duration}ms)`);

      // Step 5: Extract design tokens
      const step5Start = Date.now();
      console.log('Step 5: Extracting design tokens...');
      const extractionStartTime = Date.now();
      const extractionResult = await performRealExtraction();
      const extractionDuration = Date.now() - extractionStartTime;
      const step5Duration = Date.now() - step5Start;
      console.log(`✓ Token extraction completed (${step5Duration}ms, internal: ${extractionDuration}ms)`);

    // Step 6: Format and output JSON
    const step6Start = Date.now();
    console.log('Step 6: Formatting tokens as JSON...');
    outputJSONToConsole(extractionResult, documentInfo, extractionDuration);
    const step6Duration = Date.now() - step6Start;
    console.log(`✓ JSON output completed (${step6Duration}ms)`);

    // Step 7: Show export choice and handle user selection
    const step7Start = Date.now();
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

    // Lazy load ExportWorkflow to improve startup time
    const { ExportWorkflow } = await import('./workflow/ExportWorkflow');
    const workflow = new ExportWorkflow({
      tokenExtractor,
      documentInfo
    });

    const workflowResult = await workflow.runWorkflow();
    const step7Duration = Date.now() - step7Start;

    if (workflowResult.success) {
      console.log(`✅ Export completed via ${workflowResult.choice} (${step7Duration}ms)`);
    } else {
      console.error(`❌ Export failed: ${workflowResult.error} (${step7Duration}ms)`);
      figma.notify(`Export failed: ${workflowResult.error}`, { error: true });
    }
    console.log(`✓ Export workflow completed (${step7Duration}ms)`);

    // Step 8: Final summary (only if workflow didn't handle closing)
    if (workflowResult.choice !== 'cancel') {
      const step8Start = Date.now();
      console.log('Step 8: Generating final summary...');
      const totalTokens = extractionResult.tokens.length;
      const totalDuration = Date.now() - mainStartTime;

      console.log('\n' + '='.repeat(80));
      console.log('🎉 TOKEN EXTRACTION AND EXPORT COMPLETED');
      console.log('='.repeat(80));
      console.log(`📄 Document: ${documentInfo.name}`);
      console.log(`🌐 Total Nodes: ${documentInfo.totalNodes}`);
      console.log(`🎯 Extracted Tokens: ${totalTokens}`);
      console.log(`🔧 Variables: ${extractionResult.variables.length}`);
      console.log(`📚 Collections: ${extractionResult.collections.length}`);
      console.log(`⏱️  Extraction Time: ${extractionDuration}ms`);
      console.log(`⏱️  Total Plugin Time: ${totalDuration}ms`);
      console.log(`✅ Export Method: ${workflowResult.choice.toUpperCase()}`);
      console.log('='.repeat(80));
      console.log('\n📊 PERFORMANCE BREAKDOWN:');
      console.log(`  Step 1 - Environment validation: ${step1Duration}ms`);
      console.log(`  Step 2 - API access test: ${step2Duration}ms`);
      console.log(`  Step 3 - Document info: ${step3Duration}ms`);
      console.log(`  Step 4 - Token counting: ${step4Duration}ms`);
      console.log(`  Step 5 - Token extraction: ${step5Duration}ms`);
      console.log(`  Step 6 - JSON formatting: ${step6Duration}ms`);
      console.log(`  Step 7 - Export workflow: ${step7Duration}ms`);
      console.log(`  Step 8 - Final summary: ${Date.now() - step8Start}ms`);
      console.log(`  TOTAL: ${totalDuration}ms`);
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
*/

// =============================================================================
// EXPORT
// =============================================================================

export default main;