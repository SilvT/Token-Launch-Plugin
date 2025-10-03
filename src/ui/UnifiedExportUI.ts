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
import { SecureStorage } from '../storage/SecureStorage';

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
            background: linear-gradient(135deg, #f9a8d4 0%, #d8b4fe 100%);
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
            background: linear-gradient(135deg, #f9a8d4 0%, #d8b4fe 100%);
            color: #4a1d5c;
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
           color: #510081;
    border-bottom: 2px solid #510081;
    background: rgb(190 24 184 / 5%);
          }

          .tab:hover:not(.active) {
            background: rgba(0,0,0,0.05);
          }

          .tab-content {
            padding: 24px;
            min-height: 200px;
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
            border-color: #510081;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgb(190 24 189 / 15%);
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
            gap: 8px;
          }

          .setup-step {
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 10px;
          }

          .setup-step.completed {
            border-color: #28a745;
            background: rgba(40, 167, 69, 0.05);
          }

          .step-header {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            cursor: pointer;
            padding: 4px;
            margin: -4px -4px 4px -4px;
            border-radius: 6px;
            transition: background 0.2s;
          }

          .step-header:hover {
            background: rgba(0, 0, 0, 0.02);
          }

          .step-header-arrow {
            margin-left: auto;
            font-size: 18px;
            transition: transform 0.3s;
            color: #666;
          }

          .step-header-arrow.collapsed {
            transform: rotate(-90deg);
          }

          .step-number {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #d7adf0;
            color: black;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
            margin-right: 12px;
          }

          .step-number.completed {
            background: #d4edda;
          }

          .step-title {
            font-size: 16px;
            font-weight: 600;
            color: #333;
          }

          .step-content {
            margin-left: 36px;
            max-height: 2000px;
            overflow: hidden;
            transition: max-height 0.3s ease, opacity 0.3s ease;
            opacity: 1;
          }

          .step-content.collapsed {
            max-height: 0;
            opacity: 0;
            margin-bottom: 0;
          }

          .form-group {
            margin-bottom: 10px;
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
            border-color: #d7adf0;
          }

          .form-input.validating {
            border-color: #ffc107;
            background: #fffbf0;
          }

          .form-input.valid {
            border-color: #28a745;
            background: #f0fff4;
          }

          .form-input.invalid {
            border-color: #dc3545;
            background: #fff5f5;
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
            background: #d7adf0;
            color: #510081;
          }

          .btn-primary:hover {
            background: #9d174d;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(190, 24, 93, 0.3);
            color:white;
          }

          .btn-secondary {
            background: #6c757d;
            color: white;
          }

          .btn-secondary:hover {
            background: #212426;
          }

          .btn-success {
            background: #a855f7;
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
            border: 0px solid #c3e6cb;
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
            background: #fff ;
            border-top: 0px solid #e9ecef;
            text-align: center;
          }

          .hidden {
            display: none !important;
          }

          /* Security Guidance Styles */
          .security-guidance {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            margin-top: 32px;
            margin-bottom: 16px;
            overflow: hidden;
          }

          .guidance-toggle {
            width: 100%;
            padding: 16px;
            background: none;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            font-weight: 600;
            color: #333;
            transition: background 0.2s;
          }

          .guidance-toggle:hover {
            background: rgba(0, 0, 0, 0.02);
          }

          .guidance-toggle-icon {
            font-size: 18px;
            transition: transform 0.3s;
          }

          .guidance-toggle-icon.expanded {
            transform: rotate(180deg);
          }

          .guidance-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
          }

          .guidance-content.expanded {
            max-height: 2000px;
          }

          .guidance-inner {
            padding: 0 16px 16px 16px;
          }

          .info-box {
            background: linear-gradient(135deg, #e3f2fd 0%, #f0f9ff 100%);
            border: 1px solid #90caf9;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
          }

          .info-box-title {
            font-weight: 600;
            font-size: 14px;
            color: #1565c0;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
          }

          .info-box-title-icon {
            margin-right: 8px;
            font-size: 16px;
          }

          .info-box-content {
            font-size: 13px;
            line-height: 1.6;
            color: #37474f;
          }

          .info-box-content ul {
            margin: 8px 0;
            padding-left: 20px;
          }

          .info-box-content li {
            margin: 4px 0;
          }

          .security-box {
            background: linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%);
            border: 1px solid #81c784;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
          }

          .security-box-title {
            font-weight: 600;
            font-size: 14px;
            color: #2e7d32;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
          }

          .security-list {
            list-style: none;
            padding: 0;
            margin: 8px 0;
          }

          .security-list li {
            padding: 4px 0;
            font-size: 13px;
            color: #37474f;
          }

          .security-list li::before {
            content: '✓ ';
            color: #2e7d32;
            font-weight: bold;
            margin-right: 6px;
          }

          .warning-box {
            background: #fff8e1;
            border: 1px solid #ffb74d;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
          }

          .warning-box-title {
            font-weight: 600;
            font-size: 14px;
            color: #f57c00;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
          }

          .scope-list {
            list-style: none;
            padding: 0;
            margin: 8px 0;
          }

          .scope-list li {
            padding: 4px 0;
            font-size: 13px;
            color: #37474f;
          }

          .scope-required::before {
            content: '✓ ';
            color: #2e7d32;
            font-weight: bold;
            margin-right: 6px;
          }

          .scope-not-needed::before {
            content: '✗ ';
            color: #c62828;
            font-weight: bold;
            margin-right: 6px;
          }

          .external-link {
            color: #a000ff;
            text-decoration: none;
            font-weight: 500;
          }

          .external-link:hover {
            text-decoration: underline;
          }

          .btn-link {
            background: #510081;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            text-decoration: none;
            display: inline-block;
            font-size: 13px;
            margin-top: 8px;
            transition: background 0.2s;
          }

          .btn-link:hover {
            background: #9d174d;
          }

          .validation-auto-note {
            font-size: 11px;
            color: #666;
            font-style: italic;
            margin-top: 8px;
          }

          /* Learn More Tooltip Styles */
          .learn-more {
            color: #510081;
            text-decoration: underline;
            cursor: pointer;
            font-size: 12px;
            margin-left: 4px;
          }

          .learn-more:hover {
            color: #9d174d;
          }

          .tooltip-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            z-index: 9998;
            display: none;
            opacity: 0;
            transition: opacity 0.2s ease;
          }

          .tooltip-overlay.visible {
            display: block;
            opacity: 1;
          }

          .tooltip-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            max-width: 400px;
            width: 90%;
            max-height: 500px;
            overflow-y: auto;
            z-index: 9999;
            display: none;
            opacity: 0;
            transition: opacity 0.2s ease;
          }

          .tooltip-popup.visible {
            display: block;
            opacity: 1;
          }

          .tooltip-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            border-bottom: 1px solid #e5e7eb;
          }

          .tooltip-title {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin: 0;
          }

          .tooltip-close {
            background: none;
            border: none;
            font-size: 20px;
            color: #6b7280;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: background 0.2s;
          }

          .tooltip-close:hover {
            background: #f3f4f6;
            color: #111827;
          }

          .tooltip-content {
            padding: 16px;
            font-size: 13px;
            line-height: 1.6;
            color: #374151;
          }

          .tooltip-content p {
            margin: 0 0 12px 0;
          }

          .tooltip-content ul {
            margin: 8px 0;
            padding-left: 20px;
          }

          .tooltip-content li {
            margin: 4px 0;
          }

          .tooltip-content code {
            background: #f3f4f6;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 12px;
            font-family: monospace;
          }

          .tooltip-content strong {
            color: #111827;
          }

          .tooltip-link {
            display: inline-block;
            margin-top: 12px;
            padding: 8px 16px;
            background: #f9a8d4;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-size: 13px;
            transition: background 0.2s;
          }

          .tooltip-link:hover {
            background: #5a6fd8;
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
              ${isGitConfigured ? '✓ ' : ''}GitHub Setup
            </button>
          </div>

          <div class="tab-content">
            <!-- Export Options Tab -->
            <div id="export-tab" class="tab-panel active">
              <div class="export-options">
                <div id="github-export-option" class="export-option ${isGitConfigured ? '' : 'disabled'}" onclick="${isGitConfigured ? 'selectExport(\'git-push\')' : 'switchTab(\'github-setup\')'}">
                  <div class="option-header">
                    <div class="option-icon" style="background: #d4edda; color: white;">🚀</div>
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
                    <div class="option-icon" style="background:#d7adf0; color: white;">💾</div>
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
              ${this.isGitConfigured() ? this.renderConfiguredStatus() : ''}
              <div class="github-setup">
                ${this.renderGitHubSetupSteps()}
              </div>
            </div>
          </div>   
        </div>

        <!-- Token Guidance Tooltip -->
        <div class="tooltip-overlay" id="token-tooltip-overlay" onclick="hideTokenTooltip()"></div>
        <div class="tooltip-popup" id="token-tooltip">
          <div class="tooltip-header">
            <h3 class="tooltip-title">🔑 Creating Your GitHub Token</h3>
            <button class="tooltip-close" onclick="hideTokenTooltip()" aria-label="Close">×</button>
          </div>
          <div class="tooltip-content">
            <p><strong>Step-by-step:</strong></p>
            <p>Go to GitHub → Settings → Developer settings → Personal access tokens → Generate new token</p>

            <p><strong>Required permissions for this plugin:</strong></p>
            <ul>
              <li>✓ <code>repo</code> (for private repositories)<br><span style="margin-left: 20px; font-size: 12px; color: #666;">OR</span></li>
              <li>✓ <code>public_repo</code> (if only using public repositories)</li>
            </ul>

            <p><strong>NOT needed (leave unchecked):</strong></p>
            <ul>
              <li>✗ <code>admin:org</code></li>
              <li>✗ <code>delete_repo</code></li>
              <li>✗ <code>workflow</code></li>
              <li>✗ <code>admin:public_key</code></li>
              <li>✗ Any admin or delete permissions</li>
            </ul>

            <p><strong>Why minimal permissions?</strong></p>
            <p>This plugin only needs to READ your repository structure and WRITE token files. No admin access required.</p>

            <a href="https://github.com/settings/tokens/new" target="_blank" class="tooltip-link">
              Create Token on GitHub →
            </a>
          </div>
        </div>

        <!-- Security Info Tooltip -->
        <div class="tooltip-overlay" id="security-tooltip-overlay" onclick="hideSecurityTooltip()"></div>
        <div class="tooltip-popup" id="security-tooltip">
          <div class="tooltip-header">
            <h3 class="tooltip-title">🔒 How Your Credentials Are Stored</h3>
            <button class="tooltip-close" onclick="hideSecurityTooltip()" aria-label="Close">×</button>
          </div>
          <div class="tooltip-content">
            <p><strong>Your credentials are stored securely on your device:</strong></p>
            <ul>
              <li>✓ Encrypted automatically by Figma</li>
              <li>✓ Never sent to third-party servers</li>
              <li>✓ Only transmitted directly to GitHub's API</li>
              <li>✓ Not visible to other Figma users or plugin developers</li>
            </ul>

            <p style="margin-top: 16px;"><strong>What happens when you save credentials:</strong></p>
            <p>When the checkbox is <strong>checked</strong>, your GitHub token and repository details are encrypted and stored in Figma's secure local storage. This allows the plugin to remember your setup between sessions.</p>

            <p style="margin-top: 12px;">When <strong>unchecked</strong>, you'll need to re-enter your credentials each time you use the plugin.</p>

            <p style="margin-top: 16px; padding: 12px; background: #f0f9ff; border-radius: 6px; border-left: 3px solid #f9a8d4;">
              <strong>💡 Recommendation:</strong> Keep this checked for convenience. Your data is encrypted and only accessible to you within Figma.
            </p>
          </div>
        </div>

        <script>
          let currentConfig = ${JSON.stringify(this.gitConfig)};
          let validationStates = ${JSON.stringify(this.validationStates)};

          // Apply initial validation visual states for pre-filled fields
          document.addEventListener('DOMContentLoaded', function() {

            // Collapse validated accordions by default
            if (validationStates.token) {
              const tokenInput = document.getElementById('github-token');
              if (tokenInput && tokenInput.value) {
                tokenInput.className = 'form-input valid';
              }

              // Collapse token accordion if validated
              const tokenContent = document.getElementById('token-step-content');
              const tokenArrow = document.getElementById('token-step-arrow');
              if (tokenContent && tokenArrow) {
                tokenContent.classList.add('collapsed');
                tokenArrow.classList.add('collapsed');
              }
            }

            if (validationStates.repository) {
              const ownerInput = document.getElementById('repo-owner');
              const nameInput = document.getElementById('repo-name');
              if (ownerInput && ownerInput.value && nameInput && nameInput.value) {
                ownerInput.className = 'form-input valid';
                nameInput.className = 'form-input valid';
              }

              // Collapse repository accordion if validated
              const repoContent = document.getElementById('repository-step-content');
              const repoArrow = document.getElementById('repository-step-arrow');
              if (repoContent && repoArrow) {
                repoContent.classList.add('collapsed');
                repoArrow.classList.add('collapsed');
              }
            }

            // Always collapse paths accordion (optional settings)
            const pathsContent = document.getElementById('paths-step-content');
            const pathsArrow = document.getElementById('paths-step-arrow');
            if (pathsContent && pathsArrow) {
              pathsContent.classList.add('collapsed');
              pathsArrow.classList.add('collapsed');
            }
          });

          // Token tooltip functions
          function showTokenTooltip() {
            const overlay = document.getElementById('token-tooltip-overlay');
            const tooltip = document.getElementById('token-tooltip');

            if (overlay && tooltip) {
              overlay.classList.add('visible');
              tooltip.classList.add('visible');
            }
          }

          function hideTokenTooltip() {
            const overlay = document.getElementById('token-tooltip-overlay');
            const tooltip = document.getElementById('token-tooltip');

            if (overlay && tooltip) {
              overlay.classList.remove('visible');
              tooltip.classList.remove('visible');
            }
          }

          // Make functions globally accessible
          window.showTokenTooltip = showTokenTooltip;
          window.hideTokenTooltip = hideTokenTooltip;

          // Security tooltip functions
          function showSecurityTooltip() {
            const overlay = document.getElementById('security-tooltip-overlay');
            const tooltip = document.getElementById('security-tooltip');

            if (overlay && tooltip) {
              overlay.classList.add('visible');
              tooltip.classList.add('visible');
            }
          }

          function hideSecurityTooltip() {
            const overlay = document.getElementById('security-tooltip-overlay');
            const tooltip = document.getElementById('security-tooltip');

            if (overlay && tooltip) {
              overlay.classList.remove('visible');
              tooltip.classList.remove('visible');
            }
          }

          // Make functions globally accessible
          window.showSecurityTooltip = showSecurityTooltip;
          window.hideSecurityTooltip = hideSecurityTooltip;

          // Toggle accordion step
          function toggleStep(stepId) {
            console.log('🔧 toggleStep() called for:', stepId);
            const content = document.getElementById(stepId + '-content');
            const arrow = document.getElementById(stepId + '-arrow');

            if (content && arrow) {
              const isCollapsed = content.classList.contains('collapsed');
              console.log('🔧 Current state:', isCollapsed ? 'collapsed' : 'expanded');

              if (isCollapsed) {
                console.log('🔧 Expanding step...');
                content.classList.remove('collapsed');
                arrow.classList.remove('collapsed');
              } else {
                console.log('🔧 Collapsing step...');
                content.classList.add('collapsed');
                arrow.classList.add('collapsed');
              }
            } else {
              console.error('🔧 ERROR: Could not find step elements for', stepId);
            }
          }

          // Make function globally accessible
          window.toggleStep = toggleStep;

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
            const tokenInput = document.getElementById('github-token');
            const token = tokenInput.value;
            if (!token) return;

            // Show validating state
            tokenInput.className = 'form-input validating';

            const statusDiv = document.getElementById('token-validation');
            statusDiv.style.display = 'block';
            statusDiv.className = 'validation-status validation-loading';
            statusDiv.textContent = '🔄 Validating token...';

            parent.postMessage({
              pluginMessage: { type: 'validate-token', token }
            }, '*');
          }

          function validateRepository() {
            const ownerInput = document.getElementById('repo-owner');
            const nameInput = document.getElementById('repo-name');
            const branchInput = document.getElementById('repo-branch');
            const owner = ownerInput.value.trim();
            const name = nameInput.value.trim();
            const branch = branchInput.value.trim() || 'main';

            if (!owner || !name) return;

            // Show validating state
            ownerInput.className = 'form-input validating';
            nameInput.className = 'form-input validating';
            branchInput.className = 'form-input validating';

            const statusDiv = document.getElementById('repo-validation');
            statusDiv.style.display = 'block';
            statusDiv.className = 'validation-status validation-loading';
            statusDiv.textContent = '🔄 Validating repository and branch access...';

            parent.postMessage({
              pluginMessage: { type: 'validate-repository', owner, name, branch }
            }, '*');
          }

          function completeSetup() {
            if (!validationStates.token || !validationStates.repository) {
              alert('Please complete token and repository validation first');
              return;
            }

            // Check if user wants to save credentials
            const saveCheckbox = document.getElementById('save-credentials-checkbox');
            const shouldSave = saveCheckbox ? saveCheckbox.checked : true;

            // Collect all form values before saving
            updateConfig('credentials.token', document.getElementById('github-token').value);
            updateConfig('repository.owner', document.getElementById('repo-owner').value);
            updateConfig('repository.name', document.getElementById('repo-name').value);
            updateConfig('repository.branch', document.getElementById('repo-branch').value || 'main');
            updateConfig('paths.rawTokens', document.getElementById('raw-tokens-path').value || 'tokens/raw/');
            updateConfig('commitMessage', document.getElementById('commit-message').value || 'feat: update design tokens from Figma - {{timestamp}}');

            parent.postMessage({
              pluginMessage: {
                type: 'complete-setup',
                config: currentConfig,
                saveCredentials: shouldSave
              }
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
                const tokenInput = document.getElementById('github-token');
                const statusDiv = document.getElementById('token-validation');

                // Update input visual state
                if (tokenInput) {
                  tokenInput.className = 'form-input ' + (msg.success ? 'valid' : 'invalid');
                }

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
                const ownerInput = document.getElementById('repo-owner');
                const nameInput = document.getElementById('repo-name');
                const branchInput = document.getElementById('repo-branch');
                const statusDiv = document.getElementById('repo-validation');

                // Update input visual states
                if (ownerInput && nameInput && branchInput) {
                  const stateClass = msg.success ? 'valid' : 'invalid';
                  ownerInput.className = 'form-input ' + stateClass;
                  nameInput.className = 'form-input ' + stateClass;
                  branchInput.className = 'form-input ' + stateClass;
                }

                if (statusDiv) {
                  statusDiv.style.display = 'block';
                  statusDiv.className = 'validation-status ' + (msg.success ? 'validation-success' : 'validation-error');

                  // Handle branch not found case with helpful link
                  if (msg.branchNotFound && msg.owner && msg.name && msg.branch) {
                    const branchesUrl = \`https://github.com/\${msg.owner}/\${msg.name}/branches\`;
                    statusDiv.innerHTML = \`\${msg.message}<br><a href="\${branchesUrl}" target="_blank" class="external-link" style="font-size: 12px; margin-top: 8px; display: inline-block;">Go to repository branches to create '\${msg.branch}' →</a>\`;
                  } else {
                    statusDiv.textContent = msg.message;
                  }

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

                  // Update configured status card if validation successful
                  if (msg.success && msg.owner && msg.name && msg.branch) {
                    updateConfiguredStatusCard(msg.owner, msg.name, msg.branch);
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

          function updateConfiguredStatusCard(owner, name, branch) {
            // Update the repository and branch info in the configured status card
            const repoInfoDiv = document.querySelector('[style*="Repository"]')?.parentElement;
            if (repoInfoDiv) {
              const repoPath = \`\${owner}/\${name}\`;
              repoInfoDiv.innerHTML = \`
                <div style="font-size: 13px; color: #155724; margin-bottom: 6px;">
                  <strong>📁 Repository:</strong> \${repoPath}
                </div>
                <div style="font-size: 13px; color: #155724;">
                  <strong>🌿 Branch:</strong> \${branch}
                </div>
              \`;
            }
          }

          function resetSetup() {
            if (!confirm('Are you sure you want to reset? This will clear all inputs and saved credentials.')) {
              return;
            }

            // Clear all input fields
            document.getElementById('github-token').value = '';
            document.getElementById('repo-owner').value = '';
            document.getElementById('repo-name').value = '';
            document.getElementById('repo-branch').value = 'main';
            document.getElementById('raw-tokens-path').value = 'tokens/raw/';
            document.getElementById('commit-message').value = 'feat: update design tokens from Figma - {{timestamp}}';

            // Clear validation states
            validationStates.token = false;
            validationStates.repository = false;

            // Reset input visual states
            const inputs = document.querySelectorAll('.form-input');
            inputs.forEach(input => input.className = 'form-input');

            // Hide validation status divs
            const statusDivs = document.querySelectorAll('.validation-status');
            statusDivs.forEach(div => div.style.display = 'none');

            // Reset step completion states
            updateStepCompletion('token-step', false);
            updateStepCompletion('repository-step', false);

            // Reset Complete Setup button
            const completeButton = document.querySelector('button[onclick="completeSetup()"]');
            if (completeButton) {
              completeButton.disabled = true;
            }

            // Hide "GitHub Already Configured" status card
            const configuredCard = document.getElementById('github-configured-card');
            if (configuredCard) {
              configuredCard.style.display = 'none';
            }

            // Clear storage
            parent.postMessage({
              pluginMessage: { type: 'clear-storage' }
            }, '*');

            updateExportOption();
          }

          window.resetSetup = resetSetup;

          // Auto-save form changes and trigger validation
          let tokenValidationTimer = null;
          let repoValidationTimer = null;

          document.addEventListener('input', function(e) {
            if (e.target.classList.contains('form-input')) {
              updateConfig(e.target.dataset.field, e.target.value);

              // Auto-validate token after user stops typing (debounced)
              if (e.target.id === 'github-token') {
                const tokenInput = e.target;
                const statusDiv = document.getElementById('token-validation');

                // Reset validation state when user modifies input
                tokenInput.className = 'form-input';
                if (statusDiv) {
                  statusDiv.style.display = 'none';
                }
                validationStates.token = false;
                updateStepCompletion('token-step', false);
                updateExportOption();

                clearTimeout(tokenValidationTimer);
                tokenValidationTimer = setTimeout(() => {
                  const token = e.target.value.trim();
                  if (token.length > 0) {
                    validateToken();
                  }
                }, 1000); // Wait 1 second after user stops typing
              }

              // Auto-validate repository after owner, name, or branch are filled
              if (e.target.id === 'repo-owner' || e.target.id === 'repo-name' || e.target.id === 'repo-branch') {
                const ownerInput = document.getElementById('repo-owner');
                const nameInput = document.getElementById('repo-name');
                const branchInput = document.getElementById('repo-branch');
                const statusDiv = document.getElementById('repo-validation');

                // Reset validation state when user modifies input
                ownerInput.className = 'form-input';
                nameInput.className = 'form-input';
                branchInput.className = 'form-input';
                if (statusDiv) {
                  statusDiv.style.display = 'none';
                }
                validationStates.repository = false;
                updateStepCompletion('repository-step', false);
                updateExportOption();

                clearTimeout(repoValidationTimer);
                repoValidationTimer = setTimeout(() => {
                  const owner = ownerInput.value.trim();
                  const name = nameInput.value.trim();
                  if (owner.length > 0 && name.length > 0) {
                    validateRepository();
                  }
                }, 1000); // Wait 1 second after user stops typing
              }
            }
          });
        </script>
      </body>
      </html>
    `;

    figma.showUI(htmlContent, {
      width: 640,
      height: 800,
      themeColors: true
    });
  }

  private renderSecurityGuidance(): string {
    return `
      <div class="security-guidance">
        <button class="guidance-toggle" onclick="toggleGuidance()">
          <span>ℹ️ Need help creating a GitHub token?</span>
          <span class="guidance-toggle-icon" id="guidance-icon">▼</span>
        </button>

        <div class="guidance-content" id="guidance-content">
          <div class="guidance-inner">

            <!-- Token Scope Guidance -->
            <div class="info-box">
              <div class="info-box-title">
                <span class="info-box-title-icon">🔑</span>
                Creating Your GitHub Token
              </div>
              <div class="info-box-content">
                <p><strong>Step-by-step:</strong></p>
                <p style="margin: 8px 0;">Go to GitHub → Settings → Developer settings → Personal access tokens → Generate new token</p>

                <p style="margin-top: 16px;"><strong>Required permissions for this plugin:</strong></p>
                <ul class="scope-list" style="margin: 8px 0;">
                  <li class="scope-required"><code>repo</code> (for private repositories)</li>
                  <li style="margin-left: 20px; font-size: 12px; color: #666; list-style: none;">OR</li>
                  <li class="scope-required"><code>public_repo</code> (if only using public repositories)</li>
                </ul>

                <p style="margin-top: 16px;"><strong>NOT needed (leave unchecked):</strong></p>
                <ul class="scope-list" style="margin: 8px 0;">
                  <li class="scope-not-needed"><code>admin:org</code></li>
                  <li class="scope-not-needed"><code>delete_repo</code></li>
                  <li class="scope-not-needed"><code>workflow</code></li>
                  <li class="scope-not-needed"><code>admin:public_key</code></li>
                  <li class="scope-not-needed">Any admin or delete permissions</li>
                </ul>

                <p style="margin-top: 16px; padding: 12px; background: rgba(249, 168, 212, 0.08); border-radius: 6px; font-size: 13px; line-height: 1.5;">
                  This plugin only needs to READ your repository structure and WRITE token files. No admin access required.
                </p>

                <a href="https://github.com/settings/tokens/new" target="_blank" class="btn-link">
                  Create Token on GitHub →
                </a>
              </div>
            </div>

            <!-- Security & Storage Information -->
            <div class="security-box">
              <div class="security-box-title">
                <span class="info-box-title-icon">🔒</span>
                Your credentials are stored securely on your device
              </div>
              <ul class="security-list">
                <li>Encrypted automatically by Figma</li>
                <li>Never sent to third-party servers</li>
                <li>Only transmitted directly to GitHub's API</li>
                <li>Not visible to other Figma users or plugin developers</li>
              </ul>
            </div>

            <!-- Token Expiration Recommendations -->
            <div class="warning-box">
              <div class="warning-box-title">
                <span class="info-box-title-icon">⏰</span>
                Token Security Best Practices
              </div>
              <div class="info-box-content">
                <p><strong>Set expiration: 90 days (recommended) or 1 year maximum</strong></p>
                <p style="margin-top: 8px;">Why? Regular rotation limits risk if a token is compromised.</p>
                <p style="margin-top: 8px;">You can always regenerate - we'll prompt you to update if your token stops working.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;
  }

  private renderConfiguredStatus(): string {
    const repo = this.gitConfig.repository;
    const repoPath = repo ? `${repo.owner}/${repo.name}` : 'Unknown';
    const branch = repo?.branch || 'main';

    return `
      <div class="gitConfigured" style="background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 2px solid #28a745;">
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <div style="font-size: 20px; margin-right: 12px;">✅</div>
          <div>
            <h3 style="margin: 0; color: #155724; font-size: 16px;">GitHub Configured</h3>

          </div>
        </div>
        <div style="display:none; background: rgba(255, 255, 255, 0.7); padding: 12px; border-radius: 8px; margin-top: 12px;">
          <div style="font-size: 13px; color: #155724; margin-bottom: 6px;">
            <strong>📁 Repository:</strong> ${repoPath}
          </div>
          <div style="font-size: 13px; color: #155724;">
            <strong>🌿 Branch:</strong> ${branch}
          </div>
        </div>
        <p style="margin: 12px 0 0 0; font-size: 12px; color: #155724; opacity: 0.8;">
          You can update your configuration below if needed
        </p>
      </div>
    `;
  }

  private renderGitHubSetupSteps(): string {
    const token = this.gitConfig.credentials?.token || '';
    const repo = this.gitConfig.repository || { owner: '', name: '', branch: 'main' };
    const paths = this.gitConfig.paths || { rawTokens: 'tokens/raw/', processedTokens: 'tokens/processed/' };

    return `
      <div id="token-step" class="setup-step ${this.validationStates.token ? 'completed' : ''}">
        <div class="step-header" onclick="toggleStep('token-step')">
          <div class="step-number ${this.validationStates.token ? 'completed' : ''}" data-number="1">
            ${this.validationStates.token ? '✓' : '1'}
          </div>
          <div class="step-title">GitHub Personal Access Token</div>
          <span class="step-header-arrow" id="token-step-arrow">▼</span>
        </div>
        <div class="step-content" id="token-step-content">
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
              with 'repo' scope.
              <span class="learn-more" onclick="showTokenTooltip()">Learn more</span>
            </div>
          </div>
          <div class="validation-auto-note">
            ✨ Validates automatically 1 second after you finish typing
            <button class="btn btn-secondary" onclick="validateToken()" style="margin-left: 12px; padding: 6px 12px; font-size: 12px;">
              Validate Now
            </button>
          </div>
          <div id="token-validation" class="validation-status" style="display: none;"></div>
        </div>
      </div>

      <div id="repository-step" class="setup-step ${this.validationStates.repository ? 'completed' : ''}">
        <div class="step-header" onclick="toggleStep('repository-step')">
          <div class="step-number ${this.validationStates.repository ? 'completed' : ''}" data-number="2">
            ${this.validationStates.repository ? '✓' : '2'}
          </div>
          <div class="step-title">Repository Configuration</div>
          <span class="step-header-arrow" id="repository-step-arrow">▼</span>
        </div>
        <div class="step-content" id="repository-step-content">
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

          <div class="validation-auto-note">
            ✨ Validates automatically 1 second after you finish typing
            <button class="btn btn-secondary" onclick="validateRepository()" style="margin-left: 12px; padding: 6px 12px; font-size: 12px;">
              Validate Now
            </button>
          </div>
          <div id="repo-validation" class="validation-status" style="display: none;"></div>
        </div>
      </div>

      <div id="paths-step" class="setup-step">
        <div class="step-header" onclick="toggleStep('paths-step')">
          <div class="step-number" data-number="3">3</div>
          <div class="step-title">File Paths & Settings</div>
          <span class="step-header-arrow" id="paths-step-arrow">▼</span>
        </div>
        <div class="step-content" id="paths-step-content">
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
        </div>
      </div>

      <!-- Save Credentials Checkbox -->
      <div style="margin-top: 8px; padding: 8px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
        <label style="display: flex; align-items: center; cursor: pointer; font-size: 13px;">
          <input
            type="checkbox"
            id="save-credentials-checkbox"
            checked
            style="width: 16px; height: 16px; margin-right: 8px; cursor: pointer;"
          >
          <span>Save credentials between sessions</span>
          <span class="learn-more" onclick="showSecurityTooltip()" style="margin-left: 6px;">Learn more</span>
        </label>
        <div class="form-help" style="margin-top: 4px; margin-left: 24px;">
          When checked, your credentials are encrypted and stored locally by Figma
        </div>
      </div>

      <div class="setup-actions" style="margin-top: 10px; text-align: center;">
      <div class="form-help" style="margin-top: 4px; display:flex; flex-direction:column; margin-bottom: 4px; align-items:center;">
        ${this.validationStates.token && this.validationStates.repository ?
          'Configuration is ready to be saved' :
          'Complete token and repository validation first'
        }
        </div>
       <div class="action-buttons" style="display:flex; justify-content:center; gap:16px; align-items:flex-end;" > 
       <button class="btn btn-secondary" style="height:fit-content;" onclick="resetSetup()">
      Reset
    </button>
       <button class="btn btn-primary" style="width:fit-content; margin-top:4px;" onclick="completeSetup()" ${this.validationStates.token && this.validationStates.repository ? '' : 'disabled'}>
          Complete Setup
        </button>
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
          await this.handleRepositoryValidation(msg.owner, msg.name, msg.branch);
          break;
        case 'complete-setup':
          await this.handleCompleteSetup(msg.config, msg.saveCredentials);
          break;
        case 'clear-storage':
          await this.handleClearStorage();
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

  private async handleRepositoryValidation(owner: string, name: string, branch?: string): Promise<void> {
    try {
      const branchToValidate = branch || 'main';
      console.log('🔍 Validating repository access:', `${owner}/${name}`, `branch: ${branchToValidate}`);

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

      if (!testResult.success) {
        console.log('❌ Repository validation failed:', testResult.error);
        this.validationStates.repository = false;
        figma.ui.postMessage({
          type: 'repository-validation-result',
          success: false,
          message: testResult.error || 'Repository validation failed',
          owner,
          name
        });
        return;
      }

      // Repository exists, now validate branch
      console.log('✅ Repository access confirmed, validating branch...');

      try {
        // Try to get branch info from GitHub API
        const branchCheckUrl = `https://api.github.com/repos/${owner}/${name}/branches/${branchToValidate}`;
        const response = await fetch(branchCheckUrl, {
          headers: {
            'Authorization': `token ${this.gitConfig.credentials.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Figma-Design-System-Distributor'
          }
        });

        if (response.ok) {
          // Branch exists
          console.log('✅ Branch validation successful');

          // Store the repository config with branch
          if (!this.gitConfig.repository) this.gitConfig.repository = { owner: '', name: '', branch: 'main' };
          this.gitConfig.repository.owner = owner;
          this.gitConfig.repository.name = name;
          this.gitConfig.repository.branch = branchToValidate;
          this.validationStates.repository = true;

          figma.ui.postMessage({
            type: 'repository-validation-result',
            success: true,
            message: `✅ Repository and branch '${branchToValidate}' access confirmed`,
            permissions: testResult.permissions,
            owner,
            name,
            branch: branchToValidate
          });
        } else if (response.status === 404) {
          // Branch doesn't exist
          console.log(`⚠️ Branch '${branchToValidate}' not found`);
          this.validationStates.repository = false;

          figma.ui.postMessage({
            type: 'repository-validation-result',
            success: false,
            message: `⚠️ Branch '${branchToValidate}' doesn't exist in this repository`,
            branchNotFound: true,
            owner,
            name,
            branch: branchToValidate
          });
        } else {
          throw new Error(`Branch validation failed: ${response.status} ${response.statusText}`);
        }
      } catch (branchError) {
        console.error('❌ Branch validation error:', branchError);
        this.validationStates.repository = false;
        figma.ui.postMessage({
          type: 'repository-validation-result',
          success: false,
          message: `Branch validation failed: ${branchError instanceof Error ? branchError.message : 'Unknown error'}`,
          owner,
          name,
          branch: branchToValidate
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
   * Handle clearing storage - reset all credentials and config
   */
  private async handleClearStorage(): Promise<void> {
    try {
      console.log('🗑️ Clearing all stored data...');

      await SecureStorage.clearAll();

      // Reset internal state
      this.gitConfig = {
        credentials: { token: '', username: '' },
        repository: { owner: '', name: '', branch: 'main' },
        paths: { rawTokens: 'tokens/raw/', processedTokens: 'tokens/processed/' },
        commitMessage: 'feat: update design tokens from Figma - {{timestamp}}'
      };

      this.validationStates = {
        token: false,
        repository: false
      };

      console.log('✅ Storage cleared successfully');
      figma.notify('✅ Setup reset successfully');

    } catch (error) {
      console.error('❌ Error clearing storage:', error);
      figma.notify('⚠️ Error resetting setup', { error: true });
    }
  }

  /**
   * Handle setup completion - save configuration and enable GitHub push
   */
  private async handleCompleteSetup(config: GitHubConfig, saveCredentials: boolean = true): Promise<void> {
    try {
      console.log('🎯 Completing GitHub setup with config:', config);
      console.log('🔐 Save credentials:', saveCredentials);

      // Update internal configuration
      this.gitConfig = { ...config };

      // Save or clear credentials based on user preference
      if (saveCredentials) {
        console.log('💾 Saving to SecureStorage...');

        if (config.credentials) {
          await SecureStorage.storeCredentials(config.credentials);
          console.log('✅ Credentials saved to storage');
        }

        await SecureStorage.storeConfig(config);
        console.log('✅ Config saved to storage');
      } else {
        console.log('🗑️ Clearing stored credentials (user chose not to save)...');

        // Clear any existing stored credentials
        await SecureStorage.clearAll();
        console.log('✅ Credentials cleared from storage');
      }

      // Verify storage
      const storedConfig = await SecureStorage.getCompleteConfig();
      console.log('🔍 Verification - Stored config:', {
        hasCredentials: !!storedConfig?.credentials?.token,
        hasRepository: !!storedConfig?.repository,
        tokenPreview: storedConfig?.credentials?.token?.substring(0, 10) + '...'
      });

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