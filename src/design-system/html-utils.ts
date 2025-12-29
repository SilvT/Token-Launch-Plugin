import { COLORS, SPACING, GRADIENTS, TRANSITIONS } from './tokens';
import { getTypographyStyles } from './typography';
import { ANIMATIONS_CSS } from './animations';
import { getPhosphorIconsCDN, createPhosphorIcon, ICONS } from './icons';

// =============================================================================
// CSS UTILITIES
// =============================================================================

// Generate complete HTML head with design system CSS and phosphor icons
export const generateDesignSystemHead = (): string => {
  return `
    <meta charset="utf-8">
    ${getPhosphorIconsCDN()}
    <style>${generateDesignSystemCSS()}</style>
  `;
};

// Generate complete CSS for the design system
export const generateDesignSystemCSS = (): string => {
  return `
    ${ANIMATIONS_CSS}

    /* Design System Base Styles */
    * {
      box-sizing: border-box;
    }

    .ds-btn {
      border: none;
      border-radius: 8px;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      cursor: pointer;
      transition: all 150ms ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .ds-btn-primary {
      background-color: ${COLORS.lavender[300]};
      color: ${COLORS.neutral[900]};
      font-weight: 600;
    }

    .ds-btn-primary:hover:not(:disabled) {
      background-color: #7C2D92;
      color: ${COLORS.white};
    }

    .ds-btn-primary:active:not(:disabled) {
      transform: scale(0.98);
    }

    .ds-btn-secondary {
      background-color: ${COLORS.white};
      color: ${COLORS.black};
      border: 2px solid ${COLORS.black};
    }

    .ds-btn-secondary:hover:not(:disabled) {
      background-color: ${COLORS.grey[50]};
    }

    .ds-btn-tertiary {
      background-color: ${COLORS.lavender[400]};
      color: ${COLORS.neutral[900]};
      padding: 8px 16px;
      border: none;
    }

    .ds-btn-tertiary:hover:not(:disabled) {
      background-color: ${COLORS.lavender[300]};
    }

    .ds-btn-tertiary:active:not(:disabled) {
      background-color: ${COLORS.lavender[200]};
    }

    .ds-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .ds-card {
      background-color: ${COLORS.white};
      border-radius: 16px;
      padding: ${SPACING[6]};
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      transition: box-shadow 150ms ease, transform 150ms ease;
    }

    .ds-card:hover {
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      transform: translateY(-1px);
    }

    .ds-card-gradient {
      border-radius: 16px;
      padding: ${SPACING[6]};
    }

    .ds-card-gradient-lavender {
      background: ${GRADIENTS.lavenderMedium};
    }

    .ds-card-gradient-blush {
      background: ${GRADIENTS.blushLight};
    }

    .ds-card-gradient-periwinkle {
      background: ${GRADIENTS.lavenderLight};
    }

    .ds-card-gradient-peach {
      background: ${GRADIENTS.mintLight};
    }

    .ds-input {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "Roboto", "Helvetica Neue", Arial, sans-serif;
      font-size: 14px;
      line-height: 20px;
      padding: 12px 16px;
      border-radius: 8px;
      border: 2px solid ${COLORS.grey[200]};
      background-color: ${COLORS.white};
      color: ${COLORS.grey[900]};
      width: 100%;
      transition: border-color 150ms ease;
      outline: none;
    }

    .ds-input:focus {
      border-color: ${COLORS.primary[400]};
    }

    .ds-input.error {
      border-color: ${COLORS.state.error.border};
    }

    .ds-input:disabled {
      background-color: ${COLORS.grey[50]};
    }

    .ds-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 24px;
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
    }

    .ds-badge-success {
      background-color: ${COLORS.state.success.bg};
      color: ${COLORS.state.success.text};
      border: 1px solid ${COLORS.state.success.border};
    }

    .ds-badge-error {
      background-color: ${COLORS.state.error.bg};
      color: ${COLORS.state.error.text};
      border: 1px solid ${COLORS.state.error.border};
    }

    .ds-badge-warning {
      background-color: ${COLORS.state.warning.bg};
      color: ${COLORS.state.warning.text};
      border: 1px solid ${COLORS.state.warning.border};
    }

    .ds-badge-info {
      background-color: ${COLORS.state.info.bg};
      color: ${COLORS.state.info.text};
      border: 1px solid ${COLORS.state.info.border};
    }

    .ds-metric-card {
      background: ${COLORS.white};
      border-radius: 16px;
      padding: ${SPACING[6]};
      display: flex;
      flex-direction: column;
      gap: ${SPACING[1]};
      min-width: 120px;
    }

    .ds-metric-value {
      font-size: 36px;
      line-height: 40px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .ds-metric-label {
      font-size: 12px;
      line-height: 16px;
      font-weight: 400;
      letter-spacing: 0.01em;
      text-transform: uppercase;
      color: ${COLORS.grey[600]};
    }

    .ds-spinner {
      width: 24px;
      height: 24px;
      border: 3px solid ${COLORS.grey[200]};
      border-top: 3px solid ${COLORS.primary[400]};
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .ds-progress {
      width: 100%;
      height: 4px;
      background-color: ${COLORS.grey[200]};
      border-radius: 2px;
      overflow: hidden;
    }

    .ds-progress-bar {
      height: 100%;
      background-color: ${COLORS.primary[400]};
      border-radius: 2px;
      transition: width 300ms ease;
    }

    .ds-progress-bar-indeterminate {
      width: 30%;
      animation: loading 1.5s ease-in-out infinite;
    }

    .ds-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .ds-icon-with-text {
      display: flex;
      align-items: center;
      gap: ${SPACING[2]};
    }

    /* Typography Classes */
    .ds-h1 { font-size: 32px; line-height: 40px; font-weight: 700; letter-spacing: -0.01em; }
    .ds-h2 { font-size: 24px; line-height: 32px; font-weight: 700; letter-spacing: -0.01em; }
    .ds-h3 { font-size: 20px; line-height: 28px; font-weight: 600; letter-spacing: 0; }
    .ds-h4 { font-size: 16px; line-height: 24px; font-weight: 600; letter-spacing: 0; }
    .ds-body { font-size: 14px; line-height: 20px; font-weight: 400; letter-spacing: 0; }
    .ds-body-large { font-size: 16px; line-height: 24px; font-weight: 400; letter-spacing: 0; }
    .ds-body-small { font-size: 12px; line-height: 16px; font-weight: 400; letter-spacing: 0; }
    .ds-label { font-size: 14px; line-height: 20px; font-weight: 500; letter-spacing: 0.01em; }
    .ds-caption { font-size: 12px; line-height: 16px; font-weight: 400; letter-spacing: 0; color: ${COLORS.grey[500]}; }

    /* Animation Classes */
    .ds-fade-in { animation: fadeIn 300ms ease-out; }
    .ds-scale-in { animation: scaleIn 200ms cubic-bezier(0.34, 1.56, 0.64, 1); }

    /* Spacing Utilities */
    .ds-p-0 { padding: ${SPACING[0]}; }
    .ds-p-1 { padding: ${SPACING[1]}; }
    .ds-p-2 { padding: ${SPACING[2]}; }
    .ds-p-3 { padding: ${SPACING[3]}; }
    .ds-p-4 { padding: ${SPACING[4]}; }
    .ds-p-5 { padding: ${SPACING[5]}; }
    .ds-p-6 { padding: ${SPACING[6]}; }
    .ds-p-7 { padding: ${SPACING[7]}; }
    .ds-p-8 { padding: ${SPACING[8]}; }

    .ds-m-0 { margin: ${SPACING[0]}; }
    .ds-m-1 { margin: ${SPACING[1]}; }
    .ds-m-2 { margin: ${SPACING[2]}; }
    .ds-m-3 { margin: ${SPACING[3]}; }
    .ds-m-4 { margin: ${SPACING[4]}; }
    .ds-m-5 { margin: ${SPACING[5]}; }
    .ds-m-6 { margin: ${SPACING[6]}; }
    .ds-m-7 { margin: ${SPACING[7]}; }
    .ds-m-8 { margin: ${SPACING[8]}; }

    .ds-gap-0 { gap: ${SPACING[0]}; }
    .ds-gap-1 { gap: ${SPACING[1]}; }
    .ds-gap-2 { gap: ${SPACING[2]}; }
    .ds-gap-3 { gap: ${SPACING[3]}; }
    .ds-gap-4 { gap: ${SPACING[4]}; }
    .ds-gap-5 { gap: ${SPACING[5]}; }
    .ds-gap-6 { gap: ${SPACING[6]}; }
    .ds-gap-7 { gap: ${SPACING[7]}; }
    .ds-gap-8 { gap: ${SPACING[8]}; }

    /* Layout Utilities */
    .ds-flex { display: flex; }
    .ds-flex-col { flex-direction: column; }
    .ds-items-center { align-items: center; }
    .ds-justify-center { justify-content: center; }
    .ds-justify-between { justify-content: space-between; }
    .ds-text-center { text-align: center; }
  `;
};

