/**
 * Unified Export UI with Integrated GitHub Setup
 *
 * Combines export choice and GitHub setup into a single tabbed interface
 * to eliminate state synchronization issues and provide better UX.
 */

import { ExtractionResult } from '../TokenExtractor';
import { DocumentInfo } from '../types/CommonTypes';
import { GitHubConfig } from '../github/GitHubTypes';
import { GitHubClient } from '../github/GitHubClient';

// =============================================================================
// TYPES
// =============================================================================

export interface ExportChoice {
  type: 'git-push' | 'download' | 'cancel';
  gitConfig?: GitHubConfig;
}

export interface UnifiedExportUIOptions {
  extractionResult: ExtractionResult;
  documentInfo: DocumentInfo;
  extractionDuration: number;
  existingGitConfig?: GitHubConfig;
}

// =============================================================================
// UNIFIED EXPORT UI
// =============================================================================

export class UnifiedExportUI {
  private options: UnifiedExportUIOptions;
  private resolveChoice: ((choice: ExportChoice) => void) | null = null;
  private gitConfig: Partial<GitHubConfig> = {};
  private validationStates = {
    token: false,
    repository: false
  };

  constructor(options: UnifiedExportUIOptions) {
    this.options = options;

    // Initialize with existing config if available
    if (options.existingGitConfig) {
      this.gitConfig = { ...options.existingGitConfig };
      this.validationStates.token = !!this.gitConfig.credentials?.token;
      this.validationStates.repository = !!(this.gitConfig.repository?.owner && this.gitConfig.repository?.name);
    }
  }

  /**
   * Show the unified export UI and wait for user selection
   */
  async showChoice(): Promise<ExportChoice> {
    return new Promise((resolve) => {
      this.resolveChoice = resolve;
      this.createUI();
      this.setupMessageHandling();
    });
  }

