// Animation keyframes CSS
export const ANIMATIONS_CSS = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes loading {
    0% { transform: translateX(-100%); }
    50% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
`;

// Animation classes for use in HTML
export const ANIMATION_CLASSES = {
  fadeIn: 'fadeIn 300ms ease-out',
  scaleIn: 'scaleIn 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  spin: 'spin 0.8s linear infinite',
  loading: 'loading 1.5s ease-in-out infinite',
};