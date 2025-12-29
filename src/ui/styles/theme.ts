export const theme = {
  colors: {
       primary: {
      main: '#d7adf0',
      dark: '#510081',
      extraDark: '#4a1d5c',
      gradient: 'linear-gradient(135deg, #f9a8d4 0%, #d8b4fe 100%)'
    },
    secondary: {
      light: '#f8f9fa',
      main: '#6c757d',
      dark: '#212426'
    },
    primaryAlt: '#9d174d',
    success: {
      light: '#d4edda',
      main: '#28a745',
      dark: '#155724',
      border: '#c3e6cb'
    },
    error: {
      light: '#f8d7da',
      main: '#dc3545',
      dark: '#721c24',
      border: '#f5c6cb'
    },
    warning: {
      light: '#fff3cd',
      main: '#ffc107',
      dark: '#856404'
    },
    info: {
      light: '#d1ecf1',
      main: '#0c5460',
      border: '#bee5eb',
      alt:'#a000ff'
    },
    text: {
      primary: '#333',
      secondary: '#666',
      tertiary: '#888',
      light: 'rgba(255,255,255,0.9)'
    },
    background: {
      primary: '#ffffff',
      secondary: '#f8f9fa',
      tertiary: 'rgba(0,0,0,0.02)',
      overlay: 'rgba(0,0,0,0.3)',
      gradient: 'linear-gradient(135deg, #f9a8d4 0%, #d8b4fe 100%)'
    },
       border: {
      main: '#e9ecef',
      active: '#d7adf0',
      input: '#e5e7eb',
      hover: '#510081'
    }
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px'
  },

  borders: {
    radius: {
      xs: '4px',
      sm: '6px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      full: '9999px'
    },
    width: {
      thin: '1px',
      base: '2px',
      thick: '3px'
    }
  },

 typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'monospace'
    },
    fontSize: {
      xs: '11px',
      sm: '12px',
      md: '13px',
      base: '14px',
      lg: '16px',
      xl: '18px',
      xxl: '20px',
      xxxl: '24px'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
 },
    lineHeight: {
      tight: 1.2,
      base: 1.4,
      relaxed: 1.6
    },

  transitions: {
    duration: {
      fast: '0.2s',
      base: '0.3s',
      slow: '0.5s'
    },
    timing: {
      base: 'ease',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  },

  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.05)',
    md: '0 4px 8px rgba(0,0,0,0.1)',
    lg: '0 8px 16px rgba(0,0,0,0.1)',
    xl: '0 20px 40px rgba(0,0,0,0.1)'
  },

    zIndex: {
    modal: 1000,
    overlay: 900,
    dropdown: 800,
    header: 700,
    tooltip: 600
  }
};

import { generateDesignSystemCSS } from '../../design-system/html-utils';

