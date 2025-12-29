import {
  generateDesignSystemCSS,
  createButton,
  createCard,
  createMetricCard,
  createStatusBadge,
  createIconWithText,
  createSpinner,
  createProgressBar,
} from './html-utils';
import { PLUGIN_DIMENSIONS } from './tokens';

// Example of creating a complete landing page with the new design system
export function createLandingPageHTML(data: {
  tokenCount: number;
  fileSize: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Design System Distributor</title>
      <style>
        /* Design System CSS */
        ${generateDesignSystemCSS()}

        /* Custom page styles */
        body {
          margin: 0;
          padding: 24px;
          background: linear-gradient(135deg, #F7E3E3 0%, #DEE3FC 100%);
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "Roboto", "Helvetica Neue", Arial, sans-serif;
        }

        .container {
          max-width: 100%;
          margin: 0 auto;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 16px;
          margin: 24px 0;
        }

        .action-cards {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .action-card-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .action-card-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header with gradient background -->
        ${createCard(`
          <div class="ds-flex ds-items-center ds-gap-3 ds-m-4" style="margin-bottom: 16px;">
            <i class="ph-rocket-launch" data-weight="duotone" style="font-size: 48px; color: #000000;"></i>
            <h1 class="ds-h1" style="margin: 0; color: #000000;">Design Tokens Extracted!</h1>
          </div>
          <p class="ds-body" style="color: #525252; margin: 0;">
            Choose how you'd like to export your design tokens
          </p>
        `, { gradient: 'lavenderLight' })}

        <!-- Metrics row -->
        <div class="metrics-grid">
          ${createMetricCard(data.tokenCount.toLocaleString(), 'Total Tokens', 'lavenderMedium')}
          ${createMetricCard(data.fileSize, 'File Size', 'blushLight')}
        </div>

        <!-- Action cards -->
        <div class="action-cards">
          ${createCard(`
            <div class="action-card-content">
              <div class="action-card-info">
                <div class="ds-icon-with-text">
                  <i class="ph-link" data-weight="bold"></i>
                  <span class="ds-body">Push to GitHub</span>
                </div>
                <p class="ds-body-small" style="color: #525252; margin: 0;">
                  Push tokens directly to your GitHub repository with automated commits
                </p>
              </div>
              ${createStatusBadge('Ready', 'success')}
            </div>
          `)}

          ${createCard(`
            <div class="action-card-content">
              <div class="action-card-info">
                <div class="ds-icon-with-text">
                  <i class="ph-download-simple" data-weight="bold"></i>
                  <span class="ds-body">Download JSON File</span>
                </div>
                <p class="ds-body-small" style="color: #525252; margin: 0;">
                  Download tokens as JSON file for manual processing or integration
                </p>
              </div>
              ${createStatusBadge('Always Available', 'info')}
            </div>
          `)}
        </div>

        <!-- Action buttons -->
        <div style="display: flex; gap: 12px; margin-top: 24px;">
          ${createButton('Push to GitHub', 'primary', { id: 'pushToGitHub' })}
          ${createButton('Download JSON', 'secondary', { id: 'downloadJson' })}
        </div>
      </div>

      <script>
        // Example event handlers
        document.getElementById('pushToGitHub')?.addEventListener('click', () => {
          // Send message to plugin main thread
          parent.postMessage({ pluginMessage: { type: 'push-to-github' } }, '*');
        });

        document.getElementById('downloadJson')?.addEventListener('click', () => {
          // Send message to plugin main thread
          parent.postMessage({ pluginMessage: { type: 'download-json' } }, '*');
        });
      </script>
    </body>
    </html>
  `;
}

// Example loading screen with new design system
export function createLoadingScreenHTML(): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        ${generateDesignSystemCSS()}

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "Roboto", "Helvetica Neue", Arial, sans-serif;
          background: linear-gradient(135deg, #F7E3E3 0%, #DEE3FC 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          overflow: hidden;
          padding: 24px;
        }

        .loading-container {
          text-align: center;
          color: #404040;
          padding: 32px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          max-width: 400px;
          width: 100%;
        }

        .logo {
          font-size: 64px;
          margin-bottom: 24px;
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .progress-container {
          width: 240px;
          margin: 20px auto;
        }
      </style>
    </head>
    <body>
      <div class="loading-container">
        <div class="logo"><i class="ph-palette" data-weight="duotone"></i></div>
        <h2 class="ds-h2" style="margin-bottom: 8px; color: #000000;">Design System Distributor</h2>
        <p class="ds-body" style="color: #525252; margin-bottom: 24px;">Loading your design tokens...</p>
        ${createSpinner()}
        <div class="progress-container">
          ${createProgressBar()}
        </div>
      </div>
    </body>
    </html>
  `;
}

// Helper to create a window with the new design system
export function showDesignSystemUI(htmlContent: string, title?: string): void {
  figma.showUI(htmlContent, {
    width: PLUGIN_DIMENSIONS.DEFAULT_WIDTH,
    height: PLUGIN_DIMENSIONS.DEFAULT_HEIGHT,
    themeColors: true,
    ...(title && { title })
  });
}