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

// Generate CSS custom properties from design system tokens
export const generateCSSCustomProperties = (): string => {
  return `
    :root {
      /* Primary Colors */
      --color-primary-50: ${COLORS.primary[50]};
      --color-primary-100: ${COLORS.primary[100]};
      --color-primary-200: ${COLORS.primary[200]};
      --color-primary-300: ${COLORS.primary[300]};
      --color-primary-400: ${COLORS.primary[400]};
      --color-primary: ${COLORS.primary[400]};
      --color-primary-500: ${COLORS.primary[500]};
      --color-primary-600: ${COLORS.primary[600]};
      --color-primary-700: ${COLORS.primary[700]};
      --color-primary-800: ${COLORS.primary[800]};
      --color-primary-900: ${COLORS.primary[900]};
      --color-primary-light: ${COLORS.primary[400]};
      --color-primary-dark: ${COLORS.primary[500]};
      --color-primary-extraDark: ${COLORS.primary[700]};
      --color-primary-background: ${COLORS.primary[50]};

      /* Neutral/Grey Colors */
      --color-neutral-50: ${COLORS.neutral[50]};
      --color-neutral-100: ${COLORS.neutral[100]};
      --color-neutral-500: ${COLORS.neutral[500]};
      --color-neutral-900: ${COLORS.neutral[900]};
      --color-black: ${COLORS.black};
      --color-white: ${COLORS.white};
      --color-grey-50: ${COLORS.grey[50]};
      --color-grey-100: ${COLORS.grey[100]};
      --color-grey-200: ${COLORS.grey[200]};
      --color-grey-300: ${COLORS.grey[300]};
      --color-grey-400: ${COLORS.grey[400]};
      --color-grey-500: ${COLORS.grey[500]};
      --color-grey-600: ${COLORS.grey[600]};
      --color-grey-700: ${COLORS.grey[700]};
      --color-grey-800: ${COLORS.grey[800]};
      --color-grey-900: ${COLORS.grey[900]};

      /* Lavender Colors */
      --color-lavender-100: ${COLORS.lavender[100]};
      --color-lavender-200: ${COLORS.lavender[200]};
      --color-lavender-300: ${COLORS.lavender[300]};
      --color-lavender-400: ${COLORS.lavender[400]};

      /* Mint Colors */
      --color-mint-100: ${COLORS.mint[100]};
      --color-mint-200: ${COLORS.mint[200]};
      --color-mint-300: ${COLORS.mint[300]};
      --color-mint-400: ${COLORS.mint[400]};
      --color-mint-500: ${COLORS.mint[500]};
      --color-mint-600: ${COLORS.mint[600]};
      --color-mint-700: ${COLORS.mint[700]};
      --color-mint-800: ${COLORS.mint[800]};
      --color-mint-900: ${COLORS.mint[900]};

      /* Blush Colors */
      --color-blush-50: ${COLORS.blush[50]};
      --color-blush-100: ${COLORS.blush[100]};
      --color-blush-200: ${COLORS.blush[200]};
      --color-blush-300: ${COLORS.blush[300]};
      --color-blush-400: ${COLORS.blush[400]};

      /* Text Colors */
      --color-text-primary: ${COLORS.neutral[900]};
      --color-text-secondary: ${COLORS.neutral[500]};
      --color-text-tertiary: ${COLORS.grey[600]};
      --color-text-disabled: ${COLORS.grey[400]};
      --color-text-light: ${COLORS.white};

      /* Background Colors */
      --color-background-primary: ${COLORS.white};
      --color-background-secondary: ${COLORS.neutral[100]};
      --color-background-tertiary: ${COLORS.grey[50]};
      --color-background-overlay: rgba(15, 17, 18, 0.3);
      --color-background-gradient: linear-gradient(135deg, ${COLORS.lavender[300]} 0%, ${COLORS.blush[200]} 100%);

      /* State Colors */
      --color-success: ${COLORS.state.success.text};
      --color-success-light: ${COLORS.state.success.bg};
      --color-success-dark: ${COLORS.state.success.text};
      --color-success-border: ${COLORS.state.success.border};

      --color-error: ${COLORS.state.error.text};
      --color-error-light: ${COLORS.state.error.bg};
      --color-error-dark: ${COLORS.state.error.text};
      --color-error-border: ${COLORS.state.error.border};

      --color-warning: ${COLORS.state.warning.text};
      --color-warning-light: ${COLORS.state.warning.bg};
      --color-warning-dark: ${COLORS.state.warning.text};
      --color-warning-border: ${COLORS.state.warning.border};

      --color-info: ${COLORS.state.info.text};
      --color-info-light: ${COLORS.state.info.bg};
      --color-info-dark: ${COLORS.state.info.text};
      --color-info-border: ${COLORS.state.info.border};

      /* Border Colors */
      --color-border: ${COLORS.grey[200]};
      --color-border-active: ${COLORS.primary[400]};
      --color-border-input: ${COLORS.grey[200]};
      --color-border-hover: ${COLORS.primary[500]};

      /* Hover States */
      --color-hover-bg: rgba(15, 17, 18, 0.02);

      /* Spacing */
      --spacing-0: ${SPACING[0]};
      --spacing-1: ${SPACING[1]};
      --spacing-2: ${SPACING[2]};
      --spacing-3: ${SPACING[3]};
      --spacing-4: ${SPACING[4]};
      --spacing-5: ${SPACING[5]};
      --spacing-6: ${SPACING[6]};
      --spacing-7: ${SPACING[7]};
      --spacing-8: ${SPACING[8]};

      /* Transitions */
      --transition-fast: ${TRANSITIONS.fast};
      --transition-base: ${TRANSITIONS.base};
      --transition-slow: ${TRANSITIONS.slow};
      --transition-slower: ${TRANSITIONS.slower};
      --transition-default: ${TRANSITIONS.base};

      /* Shadows */
      --shadow-sm: 0 1px 2px 0 rgba(15, 17, 18, 0.05);
      --shadow-md: 0 2px 8px 0 rgba(15, 17, 18, 0.04);
      --shadow-lg: 0 4px 12px 0 rgba(15, 17, 18, 0.08);
      --shadow-xl: 0 8px 24px 0 rgba(15, 17, 18, 0.12);

      /* Typography */
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "Roboto", "Helvetica Neue", Arial, sans-serif;
    }
  `;
};

