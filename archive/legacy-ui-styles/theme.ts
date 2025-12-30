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

    /* Essential base styles only - Design System handles the rest */
    body {
      font-family: var(--font-family);
      color: var(--color-text-primary);
      background: var(--color-background-gradient) !important;
      margin: 0;
      padding: 24px;
      min-height: 100vh;
    }
  </style>
`;

export default theme;