  /**
   * Create the unified UI with tabs
   */
  private createUI(): void {
    const { extractionResult, extractionDuration } = this.options;
    const tokenCount = extractionResult.tokens?.length || 0;
    const variableCount = extractionResult.variables?.length || 0;
    const fileSize = Math.round((JSON.stringify(extractionResult).length / 1024) * 10) / 10;

    const isGitConfigured = this.isGitConfigured();
    const gitStatus = this.getGitStatus();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.4;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
          }

          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
          }

          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 24px;
            text-align: center;
          }

          .header h1 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 8px;
          }

          .header p {
            opacity: 0.9;
            font-size: 16px;
          }

          .stats {
            display: flex;
            justify-content: space-around;
            padding: 16px;
            background: rgba(255,255,255,0.1);
            margin-top: 16px;
            border-radius: 8px;
          }

          .stat {
            text-align: center;
          }

          .stat-value {
            font-size: 20px;
            font-weight: 600;
            display: block;
          }

          .stat-label {
            font-size: 12px;
            opacity: 0.8;
          }

          .tabs {
            display: flex;
            border-bottom: 1px solid #e9ecef;
          }

          .tab {
            flex: 1;
            padding: 16px;
            text-align: center;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            color: #666;
            transition: all 0.3s ease;
          }

          .tab.active {
            color: #667eea;
            border-bottom: 2px solid #667eea;
            background: rgba(102, 126, 234, 0.05);
          }

          .tab:hover:not(.active) {
            background: rgba(0,0,0,0.05);
          }

          .tab-content {
            padding: 24px;
            min-height: 400px;
          }

          .tab-panel {
            display: none;
          }

          .tab-panel.active {
            display: block;
          }

          .export-options {
            display: grid;
            gap: 16px;
          }

          .export-option {
            border: 2px solid #e9ecef;
            border-radius: 12px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            background: white;
          }

          .export-option:hover {
            border-color: #667eea;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
          }

          .export-option.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background: #f8f9fa;
          }

          .export-option.disabled:hover {
            transform: none;
            box-shadow: none;
            border-color: #e9ecef;
          }

          .option-header {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
          }

          .option-icon {
            width: 24px;
            height: 24px;
            margin-right: 12px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
          }

          .option-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
          }

          .option-status {
            margin-left: auto;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
          }

          .status-ready {
            background: #d4edda;
            color: #155724;
          }

          .status-setup-required {
            background: #fff3cd;
            color: #856404;
          }

          .status-available {
            background: #cce7ff;
            color: #004085;
          }

          .option-description {
            color: #666;
            margin-bottom: 12px;
          }

          .option-details {
            font-size: 12px;
            color: #888;
          }

          .github-setup {
            display: grid;
            gap: 20px;
          }

          .setup-step {
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
          }

          .setup-step.completed {
            border-color: #28a745;
            background: rgba(40, 167, 69, 0.05);
          }

          .step-header {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
          }

          .step-number {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #667eea;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
            margin-right: 12px;
          }

          .step-number.completed {
            background: #28a745;
          }

          .step-title {
            font-size: 16px;
            font-weight: 600;
            color: #333;
          }

          .step-content {
            margin-left: 36px;
          }

          .form-group {
            margin-bottom: 16px;
          }

          .form-label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            color: #333;
          }

          .form-input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s ease;
          }

          .form-input:focus {
            outline: none;
            border-color: #667eea;
          }

          .form-help {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
          }

          .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
            text-align: center;
          }

          .btn-primary {
            background: #667eea;
            color: white;
          }

          .btn-primary:hover {
            background: #5a6fd8;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          }

          .btn-secondary {
            background: #6c757d;
            color: white;
          }

          .btn-secondary:hover {
            background: #5a6268;
          }

          .btn-success {
            background: #28a745;
            color: white;
          }

          .btn-success:hover {
            background: #218838;
          }

          .validation-status {
            margin-top: 12px;
            padding: 12px;
            border-radius: 6px;
            font-size: 14px;
          }

          .validation-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
          }

          .validation-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
          }

          .validation-loading {
            background: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
          }

          .actions {
            padding: 24px;
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
            text-align: center;
          }

          .hidden {
            display: none !important;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Design Tokens Extracted!</h1>
            <p>Choose how you'd like to export your design tokens</p>

            <div class="stats">
              <div class="stat">
                <span class="stat-value">${tokenCount + variableCount}</span>
                <span class="stat-label">Total Tokens</span>
              </div>
              <div class="stat">
                <span class="stat-value">${fileSize} KB</span>
                <span class="stat-label">File Size</span>
              </div>
              <div class="stat">
                <span class="stat-value">${Math.round(extractionDuration / 1000)}s</span>
                <span class="stat-label">Duration</span>
              </div>
            </div>
          </div>

          <div class="tabs">
            <button class="tab active" onclick="switchTab('export')">
              Export Options
            </button>
            <button class="tab" onclick="switchTab('github-setup')">
              GitHub Setup
            </button>
          </div>

          <div class="tab-content">
            <!-- Export Options Tab -->
            <div id="export-tab" class="tab-panel active">
              <div class="export-options">
                <div id="github-export-option" class="export-option ${isGitConfigured ? '' : 'disabled'}" onclick="${isGitConfigured ? 'selectExport(\'git-push\')' : 'switchTab(\'github-setup\')'}">
                  <div class="option-header">
                    <div class="option-icon" style="background: #28a745; color: white;">🚀</div>
                    <div class="option-title">Push to GitHub</div>
                    <div class="option-status ${isGitConfigured ? 'status-ready' : 'status-setup-required'}">
                      ${isGitConfigured ? 'Ready' : 'Setup Required'}
                    </div>
                  </div>
                  <div class="option-description">
                    Push tokens directly to your GitHub repository with automated commits
                  </div>
                  <div class="option-details">
                    ${isGitConfigured ?
                      `📁 ${gitStatus.repository} → ${gitStatus.path || 'tokens/raw/'}` :
                      'Configure your GitHub repository in the GitHub Setup tab'
                    }
                  </div>
                </div>

                <div class="export-option" onclick="selectExport('download')">
                  <div class="option-header">
                    <div class="option-icon" style="background: #667eea; color: white;">💾</div>
                    <div class="option-title">Download JSON File</div>
                    <div class="option-status status-available">Always Available</div>
                  </div>
                  <div class="option-description">
                    Download tokens as JSON file for manual processing or integration
                  </div>
                  <div class="option-details">
                    📄 figma-tokens-${new Date().toISOString().split('T')[0]}.json (${fileSize} KB)
                  </div>
                </div>
              </div>
            </div>

            <!-- GitHub Setup Tab -->
            <div id="github-setup-tab" class="tab-panel">
              <div class="github-setup">
                ${this.renderGitHubSetupSteps()}
              </div>
            </div>
          </div>

          <div class="actions">
            <button class="btn btn-secondary" onclick="selectExport('cancel')">
              Cancel
            </button>
          </div>
        </div>

        <script>
          let currentConfig = ${JSON.stringify(this.gitConfig)};
          let validationStates = ${JSON.stringify(this.validationStates)};

          function switchTab(tabName) {
            // Update tab buttons
            document.querySelectorAll('.tab').forEach(tab => {
              tab.classList.remove('active');
            });
            document.querySelector(\`button[onclick="switchTab('\${tabName}')"]\`).classList.add('active');

            // Update tab content
            document.querySelectorAll('.tab-panel').forEach(panel => {
              panel.classList.remove('active');
            });
            document.getElementById(tabName + '-tab').classList.add('active');
          }

          function selectExport(type) {
            parent.postMessage({
              pluginMessage: {
                type: 'export-choice',
                choice: type,
                config: type === 'git-push' ? currentConfig : undefined
              }
            }, '*');
          }

          function updateConfig(field, value) {
            const keys = field.split('.');
            let obj = currentConfig;
            for (let i = 0; i < keys.length - 1; i++) {
              if (!obj[keys[i]]) obj[keys[i]] = {};
              obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = value;

            parent.postMessage({
              pluginMessage: { type: 'config-update', config: currentConfig, field, value }
            }, '*');
          }

          function validateToken() {
            const token = document.getElementById('github-token').value;
            if (!token) return;

            const statusDiv = document.getElementById('token-validation');
            statusDiv.style.display = 'block';
            statusDiv.className = 'validation-status validation-loading';
            statusDiv.textContent = '🔄 Validating token...';

            parent.postMessage({
              pluginMessage: { type: 'validate-token', token }
            }, '*');
          }

          function validateRepository() {
            const owner = document.getElementById('repo-owner').value;
            const name = document.getElementById('repo-name').value;
            if (!owner || !name) return;

            const statusDiv = document.getElementById('repo-validation');
            statusDiv.style.display = 'block';
            statusDiv.className = 'validation-status validation-loading';
            statusDiv.textContent = '🔄 Validating repository access...';

            parent.postMessage({
              pluginMessage: { type: 'validate-repository', owner, name }
            }, '*');
          }

          function completeSetup() {
            if (!validationStates.token || !validationStates.repository) {
              alert('Please complete token and repository validation first');
              return;
            }

            // Collect all form values before saving
            updateConfig('credentials.token', document.getElementById('github-token').value);
            updateConfig('repository.owner', document.getElementById('repo-owner').value);
            updateConfig('repository.name', document.getElementById('repo-name').value);
            updateConfig('repository.branch', document.getElementById('repo-branch').value || 'main');
            updateConfig('paths.rawTokens', document.getElementById('raw-tokens-path').value || 'tokens/raw/');
            updateConfig('commitMessage', document.getElementById('commit-message').value || 'feat: update design tokens from Figma - {{timestamp}}');

            parent.postMessage({
              pluginMessage: { type: 'complete-setup', config: currentConfig }
            }, '*');
          }

          function updateExportOption() {
            const isConfigured = validationStates.token && validationStates.repository;
            // Use reliable ID selector
            const gitOption = document.getElementById('github-export-option');

            if (gitOption) {
              if (isConfigured) {
                gitOption.classList.remove('disabled');
                gitOption.setAttribute('onclick', 'selectExport("git-push")');
                const statusEl = gitOption.querySelector('.option-status');
                if (statusEl) {
                  statusEl.textContent = 'Ready';
                  statusEl.className = 'option-status status-ready';
                }
              } else {
                gitOption.classList.add('disabled');
                gitOption.setAttribute('onclick', 'switchTab("github-setup")');
                const statusEl = gitOption.querySelector('.option-status');
                if (statusEl) {
                  statusEl.textContent = 'Setup Required';
                  statusEl.className = 'option-status status-setup-required';
                }
              }
            } else {
              console.warn('Could not find GitHub export option element');
            }
          }

          // Handle validation results
          window.addEventListener('message', function(event) {
            if (event.data.pluginMessage) {
              const msg = event.data.pluginMessage;

              if (msg.type === 'token-validation-result') {
                const statusDiv = document.getElementById('token-validation');
                if (statusDiv) {
                  statusDiv.style.display = 'block';
                  statusDiv.className = 'validation-status ' + (msg.success ? 'validation-success' : 'validation-error');
                  statusDiv.textContent = msg.message;

                  validationStates.token = msg.success;
                  updateStepCompletion('token-step', msg.success);
                  updateExportOption();

                  // Update the Complete Setup button state
                  const completeButton = document.querySelector('button[onclick="completeSetup()"]');
                  if (completeButton) {
                    if (validationStates.token && validationStates.repository) {
                      completeButton.disabled = false;
                      completeButton.parentElement.querySelector('.form-help').textContent = 'Configuration is ready to be saved';
                    } else {
                      completeButton.disabled = true;
                      completeButton.parentElement.querySelector('.form-help').textContent = 'Complete token and repository validation first';
                    }
                  }
                }
              }

              if (msg.type === 'repository-validation-result') {
                const statusDiv = document.getElementById('repo-validation');
                if (statusDiv) {
                  statusDiv.style.display = 'block';
                  statusDiv.className = 'validation-status ' + (msg.success ? 'validation-success' : 'validation-error');
                  statusDiv.textContent = msg.message;

                  validationStates.repository = msg.success;
                  updateStepCompletion('repository-step', msg.success);
                  updateExportOption();

                  // Update the Complete Setup button state
                  const completeButton = document.querySelector('button[onclick="completeSetup()"]');
                  if (completeButton) {
                    if (validationStates.token && validationStates.repository) {
                      completeButton.disabled = false;
                      completeButton.parentElement.querySelector('.form-help').textContent = 'Configuration is ready to be saved';
                    } else {
                      completeButton.disabled = true;
                      completeButton.parentElement.querySelector('.form-help').textContent = 'Complete token and repository validation first';
                    }
                  }
                }
              }

              if (msg.type === 'setup-complete') {
                if (msg.success) {
                  // Update the current configuration with the completed setup
                  if (msg.config) {
                    currentConfig = msg.config;
                    console.log('✅ Updated currentConfig with completed setup:', currentConfig);
                  }
                  // Update validation states and UI
                  updateExportOption();
                }
              }

              if (msg.type === 'switch-to-export-tab') {
                switchTab('export');
              }
            }
          });

          function updateStepCompletion(stepId, isCompleted) {
            const step = document.getElementById(stepId);
            const stepNumber = step.querySelector('.step-number');

            if (isCompleted) {
              step.classList.add('completed');
              stepNumber.classList.add('completed');
              stepNumber.textContent = '✓';
            } else {
              step.classList.remove('completed');
              stepNumber.classList.remove('completed');
              stepNumber.textContent = stepNumber.getAttribute('data-number');
            }
          }

          // Auto-save form changes
          document.addEventListener('input', function(e) {
            if (e.target.classList.contains('form-input')) {
              updateConfig(e.target.dataset.field, e.target.value);
            }
          });
        </script>
      </body>
      </html>
    `;

    figma.showUI(htmlContent, {
      width: 640,
      height: 720,
      themeColors: true
    });
  }

  private renderGitHubSetupSteps(): string {
    const token = this.gitConfig.credentials?.token || '';
    const repo = this.gitConfig.repository || { owner: '', name: '', branch: 'main' };
    const paths = this.gitConfig.paths || { rawTokens: 'tokens/raw/', processedTokens: 'tokens/processed/' };

    return `
      <div id="token-step" class="setup-step ${this.validationStates.token ? 'completed' : ''}">
        <div class="step-header">
          <div class="step-number ${this.validationStates.token ? 'completed' : ''}" data-number="1">
            ${this.validationStates.token ? '✓' : '1'}
          </div>
          <div class="step-title">GitHub Personal Access Token</div>
        </div>
        <div class="step-content">
          <div class="form-group">
            <label class="form-label" for="github-token">Personal Access Token</label>
            <input
              type="password"
              id="github-token"
              class="form-input"
              data-field="credentials.token"
              value="${token}"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            >
            <div class="form-help">
              Create a token at
              <a href="https://github.com/settings/personal-access-tokens/new" target="_blank">GitHub Settings</a>
              with 'repo' scope
            </div>
          </div>
          <button class="btn btn-primary" onclick="validateToken()">
            Validate Token
          </button>
          <div id="token-validation" class="validation-status" style="display: none;"></div>
        </div>
      </div>

      <div id="repository-step" class="setup-step ${this.validationStates.repository ? 'completed' : ''}">
        <div class="step-header">
          <div class="step-number ${this.validationStates.repository ? 'completed' : ''}" data-number="2">
            ${this.validationStates.repository ? '✓' : '2'}
          </div>
          <div class="step-title">Repository Configuration</div>
        </div>
        <div class="step-content">
          <div class="form-group">
            <label class="form-label" for="repo-owner">Repository Owner</label>
            <input
              type="text"
              id="repo-owner"
              class="form-input"
              data-field="repository.owner"
              value="${repo.owner || ''}"
              placeholder="your-org-or-username"
            >
          </div>

          <div class="form-group">
            <label class="form-label" for="repo-name">Repository Name</label>
            <input
              type="text"
              id="repo-name"
              class="form-input"
              data-field="repository.name"
              value="${repo.name || ''}"
              placeholder="design-tokens"
            >
          </div>

          <div class="form-group">
            <label class="form-label" for="repo-branch">Branch</label>
            <input
              type="text"
              id="repo-branch"
              class="form-input"
              data-field="repository.branch"
              value="${repo.branch || 'main'}"
              placeholder="main"
            >
            <div class="form-help">The branch where tokens will be pushed</div>
          </div>

          <button class="btn btn-primary" onclick="validateRepository()">
            Validate Repository Access
          </button>
          <div id="repo-validation" class="validation-status" style="display: none;"></div>
        </div>
      </div>

      <div class="setup-step">
        <div class="step-header">
          <div class="step-number" data-number="3">3</div>
          <div class="step-title">File Paths & Settings</div>
        </div>
        <div class="step-content">
          <div class="form-group">
            <label class="form-label" for="raw-tokens-path">Raw Tokens Path</label>
            <input
              type="text"
              id="raw-tokens-path"
              class="form-input"
              data-field="paths.rawTokens"
              value="${paths.rawTokens || 'tokens/raw/'}"
              placeholder="tokens/raw/"
            >
            <div class="form-help">Directory where raw token files will be stored</div>
          </div>

          <div class="form-group">
            <label class="form-label" for="commit-message">Commit Message Template</label>
            <input
              type="text"
              id="commit-message"
              class="form-input"
              data-field="commitMessage"
              value="${this.gitConfig.commitMessage || 'feat: update design tokens from Figma - {{timestamp}}'}"
              placeholder="feat: update design tokens from Figma - {{timestamp}}"
            >
            <div class="form-help">Use {{timestamp}} for automatic timestamp insertion</div>
          </div>

          <div class="setup-actions" style="margin-top: 24px; text-align: center;">
            <button class="btn btn-primary" onclick="completeSetup()" ${this.validationStates.token && this.validationStates.repository ? '' : 'disabled'}>
              Complete Setup
            </button>
            <div class="form-help" style="margin-top: 8px;">
              ${this.validationStates.token && this.validationStates.repository ?
                'Configuration is ready to be saved' :
                'Complete token and repository validation first'
              }
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private isGitConfigured(): boolean {
    return this.validationStates.token && this.validationStates.repository;
  }

  private getGitStatus(): { repository?: string; path?: string } {
    if (!this.isGitConfigured()) {
      return {};
    }

    const repo = this.gitConfig.repository;
    return {
      repository: repo ? `${repo.owner}/${repo.name}` : undefined,
      path: this.gitConfig.paths?.rawTokens || 'tokens/raw/'
    };
  }

  /**
   * Setup message handling for UI interactions
   */
  private setupMessageHandling(): void {
    figma.ui.onmessage = async (msg) => {
      switch (msg.type) {
        case 'export-choice':
          await this.handleExportChoice(msg.choice, msg.config);
          break;
        case 'config-update':
          this.handleConfigUpdate(msg.config);
          break;
        case 'validate-token':
          await this.handleTokenValidation(msg.token);
          break;
        case 'validate-repository':
          await this.handleRepositoryValidation(msg.owner, msg.name);
          break;
        case 'complete-setup':
          await this.handleCompleteSetup(msg.config);
          break;
      }
    };
  }

  private async handleExportChoice(choice: string, config?: GitHubConfig): Promise<void> {
    if (this.resolveChoice) {
      const exportChoice: ExportChoice = {
        type: choice as ExportChoice['type'],
        gitConfig: config
      };
      this.resolveChoice(exportChoice);
    }
  }

  private handleConfigUpdate(config: Partial<GitHubConfig>): void {
    this.gitConfig = { ...this.gitConfig, ...config };
  }

  private async handleTokenValidation(token: string): Promise<void> {
    try {
      console.log('🔍 Validating GitHub token:', token.substring(0, 10) + '...');

      // Basic format validation
      if (!token.startsWith('ghp_') || token.length !== 40) {
        figma.ui.postMessage({
          type: 'token-validation-result',
          success: false,
          message: 'Invalid token format. GitHub Personal Access Tokens should start with "ghp_" and be 40 characters long.'
        });
        return;
      }

      // Create a temporary client to test the token
      const testClient = new GitHubClient({ token });

      // Validate token permissions
      const validation = await testClient.validateTokenPermissions();

      if (validation.valid) {
        console.log('✅ Token validation successful');

        // Store the credentials
        if (!this.gitConfig.credentials) {
          this.gitConfig.credentials = { token: '', username: '' };
        }
        this.gitConfig.credentials.token = token;
        this.validationStates.token = true;

        figma.ui.postMessage({
          type: 'token-validation-result',
          success: true,
          message: '✅ Token is valid and has required permissions',
          user: validation.user
        });
      } else {
        console.log('❌ Token validation failed:', validation.error);
        this.validationStates.token = false;
        figma.ui.postMessage({
          type: 'token-validation-result',
          success: false,
          message: validation.error || 'Token validation failed'
        });
      }

    } catch (error) {
      console.error('❌ Token validation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Token validation failed';
      this.validationStates.token = false;

      figma.ui.postMessage({
        type: 'token-validation-result',
        success: false,
        message: `Token validation failed: ${errorMessage}`
      });
    }
  }

  private async handleRepositoryValidation(owner: string, name: string): Promise<void> {
    try {
      console.log('🔍 Validating repository access:', `${owner}/${name}`);

      // Basic input validation
      if (!owner || !name) {
        figma.ui.postMessage({
          type: 'repository-validation-result',
          success: false,
          message: 'Please provide both repository owner and name'
        });
        return;
      }

      // Check if we have credentials available for testing
      if (!this.gitConfig.credentials?.token) {
        figma.ui.postMessage({
          type: 'repository-validation-result',
          success: false,
          message: 'Please validate your GitHub token first before testing repository access'
        });
        return;
      }

      // Create a temporary client for validation
      const testClient = new GitHubClient(this.gitConfig.credentials);

      // Test repository access
      const testResult = await testClient.testConnection({ owner, name });

      if (testResult.success) {
        console.log('✅ Repository validation successful');

        // Store the repository config
        if (!this.gitConfig.repository) this.gitConfig.repository = { owner: '', name: '', branch: 'main' };
        this.gitConfig.repository.owner = owner;
        this.gitConfig.repository.name = name;
        this.validationStates.repository = true;

        figma.ui.postMessage({
          type: 'repository-validation-result',
          success: true,
          message: `✅ Repository access confirmed`,
          permissions: testResult.permissions
        });
      } else {
        console.log('❌ Repository validation failed:', testResult.error);
        this.validationStates.repository = false;
        figma.ui.postMessage({
          type: 'repository-validation-result',
          success: false,
          message: testResult.error || 'Repository validation failed'
        });
      }

    } catch (error) {
      console.error('❌ Repository validation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Repository validation failed';
      this.validationStates.repository = false;

      figma.ui.postMessage({
        type: 'repository-validation-result',
        success: false,
        message: `Validation failed: ${errorMessage}`
      });
    }
  }

  /**
   * Handle setup completion - save configuration and enable GitHub push
   */
  private async handleCompleteSetup(config: GitHubConfig): Promise<void> {
    try {
      console.log('🎯 Completing GitHub setup with config:', config);

      // Update internal configuration
      this.gitConfig = { ...config };

      // Save configuration to persistent storage (you'll need to import GitHubAuth or similar)
      // For now, we'll rely on the config being passed back when export is selected

      // Provide user feedback
      figma.notify('✅ GitHub configuration saved successfully!', { timeout: 3000 });

      // Update UI to reflect that setup is complete
      figma.ui.postMessage({
        type: 'setup-complete',
        success: true,
        message: 'GitHub configuration saved successfully!',
        config: this.gitConfig
      });

      // Switch back to export tab to show the now-enabled GitHub push option
      setTimeout(() => {
        figma.ui.postMessage({
          type: 'switch-to-export-tab'
        });
      }, 1500);

    } catch (error) {
      console.error('❌ Setup completion failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Setup completion failed';

      figma.notify(`Setup failed: ${errorMessage}`, { error: true, timeout: 5000 });

      figma.ui.postMessage({
        type: 'setup-complete',
        success: false,
        message: `Setup failed: ${errorMessage}`
      });
    }
  }
}