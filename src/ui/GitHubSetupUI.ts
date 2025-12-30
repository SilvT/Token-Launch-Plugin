/**
 * GitHub Setup UI - Dynamic Repository Configuration
 *
 * Allows users to configure their own GitHub repository and credentials
 * for pushing design tokens dynamically.
 */

import { GitHubConfig } from '../github/GitHubTypes';
import { GitHubClient } from '../github/GitHubClient';
import { generateDesignSystemCSS } from '../design-system/html-utils';
import { getWindowOptions } from './constants';


export interface GitHubSetupOptions {
  onComplete: (config: GitHubConfig) => void;
  onCancel: () => void;
  existingConfig?: GitHubConfig;
}

export interface GitHubSetupResult {
  success: boolean;
  config?: GitHubConfig;
  error?: string;
}

export interface SetupStep {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
  isActive: boolean;
}

export class GitHubSetupUI {
  private options: GitHubSetupOptions | null = null;
  private currentConfig: Partial<GitHubConfig> = {};
  private currentStep = 0;
  private resolveSetup: ((config: GitHubConfig | null) => void) | null = null;

  constructor(options?: GitHubSetupOptions) {
    this.options = options || null;
    if (options?.existingConfig) {
      this.currentConfig = { ...options.existingConfig };
    }
  }