// =============================================================================
// COMPONENT GENERATORS
// =============================================================================

export const createButton = (
  text: string,
  variant: 'primary' | 'secondary' | 'tertiary' = 'primary',
  options: {
    onclick?: string;
    disabled?: boolean;
    loading?: boolean;
    id?: string;
    className?: string;
  } = {}
): string => {
  const classes = [`ds-btn`, `ds-btn-${variant}`];
  if (options.className) classes.push(options.className);

  const attributes = [
    `class="${classes.join(' ')}"`,
    options.id ? `id="${options.id}"` : '',
    options.onclick ? `onclick="${options.onclick}"` : '',
    options.disabled ? 'disabled' : '',
  ].filter(Boolean).join(' ');

  const content = options.loading ? 'Loading...' : text;

  return `<button ${attributes}>${content}</button>`;
};

export const createCard = (
  content: string,
  options: {
    gradient?: keyof typeof GRADIENTS;
    className?: string;
    onclick?: string;
  } = {}
): string => {
  const classes = options.gradient
    ? [`ds-card-gradient`, `ds-card-gradient-${options.gradient}`]
    : ['ds-card'];

  if (options.className) classes.push(options.className);

  const attributes = [
    `class="${classes.join(' ')}"`,
    options.onclick ? `onclick="${options.onclick}"` : '',
  ].filter(Boolean).join(' ');

  return `<div ${attributes}>${content}</div>`;
};