export const getSharedStyles = () => `
  <style>
    ${generateDesignSystemCSS()}

    /* Fintech Design System CSS Variables */
    :root {
      /* Primary Colors - Using new fintech black/grey palette */
      --color-primary: #0F1112;
      --color-primary-light: #C084FC;
      --color-primary-dark: #A855F7;
      --color-primary-extraDark: #7E22CE;
      --color-primary-background: #FAF5FF;
      --color-primary-gradient: linear-gradient(135deg, #DEE3FC 0%, #ECEDF6 100%);

      /* Text Colors - Using fintech neutral palette */
      --color-text-primary: #0F1112;
      --color-text-secondary: #B1B2B6;
      --color-text-tertiary: #6B6E73;
      --color-text-disabled: #C8CACC;
      --color-text-light: #FFFFFF;

      /* Background Colors - Using fintech pastels */
      --color-background-primary: #FFFFFF;
      --color-background-secondary: #F3F5F9;
      --color-background-tertiary: #FAFAFC;
      --color-background-overlay: rgba(15, 17, 18, 0.3);
      --color-background-gradient: linear-gradient(135deg, #F7E3E3 0%, #DEE3FC 100%);

      /* Pastel System Colors */
      --color-lavender-400: #D7D9F6;
      --color-lavender-300: #DEE3FC;
      --color-lavender-200: #E8E9FD;
      --color-lavender-100: #ECEDF6;

      --color-mint-400: #E0E4E5;
      --color-mint-300: #E8ECF1;
      --color-mint-200: #F2F3F7;
      --color-mint-100: #FAFAFC;

      --color-blush-400: #E5C7C8;
      --color-blush-300: #F6EEEA;
      --color-blush-200: #F7E3E3;
      --color-blush-100: #FCE3E0;

      /* State Colors - Maintaining accessibility */
      --color-success: #166534;
      --color-success-dark: #155724;
      --color-success-light: #DCFCE7;
      --color-success-border: #86EFAC;

      --color-error: #991B1B;
      --color-error-dark: #7f1d1d;
      --color-error-light: #FEE2E2;
      --color-error-border: #FCA5A5;

      --color-warning: #92400E;
      --color-warning-dark: #78350f;
      --color-warning-light: #FEF3C7;
      --color-warning-border: #FCD34D;

      --color-info: #1E40AF;
      --color-info-dark: #1d4ed8;
      --color-info-light: #DBEAFE;
      --color-info-border: #93C5FD;

      /* Border Colors */
      --color-border: #E5E7E9;
      --color-border-active: #C084FC;
      --color-border-input: #E5E7E9;
      --color-border-hover: #A855F7;

      /* Hover States */
      --color-hover-bg: rgba(15, 17, 18, 0.02);

      /*Spacings - New Design System*/
      --spacing-xs: 4px;
      --spacing-sm: 8px;
      --spacing-md: 12px;
      --spacing-lg: 16px;
      --spacing-xl: 20px;
      --spacing-xxl: 24px;
      
      /* Border Radius - New Design System */
        --border-radius-xs: 4px;
        --border-radius-sm: 6px;
        --border-radius-md: 8px;
        --border-radius-lg: 12px;
        --border-radius-xl: 16px;
        --border-radius-full: 9999px;

        /* Border Width */
        --border-width-thin: 1px;
        --border-width-base: 2px;
        --border-width-thick: 3px;

        /* Typography - New Design System */
        --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "Roboto", "Helvetica Neue", Arial, sans-serif;
        --font-size-xs: 12px;
        --font-size-sm: 12px;
        --font-size-md: 14px;
        --font-size-base: 14px;
        --font-size-lg: 16px;
        --font-size-xl: 20px;
        --font-size-xxl: 24px;
        --font-weight-normal: 400;
        --font-weight-medium: 500;
        --font-weight-semibold: 600;
        --font-weight-bold: 700;
        --line-height-tight: 1.2;
        --line-height-base: 1.4;
        --line-height-relaxed: 1.6;

      /* Transitions - New Design System */
        --transition-duration-fast: 100ms;
        --transition-duration-base: 150ms;
        --transition-duration-slow: 300ms;
        --transition-timing-base: ease;
        --transition-timing-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
        --transition-default: all 150ms ease;


      /* Shadows - Fintech Design System */
        --shadow-sm: 0 1px 2px 0 rgba(15, 17, 18, 0.05);
        --shadow-md: 0 2px 8px 0 rgba(15, 17, 18, 0.04);
        --shadow-lg: 0 4px 12px 0 rgba(15, 17, 18, 0.08);
        --shadow-xl: 0 8px 24px 0 rgba(15, 17, 18, 0.12);

        /* Z-Index */
        --z-index-modal: 1000;
        --z-index-overlay: 900;
        --z-index-dropdown: 800;
        --z-index-header: 700;
        --z-index-tooltip: 600;
    }

    /* Legacy styles for backward compatibility - now using design system */
    body {
      font-family: var(--font-family);
      color: var(--color-text-primary);
      background: linear-gradient(135deg, #F7E3E3 0%, #DEE3FC 100%) !important;
      margin: 0;
      padding: 24px;
      min-height: 100vh;
    }

    .container, .modal-container {
      max-width: 600px;
      margin: 0 auto;
      border-radius: var(--border-radius-xl);
      box-shadow: var(--shadow-xl);
    }

    /* Legacy Typography */
    h1 {
      font-size: var(--font-size-xxl);
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-sm);
    }

    /* Legacy Forms */
    .form-group {
      margin-bottom: var(--spacing-lg);
    }

    .form-label {
      display: block;
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-sm);
      font-size: var(--font-size-md);
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: var(--spacing-md);
      border: 2px solid var(--color-border);
      border-radius: var(--border-radius-md);
      font-size: var(--font-size-md);
      transition: border-color var(--transition-duration-base) var(--transition-timing-base);
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    /* Legacy Buttons */
    .btn {
      padding: var(--spacing-sm) var(--spacing-lg);
      border-radius: var(--border-radius-md);
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: var(--transition-default);
      border: none;
    }

    .btn-primary {
      background: var(--color-primary);
      color: var(--color-text-light);
    }

    .btn-primary:hover {
      background: var(--color-primary-alt);
      color: var(--color-text-light);
    }

    .btn-primary:disabled {
      background: var(--color-primary);
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary:focus {
      outline: 2px solid var(--color-border-active);
    }

    .btn-secondary {
      background: var(--color-secondary);
      color: white;
    }

    .btn-secondary:hover {
      background: var(--color-secondary-dark);
    }

    .btn-secondary:focus {
      outline: 2px solid var(--color-border-active);
    }

    .btn-secondary:disabled {
      background: var(--color-secondary);
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Legacy Cards */
    .card {
      background: var(--color-background-primary);
      border-radius: var(--border-radius-md);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow-sm);
    }

    .card:hover {
      box-shadow: var(--shadow-md);
      transition: var(--transition-default);
      border: 1px solid var(--color-border-active);
    }

    /* Legacy Helpers */
    .text-small {
      font-size: var(--font-size-sm);
    }

    a {
      color: var(--color-primary-dark);
      text-decoration: none;
    }

    a:hover {
      color: var(--color-primary-alt);
      text-decoration: underline;
    }

    .text-secondary {
      color: var(--color-text-secondary);
    }
  </style>
`;

export default theme;