  /**
   * Run the complete setup wizard and return the result
   */
  async runSetup(): Promise<GitHubSetupResult> {
    try {
      const config = await this.showSetup();

      if (config) {
        return {
          success: true,
          config
        };
      } else {
        return {
          success: false,
          error: 'Setup was cancelled by user'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Setup failed'
      };
    }
  }

  /**
   * Show the GitHub setup wizard
   */
  async showSetup(): Promise<GitHubConfig | null> {
    return new Promise((resolve) => {
      this.resolveSetup = resolve;
      this.createSetupUI();
      this.setupMessageHandling();
    });
  }

  /**
   * Create the setup wizard UI
   */
  private createSetupUI(): void {
    const steps = this.getSetupSteps();
    const currentStepData = steps[this.currentStep];

    const htmlContent = `
      <!DOCTYPE html>
      <html>
       <head>
        <link href="https://unpkg.com/phosphor-icons@1.4.2/src/css/icons.css" rel="stylesheet">
        <style>
          ${generateDesignSystemCSS()}
        </style>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: var(--font-family);
            background: var(--color-background-gradient) !important;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .setup-container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            width: 100%;
            overflow: hidden;
          }

          .setup-header {
            background: linear-gradient(135deg, #F7E3E3 0%, #DEE3FC 100%);
            color: #000000;
            padding: 24px;
            text-align: center;
          }

          .setup-header h1 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 8px;
          }

          .setup-header p {
            font-size: 14px;
            opacity: 0.9;
          }

          .step-progress {
            display: flex;
            justify-content: center;
            padding: 24px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
          }

          .step-indicator {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .step-circle {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
          }

          .step-circle.completed {
            background: #28a745;
            color: white;
          }

          .step-circle.active {
            background: #000000;
            color: white;
          }

          .step-circle.pending {
            background: #e9ecef;
            color: #6c757d;
          }

          .step-connector {
            width: 40px;
            height: 2px;
            background: #e9ecef;
          }

          .step-connector.completed {
            background: #28a745;
          }

          .setup-content {
            padding: 32px;
          }

          .step-title {
            font-size: 20px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 8px;
          }

          .step-description {
            color: #666;
            margin-bottom: 24px;
            line-height: 1.6;
          }

          .form-group {
            margin-bottom: 20px;
          }

          .form-label {
            display: block;
            font-weight: 500;
            color: #333;
            margin-bottom: 8px;
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
            outline: 2px solid var(--color-primary-light);
            outline-offset: 2px;
            border-color: var(--color-text-primary);
          }

          .form-help {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
          }

          .repository-preview {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
          }

          .preview-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }

          .preview-label {
            font-weight: 500;
            color: #333;
          }

          .preview-value {
            color: #000000;
            font-family: 'Monaco', monospace;
            font-size: 12px;
          }

          .setup-actions {
            display: flex;
            justify-content: space-between;
            padding: 24px 32px;
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
          }

          .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .btn-secondary {
            background: #6c757d;
            color: white;
          }

          .btn-secondary:hover {
            background: var(--color-text-secondary);
          }

          .btn-primary {
            background: var(--color-primary-light);
            color: var(--color-text-primary);
            font-weight: 600;
          }

          .btn-primary:hover {
            background: var(--color-primary-dark);
            color: white;
          }

          .btn-primary:focus {
            outline: 2px solid var(--color-primary-light);
            outline-offset: 2px;
          }

          .btn:disabled {
            background: #e9ecef;
            color: #6c757d;
            cursor: not-allowed;
          }

          .validation-status {
            margin-top: 12px;
            padding: 12px;
            border-radius: 6px;
            font-size: 12px;
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
        </style>
      </head>
      <body>
        <div class="setup-container">
          <div class="setup-header">
            <h1><i class="ph-rocket-launch" data-weight="duotone"></i> GitHub Integration Setup</h1>
            <p>Configure your repository for design token distribution</p>
          </div>

          <div class="step-progress">
            <div class="step-indicator">
              ${steps.map((step, index) => this.renderStepIndicator(step, index)).join('')}
            </div>
          </div>

          <div class="setup-content">
            <h2 class="step-title">${currentStepData.title}</h2>
            <p class="step-description">${currentStepData.description}</p>

            <div id="step-content">
              ${this.renderStepContent(this.currentStep)}
            </div>
          </div>

          <div class="setup-actions">
            <button class="btn btn-secondary" onclick="handleCancel()">
              ${this.currentStep === 0 ? 'Cancel' : 'Back'}
            </button>
            <button class="btn btn-primary" id="next-btn" onclick="handleNext()">
              ${this.currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
            </button>
          </div>
        </div>

        <script>
          let currentConfig = ${JSON.stringify(this.currentConfig)};
          let currentStep = ${this.currentStep};

          function handleNext() {
            parent.postMessage({
              pluginMessage: { type: 'setup-next', config: currentConfig, step: currentStep }
            }, '*');
          }

          function handleCancel() {
            if (currentStep === 0) {
              parent.postMessage({
                pluginMessage: { type: 'setup-cancel' }
              }, '*');
            } else {
              parent.postMessage({
                pluginMessage: { type: 'setup-back', step: currentStep }
              }, '*');
            }
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
              pluginMessage: { type: 'setup-update', config: currentConfig, field, value }
            }, '*');
          }

          function validateToken() {
            const token = document.getElementById('github-token').value;
            parent.postMessage({
              pluginMessage: { type: 'validate-token', token }
            }, '*');
          }

          function validateRepository() {
            const owner = document.getElementById('repo-owner').value;
            const name = document.getElementById('repo-name').value;
            parent.postMessage({
              pluginMessage: { type: 'validate-repository', owner, name }
            }, '*');
          }

          function populateBranchDropdown(branches) {
            console.log('🌿 populateBranchDropdown called with:', branches);
            const branchInput = document.getElementById('repo-branch');
            console.log('🌿 Found branchInput element:', branchInput, 'tagName:', branchInput?.tagName);

            if (branchInput && branchInput.tagName === 'INPUT') {
              console.log('🌿 Converting input to dropdown...');
              // Replace input with select dropdown
              const currentValue = branchInput.value || 'main';
              const parentDiv = branchInput.parentElement;

              const select = document.createElement('select');
              select.id = 'repo-branch';
              select.className = 'form-input';
              select.setAttribute('data-field', 'repository.branch');

              branches.forEach(branch => {
                const option = document.createElement('option');
                option.value = branch;
                option.textContent = branch;
                if (branch === currentValue || (currentValue === 'main' && branch === 'main') || (currentValue === 'main' && !branches.includes('main') && branch === 'master')) {
                  option.selected = true;
                }
                select.appendChild(option);
              });

              parentDiv.replaceChild(select, branchInput);
              updateConfig('repository.branch', select.value);

              select.addEventListener('change', function() {
                updateConfig('repository.branch', this.value);
              });
              console.log('✅ Branch dropdown created successfully');
            } else {
              console.log('❌ Branch input not found or not an INPUT element');
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
                }
              }

              if (msg.type === 'repository-validation-result') {
                const statusDiv = document.getElementById('repo-validation');
                if (statusDiv) {
                  statusDiv.style.display = 'block';
                  statusDiv.className = 'validation-status ' + (msg.success ? 'validation-success' : 'validation-error');
                  statusDiv.innerHTML = msg.message;
                }

                // If validation successful, populate branch dropdown
                if (msg.success && msg.branches) {
                  console.log('🌿 Received branches:', msg.branches);
                  populateBranchDropdown(msg.branches);
                } else if (msg.success) {
                  console.log('✅ Validation successful but no branches received');
                }
              }
            }
          });

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

    figma.showUI(htmlContent, getWindowOptions('GitHub Integration Setup'));
  }

  /**
   * Render step indicator
   */
  private renderStepIndicator(step: SetupStep, index: number): string {
    const isLast = index === this.getSetupSteps().length - 1;
    const circleClass = step.isComplete ? 'completed' : step.isActive ? 'active' : 'pending';
    const connectorClass = step.isComplete ? 'completed' : '';

    return `
      <div class="step-circle ${circleClass}">
        ${step.isComplete ? '✓' : index + 1}
      </div>
      ${!isLast ? `<div class="step-connector ${connectorClass}"></div>` : ''}
    `;
  }

  /**
   * Render content for current step
   */
  private renderStepContent(stepIndex: number): string {
    switch (stepIndex) {
      case 0:
        return this.renderTokenStep();
      case 1:
        return this.renderRepositoryStep();
      case 2:
        return this.renderConfirmationStep();
      default:
        return '';
    }
  }

  /**
   * Step 1: GitHub Token
   */
  private renderTokenStep(): string {
    const token = this.currentConfig.credentials?.token || '';

    return `
      <div class="form-group">
        <label class="form-label" for="github-token">GitHub Personal Access Token</label>
        <input
          type="password"
          id="github-token"
          class="form-input"
          data-field="credentials.token"
          value="${token}"
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        >
        <div class="form-help">
          Create a new token at
          <a href="https://github.com/settings/personal-access-tokens/new" target="_blank">
            GitHub Settings
          </a>
          with 'repo' scope
        </div>
        <button class="btn btn-secondary" onclick="validateToken()" style="margin-top: 12px;">
          Validate Token
        </button>
        <div id="token-validation" class="validation-status" style="display: none;"></div>
      </div>

      <div class="form-group">
        <label class="form-label" for="github-username">GitHub Username (Optional)</label>
        <input
          type="text"
          id="github-username"
          class="form-input"
          data-field="credentials.username"
          value="${this.currentConfig.credentials?.username || ''}"
          placeholder="your-username"
        >
        <div class="form-help">Will be auto-detected from your token if not provided</div>
      </div>
    `;
  }

  /**
   * Step 2: Repository Configuration
   */
  private renderRepositoryStep(): string {
    const repo = this.currentConfig.repository || { owner: '', name: '', branch: 'main' };

    return `
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
        <button class="btn btn-secondary" onclick="validateRepository()" style="margin-top: 12px;">
          Validate Repository Access
        </button>
        <div id="repo-validation" class="validation-status" style="display: none;"></div>
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
        <div class="form-help">
          The branch where tokens will be pushed
          <br><br>
          ⚠️ Tip: Most teams use 'main' or 'master'. Don't know? Check your repository on GitHub.
        </div>
      </div>
    `;
  }


  /**
   * Step 4: Confirmation
   */
  private renderConfirmationStep(): string {
    const config = this.currentConfig;

    return `
      <div class="repository-preview">
        <h3 style="margin-bottom: 16px; color: var(--color-text-primary);">Configuration Summary</h3>

        <div class="preview-item">
          <span class="preview-label">Repository:</span>
          <span class="preview-value">${config.repository?.owner}/${config.repository?.name}</span>
        </div>

        <div class="preview-item">
          <span class="preview-label">Branch:</span>
          <span class="preview-value">${config.repository?.branch}</span>
        </div>


        <div class="preview-item">
          <span class="preview-label">Token:</span>
          <span class="preview-value">${config.credentials?.token?.substring(0, 10)}...</span>
        </div>
      </div>

      <p style="color: var(--color-text-secondary); font-size: 14px; margin-top: 16px;">
        Click "Complete Setup" to save this configuration and start using GitHub integration.
        You can change these settings later in the plugin preferences.
      </p>
    `;
  }

  /**
   * Get setup steps configuration
   */
  private getSetupSteps(): SetupStep[] {
    return [
      {
        id: 'token',
        title: 'GitHub Authentication',
        description: 'Provide your GitHub Personal Access Token to authenticate with GitHub API.',
        isComplete: this.currentStep > 0,
        isActive: this.currentStep === 0
      },
      {
        id: 'repository',
        title: 'Repository Configuration',
        description: 'Specify the GitHub repository where design tokens will be stored.',
        isComplete: this.currentStep > 1,
        isActive: this.currentStep === 1
      },
      {
        id: 'confirmation',
        title: 'Confirm & Save',
        description: 'Review your configuration and complete the setup.',
        isComplete: false,
        isActive: this.currentStep === 2
      }
    ];
  }

  /**
   * Setup message handling from UI
   */
  private setupMessageHandling(): void {
    figma.ui.onmessage = async (msg) => {
      switch (msg.type) {
        case 'setup-next':
          await this.handleNext(msg.config);
          break;
        case 'setup-back':
          this.handleBack();
          break;
        case 'setup-cancel':
          this.handleCancel();
          break;
        case 'setup-update':
          this.handleUpdate(msg.config, msg.field, msg.value);
          break;
        case 'validate-token':
          await this.handleTokenValidation(msg.token);
          break;
        case 'validate-repository':
          await this.handleRepositoryValidation(msg.owner, msg.name);
          break;
      }
    };
  }

  /**
   * Handle next step
   */
  private async handleNext(config: Partial<GitHubConfig>): Promise<void> {
    this.currentConfig = config;

    // Ensure defaults are set for validation
    if (!this.currentConfig.repository) {
      this.currentConfig.repository = {
        owner: '',
        name: '',
        branch: 'main'
      };
    } else {
      if (!this.currentConfig.repository.branch) {
        this.currentConfig.repository.branch = 'main';
      }
    }


    if (this.currentStep < 3) {
      this.currentStep++;
      this.createSetupUI();
    } else {
      // Complete setup
      console.log('🔧 Setup completion - Validating configuration:', this.currentConfig);

      if (this.isConfigurationValid()) {
        console.log('✅ Configuration is valid, completing setup...');

        if (this.options) {
          this.options.onComplete(this.currentConfig as GitHubConfig);
        }
        if (this.resolveSetup) {
          this.resolveSetup(this.currentConfig as GitHubConfig);
        }
        // Don't close plugin - let the main workflow continue
      } else {
        console.log('❌ Configuration validation failed:', this.currentConfig);
        figma.notify('Please fill in all required fields', { error: true });
      }
    }
  }

  /**
   * Handle back step
   */
  private handleBack(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.createSetupUI();
    }
  }

  /**
   * Handle cancel
   */
  private handleCancel(): void {
    if (this.options) {
      this.options.onCancel();
    }
    if (this.resolveSetup) {
      this.resolveSetup(null);
    }
    // Don't close plugin automatically - let the main workflow handle it
  }

  /**
   * Handle configuration update
   */
  private handleUpdate(config: Partial<GitHubConfig>, field: string, value: string): void {
    this.currentConfig = config;
    console.log(`Updated ${field}: ${value}`);
  }

  /**
   * Handle token validation
   */
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

        // Store the credentials for subsequent validation steps
        this.currentConfig.credentials = { token };

        figma.ui.postMessage({
          type: 'token-validation-result',
          success: true,
          message: '✅ Token is valid and has required permissions',
          user: validation.user
        });
      } else {
        console.log('❌ Token validation failed:', validation.error);
        figma.ui.postMessage({
          type: 'token-validation-result',
          success: false,
          message: validation.error || 'Token validation failed'
        });
      }

    } catch (error) {
      console.error('❌ Token validation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Token validation failed';

      figma.ui.postMessage({
        type: 'token-validation-result',
        success: false,
        message: `Token validation failed: ${errorMessage}`
      });
    }
  }

  /**
   * Handle repository validation
   */
  private async handleRepositoryValidation(owner: string, name: string): Promise<void> {
    try {
      // Trim whitespace from inputs to prevent API errors
      const trimmedOwner = owner?.trim() || '';
      const trimmedName = name?.trim() || '';

      console.log('🔍 Validating repository access:', `${trimmedOwner}/${trimmedName}`);

      // Basic input validation
      if (!trimmedOwner || !trimmedName) {
        figma.ui.postMessage({
          type: 'repository-validation-result',
          success: false,
          message: 'Please provide both repository owner and name'
        });
        return;
      }

      // Check if we have credentials available for testing
      if (!this.currentConfig.credentials?.token) {
        figma.ui.postMessage({
          type: 'repository-validation-result',
          success: false,
          message: 'Please configure your GitHub token first before validating repository access'
        });
        return;
      }

      // Create a temporary client for validation
      const testClient = new GitHubClient(this.currentConfig.credentials);

      // Test repository access using trimmed values
      const testResult = await testClient.testConnection({ owner: trimmedOwner, name: trimmedName });

      if (testResult.success) {
        console.log('✅ Repository validation successful');

        // Update config with trimmed values
        if (!this.currentConfig.repository) {
          this.currentConfig.repository = { owner: '', name: '' };
        }
        this.currentConfig.repository.owner = trimmedOwner;
        this.currentConfig.repository.name = trimmedName;

        // Fetch available branches using direct API call
        try {
          console.log('🌿 Starting branch fetching...');
          const token = this.currentConfig.credentials.token;
          const url = `https://api.github.com/repos/${trimmedOwner}/${trimmedName}/branches`;

          console.log('🌿 Fetching branches from:', url);
          const response = await fetch(url, {
            headers: {
              'Authorization': `token ${token}`,
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'Figma-Design-System-Plugin/1.0'
            }
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch branches: ${response.statusText}`);
          }

          const branchData = await response.json();
          const branches = branchData.map((branch: any) => branch.name);
          console.log('🌿 Retrieved branches:', branches);

          figma.ui.postMessage({
            type: 'repository-validation-result',
            success: true,
            message: `✅ Repository access confirmed`,
            permissions: testResult.permissions,
            branches: branches
          });
        } catch (branchError) {
          // If branch fetching fails, still show success but without branch dropdown
          console.warn('⚠️ Could not fetch branches:', branchError);
          console.error('🌿 Branch fetch error details:', branchError);
          figma.ui.postMessage({
            type: 'repository-validation-result',
            success: true,
            message: `✅ Repository access confirmed`,
            permissions: testResult.permissions
          });
        }
      } else {
        console.log('❌ Repository validation failed:', testResult.error);

        // Create detailed error message with fixes
        let errorMessage = '';
        if (testResult.error && testResult.error.toLowerCase().includes('not found')) {
          errorMessage = `
            ❌ Repository not found or you don't have access to it.
            <br><br>
            <strong>Common fixes:</strong><br>
            • Check the repository owner and name are correct<br>
            • Verify your GitHub token has 'repo' scope<br>
            • Ensure the repository isn't private (or use 'repo' scope instead of 'public_repo')
            <br><br>
            <button class="btn btn-secondary" onclick="validateRepository()" style="margin-top: 8px;">
              Validate Again
            </button>
          `;
        } else {
          errorMessage = testResult.error || 'Repository validation failed';
        }

        figma.ui.postMessage({
          type: 'repository-validation-result',
          success: false,
          message: errorMessage
        });
      }

    } catch (error) {
      console.error('❌ Repository validation error:', error);
      const baseErrorMessage = error instanceof Error ? error.message : 'Repository validation failed';

      let errorMessage = '';
      if (baseErrorMessage.toLowerCase().includes('not found') || baseErrorMessage.toLowerCase().includes('404')) {
        errorMessage = `
          ❌ Repository not found or you don't have access to it.
          <br><br>
          <strong>Common fixes:</strong><br>
          • Check the repository owner and name are correct<br>
          • Verify your GitHub token has 'repo' scope<br>
          • Ensure the repository isn't private (or use 'repo' scope instead of 'public_repo')
          <br><br>
          <button class="btn btn-secondary" onclick="validateRepository()" style="margin-top: 8px;">
            Validate Again
          </button>
        `;
      } else {
        errorMessage = `Validation failed: ${baseErrorMessage}`;
      }

      figma.ui.postMessage({
        type: 'repository-validation-result',
        success: false,
        message: errorMessage
      });
    }
  }

  /**
   * Validate complete configuration
   */
  private isConfigurationValid(): boolean {
    const config = this.currentConfig;

    return !!(
      config.credentials?.token &&
      config.repository?.owner &&
      config.repository?.name &&
      config.repository?.branch
    );
  }
}