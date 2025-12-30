/**
 * Export Choice UI
 *
 * Creates a user interface that allows users to choose between
 * pushing tokens to GitHub or downloading them locally.
 */

import { ExtractionResult } from '../TokenExtractor';
import { DocumentInfo } from '../types/CommonTypes';
import { getSharedStyles } from './styles/theme';
import { getWindowOptions } from './constants';

// =============================================================================
// TYPES
// =============================================================================

export interface ExportChoice {
  type: 'git-push' | 'download' | 'cancel';
  gitConfig?: {
    repository?: string;
    commitMessage?: string;
  };
}

export interface ExportChoiceUIOptions {
  extractionResult: ExtractionResult;
  documentInfo: DocumentInfo;
  extractionDuration: number;
  hasGitConfigured: boolean;
  gitRepository?: string;
}

// =============================================================================
// EXPORT CHOICE UI
// =============================================================================

export class ExportChoiceUI {
  private options: ExportChoiceUIOptions;
  private resolveChoice: ((choice: ExportChoice) => void) | null = null;

  constructor(options: ExportChoiceUIOptions) {
    this.options = options;
  }

  /**
   * Show the export choice UI and wait for user selection
   */
  async showChoice(): Promise<ExportChoice> {
    return new Promise((resolve) => {
      this.resolveChoice = resolve;
      this.createUI();
      this.setupMessageHandling();
    });
  }

