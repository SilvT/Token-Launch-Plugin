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

export const getSharedStyles = () => `
  <style>
    :root {
      /* Colors */
      --color-primary: ${theme.colors.primary.main};
      --color-primary-dark: ${theme.colors.primary.dark};
      --color-primary-extraDark: ${theme.colors.primary.extraDark};
      --color-primary-gradient: ${theme.colors.primary.gradient};
      --color-primary-alt: ${theme.colors.primaryAlt};
      --color-secondary: ${theme.colors.secondary.main};
      --color-secondary-light: ${theme.colors.secondary.light};
      --color-secondary-dark: ${theme.colors.secondary.dark};
      --color-success: ${theme.colors.success.main};
      --color-success-dark: ${theme.colors.success.dark};
      --color-success-border: ${theme.colors.success.border};
      --color-success-light: ${theme.colors.success.light}; 
      --color-error-light: ${theme.colors.error.light};
      --color-error: ${theme.colors.error.main};
      --color-error-dark: ${theme.colors.error.dark};
      --color-error-border: ${theme.colors.error.border};
      --color-warning-light: ${theme.colors.warning.light};
      --color-warning: ${theme.colors.warning.main};
      --color-warning-dark: ${theme.colors.warning.dark};
      --color-info-light: ${theme.colors.info.light};
      --color-info: ${theme.colors.info.main};
      --color-info-border: ${theme.colors.info.border};
      --color-info-alt: ${theme.colors.info.alt};
      --color-text-primary: ${theme.colors.text.primary};
      --color-text-secondary: ${theme.colors.text.secondary};
      --color-text-tertiary: ${theme.colors.text.tertiary};
      --color-text-light: ${theme.colors.text.light};
      --color-border: ${theme.colors.border.main};
      --color-border-active: ${theme.colors.border.active};
      --color-border-input: ${theme.colors.border.input};
      --color-border-hover: ${theme.colors.border.hover};
      --color-background-primary: ${theme.colors.background.primary};
      --color-background-secondary: ${theme.colors.background.secondary};
      --color-background-tertiary: ${theme.colors.background.tertiary};
      --color-background-overlay: ${theme.colors.background.overlay};
      --color-background-gradient: ${theme.colors.background.gradient};

      /*Spacings*/
      --spacing-xs: ${theme.spacing.xs};
      --spacing-sm: ${theme.spacing.sm};
      --spacing-md: ${theme.spacing.md};
      --spacing-lg: ${theme.spacing.lg};
      --spacing-xl: ${theme.spacing.xl};
      --spacing-xxl: ${theme.spacing.xxl};
      
      /* Border Radius */   
        --border-radius-xs: ${theme.borders.radius.xs};  
        --border-radius-sm: ${theme.borders.radius.sm};   
        --border-radius-md: ${theme.borders.radius.md};   
        --border-radius-lg: ${theme.borders.radius.lg};
        --border-radius-xl: ${theme.borders.radius.xl};
        --border-radius-full: ${theme.borders.radius.full};

        /* Border Width */
        --border-width-thin: ${theme.borders.width.thin};
        --border-width-base: ${theme.borders.width.base};
        --border-width-thick: ${theme.borders.width.thick};
 
        /* Typography */
        --font-family: ${theme.typography.fontFamily};
        --font-size-xs: ${theme.typography.fontSize.xs};
        --font-size-sm: ${theme.typography.fontSize.sm};
        --font-size-md: ${theme.typography.fontSize.md};
        --font-size-base: ${theme.typography.fontSize.base};
        --font-size-lg: ${theme.typography.fontSize.lg};
        --font-size-xl: ${theme.typography.fontSize.xl};
        --font-size-xxl: ${theme.typography.fontSize.xxl};
        --font-weight-normal: ${theme.typography.fontWeight.normal};
        --font-weight-medium: ${theme.typography.fontWeight.medium};
        --font-weight-semibold: ${theme.typography.fontWeight.semibold};
        --font-weight-bold: ${theme.typography.fontWeight.bold};
        --line-height-tight: ${theme.lineHeight.tight};
        --line-height-base: ${theme.lineHeight.base};
        --line-height-relaxed: ${theme.lineHeight.relaxed};

      /* Transitions */
      --transition-duration-fast: ${theme.transitions.duration.fast};
        --transition-duration-base: ${theme.transitions.duration.base};
        --transition-duration-slow: ${theme.transitions.duration.slow};
        --transition-timing-base: ${theme.transitions.timing.base};
        --transition-timing-bounce: ${theme.transitions.timing.bounce};
    
        
      /* Shadows */
        --shadow-sm: ${theme.shadows.sm};
        --shadow-md: ${theme.shadows.md};
        --shadow-lg: ${theme.shadows.lg};
        --shadow-xl: ${theme.shadows.xl};

        /* Z-Index */
        --z-index-modal: ${theme.zIndex.modal};
        --z-index-overlay: ${theme.zIndex.overlay};
        --z-index-dropdown: ${theme.zIndex.dropdown};
        --z-index-header: ${theme.zIndex.header};
        --z-index-tooltip: ${theme.zIndex.tooltip};

    }

    /* Reset & Base Styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-family);
      color: var(--color-text-primary);
      background: var(--color-background-gradient);
      padding: var(--spacing-md);
    }
    .container, .modal-container {
    max-width: 600px;
    margin: 0 auto;
    border-radius: var(--border-radius-xl);
    box-shadow: var(--shadow-xl);
    }

    /* Typography */
    h1 {
      font-size: ${theme.typography.fontSize.xxl};
      font-weight: ${theme.typography.fontWeight.semibold};
      margin-bottom: ${theme.spacing.sm};
    }

    /* Forms */
    .form-group {
      margin-bottom: ${theme.spacing.lg};
    }

    .form-label {
      display: block;
      font-weight: ${theme.typography.fontWeight.medium};
      color: var(--color-text-primary);
      margin-bottom: ${theme.spacing.sm};
      font-size: ${theme.typography.fontSize.md};
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: ${theme.spacing.md};
      border: 2px solid var(--color-border);
      border-radius: ${theme.borders.radius.md};
      font-size: ${theme.typography.fontSize.md};
      transition: border-color ${theme.transitions.duration.base} ${theme.transitions.timing.base};
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    /* Buttons */
    .btn {
      padding: ${theme.spacing.sm} ${theme.spacing.lg};
      border-radius: ${theme.borders.radius.md};
      font-size: ${theme.typography.fontSize.md};
      font-weight: ${theme.typography.fontWeight.medium};
      cursor: pointer;
      transition: all ${theme.transitions.duration.base} ${theme.transitions.timing.base};
      border: none;
    }

    .btn-primary {
      background: var(--color-primary);
      color: var(--color-text-primary);
    }

    .btn-primary:hover {
      background: var(--color-primary-alt);
      color:var(--color-text-light);
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

    /* Cards */
    .card {
      background: var(--color-background-primary);
      border-radius: ${theme.borders.radius.md};
      padding: ${theme.spacing.lg};
      box-shadow: ${theme.shadows.sm};
    }
    .card:hover {
        box-shadow: ${theme.shadows.md};
        transition: box-shadow ${theme.transitions.duration.base} ${theme.transitions.timing.base};
        border: 1px solid var(--color-border-active);
        }
    /* Helpers */
    .text-small {
      font-size: ${theme.typography.fontSize.sm};
    }
      a{
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