// Generate complete CSS for the design system
export const generateDesignSystemCSS = (): string => {
  return `
    ${generateCSSCustomProperties()}
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

    /* Form Help Text */
    .ds-form-help {
      font-size: 12px;
      color: ${COLORS.grey[600]};
      line-height: 1.4;
      margin-top: 4px;
    }

    /* Checkbox Styles */
    .ds-checkbox {
      appearance: none;
      width: 16px;
      height: 16px;
      border: 2px solid ${COLORS.grey[300]};
      border-radius: 3px;
      background-color: ${COLORS.white};
      cursor: pointer;
      position: relative;
      margin-right: 8px;
      transition: all 150ms ease;
    }

    .ds-checkbox:hover {
      border-color: ${COLORS.primary[400]};
    }

    .ds-checkbox:checked {
      background-color: ${COLORS.primary[400]};
      border-color: ${COLORS.primary[400]};
    }

    .ds-checkbox:checked::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 8px;
      border: solid ${COLORS.white};
      border-width: 0 2px 2px 0;
      transform: translate(-50%, -60%) rotate(45deg);
    }

    .ds-checkbox:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .ds-checkbox:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background-color: ${COLORS.grey[50]};
      border-color: ${COLORS.grey[200]};
    }

    .ds-checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 14px;
      line-height: 20px;
      color: ${COLORS.grey[900]};
      cursor: pointer;
      user-select: none;
    }

    .ds-checkbox-label:hover .ds-checkbox {
      border-color: ${COLORS.primary[400]};
    }

    /* Info Icon Tooltip Styles */
    .ds-info-icon {
      position: relative;
      cursor: pointer;
      color: ${COLORS.grey[600]};
      padding: 4px;
      border-radius: 4px;
      transition: all 150ms ease;
      margin-left: 8px;
    }

    .ds-info-icon:hover {
      background-color: ${COLORS.primary[300]};
      color: ${COLORS.white};
    }

    .ds-info-icon[data-tooltip]:hover::before {
      content: attr(data-tooltip);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background-color: ${COLORS.black};
      color: ${COLORS.white};
      padding: 6px 8px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 1000;
      margin-bottom: 4px;
    }

    .ds-info-icon[data-tooltip]:hover::after {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 4px solid transparent;
      border-top-color: ${COLORS.black};
      z-index: 1000;
    }
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

export const createInfoIcon = (
  options: {
    tooltip?: string;
    onclick?: string;
    className?: string;
  } = {}
): string => {
  const classes = ['ds-info-icon'];
  if (options.className) classes.push(options.className);

  const attributes = [
    `class="${classes.join(' ')}"`,
    options.tooltip ? `data-tooltip="${options.tooltip}"` : '',
    options.onclick ? `onclick="${options.onclick}"` : '',
  ].filter(Boolean).join(' ');

  return `<span ${attributes}><i class="ph-info" data-weight="fill"></i></span>`;
};