  /**
   * Create the choice UI HTML
   */
  private createUI(): void {
    const { extractionResult, documentInfo, hasGitConfigured, gitRepository } = this.options;

    const totalTokens = extractionResult.tokens.length + extractionResult.variables.length;
    const fileSize = this.estimateFileSize();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
       <head>
        <link href="https://unpkg.com/phosphor-icons@1.4.2/src/css/icons.css" rel="stylesheet">
        ${getSharedStyles()}
        <style>
          /* Estilos específicos de ExportChoiceUI */
          .stats {
            background: var(--color-background-primary);
            border-radius: var(--border-radius-md);
            padding: var(--spacing-lg);
            margin-bottom: var(--spacing-lg);
            border: 1px solid var(--color-border);
          }

          .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--spacing-md);
          }

          .stat-item {
            text-align: center;
          }

          .stat-value {
            font-size: var(--font-size-xl);
            font-weight: var(--font-weight-bold);
            color: var(--color-primary);
            margin-bottom: var(--spacing-xs);
          }

          .stat-label {
            font-size: var(--font-size-xs);
            color: var(--color-text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .choices {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-sm);
            margin-bottom: var(--spacing-lg);
          }

          .choice-button {
            background: var(--color-background-primary);
            border: 2px solid var(--color-border);
            border-radius: var(--border-radius-md);
            padding: var(--spacing-lg);
            cursor: pointer;
            transition: all var(--transition-default);
            text-align: left;
            position: relative;
          }

          .choice-button:hover {
            border-color: var(--color-primary);
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
          }

          .choice-button.selected {
            border: 3px solid #C084FC;
            background: rgba(252, 227, 224, 0.05);
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(192, 132, 252, 0.15);
          }

          .choice-button.selected::after {
            content: "✓";
            position: absolute;
            top: 12px;
            right: 12px;
            width: 20px;
            height: 20px;
            background: #C084FC;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            z-index: 1;
          }

          .choice-button.primary {
            background: var(--color-gradient);
            color: white;
            border-color: var(--color-primary-dark);
          }

          .choice-button.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background: var(--color-background-secondary);
          }

          .choice-status {
            position: absolute;
            top: var(--spacing-md);
            right: var(--spacing-md);
            font-size: var(--font-size-xs);
            padding: var(--spacing-xs) var(--spacing-sm);
            border-radius: var(--border-radius-full);
            background: rgba(0, 0, 0, 0.1);
          }

          .git-info {
            background: var(--color-info-light);
            border: 1px solid var(--color-info);
            border-radius: var(--border-radius-sm);
            padding: var(--spacing-sm);
            margin-top: var(--spacing-sm);
            font-size: var(--font-size-sm);
            color: var(--color-info-dark);
          }

          .git-info.error {
            background: var(--color-error-light);
            border-color: var(--color-error);
            color: var(--color-error-dark);
          }

          .loading {
            display: none;
            text-align: center;
            padding: var(--spacing-lg);
          }

          .spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid var(--color-background-secondary);
            border-top: 3px solid var(--color-primary);
            border-radius: var(--border-radius-full);
            animation: spin 1s linear infinite;
            margin-right: var(--spacing-sm);
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div id="main-content">
          <div class="header">
            <h2><i class="ph-party-popper" data-weight="duotone"></i> Tokens Extracted Successfully!</h2>
            <p>Choose how you'd like to export your design tokens</p>
          </div>

          <div class="stats">
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">${totalTokens}</div>
                <div class="stat-label">Total Tokens</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${fileSize}</div>
                <div class="stat-label">File Size</div>
              </div>
            </div>
          </div>

          <div class="choices">
            <div class="choice-button ${hasGitConfigured ? 'primary' : 'disabled'}" data-choice="git-push">
              <div class="choice-status">${hasGitConfigured ? 'Ready' : 'Setup Required'}</div>
              <div class="choice-icon"><i class="ph-rocket-launch" data-weight="duotone"></i></div>
              <div class="choice-title">Push to GitHub</div>
              <div class="choice-description">
                ${hasGitConfigured
                  ? `Push tokens directly to your repository and trigger automated processing`
                  : 'Requires GitHub configuration - push tokens directly to repository'
                }
              </div>
              ${hasGitConfigured && gitRepository ? `
                <div class="git-info">
                  📁 ${gitRepository} → tokens/raw/figma-tokens-${new Date().toISOString().split('T')[0]}.json
                </div>
              ` : ''}
              ${!hasGitConfigured ? `
                <div class="git-info error">
                  ⚠️ GitHub integration not configured. Setup required before pushing.
                </div>
              ` : ''}
            </div>

            <div class="choice-button" data-choice="download">
              <div class="choice-status">Always Available</div>
              <div class="choice-icon"><i class="ph-download-simple" data-weight="duotone"></i></div>
              <div class="choice-title">Download JSON File</div>
              <div class="choice-description">
                Download tokens as a JSON file to your computer for manual processing
              </div>
            </div>
          </div>

          <div class="footer">
            <button class="cancel-btn" onclick="handleCancel()">Cancel</button>
          </div>
        </div>

        <div id="loading" class="loading">
          <div class="spinner"></div>
          <span id="loading-message">Processing...</span>
        </div>

        <script>
          function showLoading(message) {
            document.getElementById('main-content').style.display = 'none';
            document.getElementById('loading').style.display = 'block';
            document.getElementById('loading-message').textContent = message;
          }

          function handleChoice(choice) {
            if (choice === 'git-push' && !${hasGitConfigured}) {
              alert('GitHub integration is not configured yet. Please set up GitHub integration first or choose download option.');
              return;
            }

            showLoading(choice === 'git-push' ? 'Pushing to GitHub...' : 'Preparing download...');

            parent.postMessage({
              pluginMessage: {
                type: 'export-choice',
                choice: choice,
                data: {
                  repository: '${gitRepository || ''}',
                  commitMessage: 'Update design tokens from ${documentInfo.name}'
                }
              }
            }, '*');
          }

          function handleCancel() {
            parent.postMessage({
              pluginMessage: {
                type: 'export-choice',
                choice: 'cancel'
              }
            }, '*');
          }

          // Add click handlers
          document.querySelectorAll('.choice-button').forEach(button => {
            button.addEventListener('click', (e) => {
              const choice = button.getAttribute('data-choice');
              if (!button.classList.contains('disabled')) {
                // Remove selected class from all buttons
                document.querySelectorAll('.choice-button').forEach(btn => btn.classList.remove('selected'));
                // Add selected class to clicked button
                button.classList.add('selected');
                // Wait a moment to show selection, then proceed
                setTimeout(() => {
                  handleChoice(choice);
                }, 200);
              }
            });
          });
        </script>
      </body>
      </html>
    `;

    figma.showUI(htmlContent, getWindowOptions('Export Design Tokens'));
  }

  /**
   * Setup message handling for UI interactions
   */
  private setupMessageHandling(): void {
    figma.ui.onmessage = (msg) => {
      if (msg.type === 'export-choice' && this.resolveChoice) {
        const choice: ExportChoice = {
          type: msg.choice,
          gitConfig: msg.data
        };

        this.resolveChoice(choice);
        this.resolveChoice = null;
      }
    };
  }

  /**
   * Estimate JSON file size
   */
  private estimateFileSize(): string {
    const { extractionResult } = this.options;

    // Rough estimation based on token counts
    const tokenCount = extractionResult.tokens.length + extractionResult.variables.length;
    const estimatedBytes = tokenCount * 200 + 5000; // Rough estimate

    if (estimatedBytes < 1024) {
      return `${estimatedBytes} B`;
    } else if (estimatedBytes < 1024 * 1024) {
      return `${(estimatedBytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(estimatedBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  }

  /**
   * Close the UI
   */
  close(): void {
    figma.closePlugin();
  }
}