export const createInput = (
  options: {
    value?: string;
    placeholder?: string;
    id?: string;
    name?: string;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    onchange?: string;
  } = {}
): string => {
  const classes = ['ds-input'];
  if (options.error) classes.push('error');

  const attributes = [
    `class="${classes.join(' ')}"`,
    'type="text"',
    options.id ? `id="${options.id}"` : '',
    options.name ? `name="${options.name}"` : '',
    options.value ? `value="${options.value}"` : '',
    options.placeholder ? `placeholder="${options.placeholder}"` : '',
    options.disabled ? 'disabled' : '',
    options.onchange ? `onchange="${options.onchange}"` : '',
  ].filter(Boolean).join(' ');

  let html = `<input ${attributes}>`;

  if (options.helperText) {
    const helperClass = options.error ? 'ds-caption' : 'ds-caption';
    html += `<div class="${helperClass}">${options.helperText}</div>`;
  }

  return html;
};

export const createMetricCard = (
  value: string | number,
  label: string,
  gradient?: keyof typeof GRADIENTS
): string => {
  const style = gradient ? `background: ${GRADIENTS[gradient]};` : '';

  return `
    <div class="ds-metric-card" style="${style}">
      <div class="ds-metric-value">${value}</div>
      <div class="ds-metric-label">${label}</div>
    </div>
  `;
};

export const createStatusBadge = (
  text: string,
  variant: 'success' | 'error' | 'warning' | 'info'
): string => {
  return `<span class="ds-badge ds-badge-${variant}">${text}</span>`;
};

export const createSpinner = (): string => {
  return '<div class="ds-spinner"></div>';
};

export const createProgressBar = (progress?: number): string => {
  const barClass = progress !== undefined ? 'ds-progress-bar' : 'ds-progress-bar ds-progress-bar-indeterminate';
  const barStyle = progress !== undefined ? `width: ${progress}%` : '';

  return `
    <div class="ds-progress">
      <div class="${barClass}" style="${barStyle}"></div>
    </div>
  `;
};

export const createIcon = (
  icon: string,
  options: {
    size?: number;
    color?: string;
    className?: string;
  } = {}
): string => {
  const size = options.size || 20;
  const style = [
    `width: ${size}px`,
    `height: ${size}px`,
    options.color ? `color: ${options.color}` : '',
  ].filter(Boolean).join('; ');

  const classes = ['ds-icon'];
  if (options.className) classes.push(options.className);

  return `<span class="${classes.join(' ')}" style="${style}">${icon}</span>`;
};

export const createIconWithText = (
  icon: string,
  text: string,
  iconOptions?: { size?: number; color?: string }
): string => {
  const iconHtml = createIcon(icon, iconOptions);
  return `
    <div class="ds-icon-with-text">
      ${iconHtml}
      <span class="ds-body">${text}</span>
    </div>
  `;
};