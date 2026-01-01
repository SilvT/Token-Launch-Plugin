/**
 * Token Launch - Figma Plugin for Design Token Automation
 * Copyright (c) 2026 Silvia Travieso
 * Licensed under the MIT License
 *
 * Design System Tokens
 */

export const PLUGIN_DIMENSIONS = {
  DEFAULT_WIDTH: 480,
  DEFAULT_HEIGHT: 750,  // Increased to accommodate full content without scroll
  MIN_WIDTH: 70,      // Figma API minimum
  MIN_HEIGHT: 100,    // Figma API minimum on resize
  MAX_HEIGHT: 800,    // Recommended maximum for screen fit
} as const;

export const COLORS = {
  // Neutrals (from fintech reference)
  neutral: {
    900: '#0F1112',  // Maximum contrast, primary text
    500: '#B1B2B6',  // Mid grey, secondary text
    100: '#F3F5F9',  // Light grey, subtle backgrounds
    50: '#FFFFFF',   // Pure white
  },

  // Semantic aliases for common use
  black: '#0F1112',
  white: '#FFFFFF',
  grey: {
    900: '#0F1112',  // Darkest - primary text, icons
    800: '#1A1C1E',  // Strong emphasis (derived)
    700: '#404347',  // Headings (derived)
    600: '#6B6E73',  // Body text (derived)
    500: '#B1B2B6',  // Secondary text
    400: '#C8CACC',  // Placeholder text (derived)
    300: '#D4D6D8',  // Disabled elements (derived)
    200: '#E5E7E9',  // Dividers (derived)
    100: '#F3F5F9',  // Subtle backgrounds
    50: '#FAFAFC',   // Lightest background
  },

  // Lavender/Purple system (from fintech reference)
  lavender: {
    950: '#7C2D92;',  // Ultra deep lavender
    900: '#2E32F4',  // Deepest lavender
    800: '#3F46F9',  // Darkest lavender
    700: '#5A5FF3',  // Dark lavender
    600: '#7C82F7',  // Deep lavender
    500: '#A3A6F0',  // Medium lavender
    400: '#D7D9F6',  // Richest lavender
    300: '#DEE3FC',  // Medium lavender
    200: '#E8E9FD',  // Light lavender
    100: '#ECEDF6',  // Palest lavender
  },

  // Mint/Green system (from fintech reference)
mint: {
  100: '#F6FBFA',  // Palest mint - barely mint
  200: '#ECF6F4',  // Light mint - pale mint
  300: '#DDEFEB',  // Medium mint - soft mint
  400: '#CCE9E3',  // Deepest mint (pastel range) - fresh mint
  500: '#9DD4C8',  // Medium mint - clear mint
  600: '#6FBFAD',  // Rich mint - vibrant mint
  700: '#4FA896',  // Deep mint - teal mint
  800: '#3A8A7C',  // Darker mint - forest mint
  900: '#2A6B60',  // Darkest mint - deep teal
},

  // Blush/Pink system (from fintech reference)
  blush: {
    400: '#E5C7C8',  // Richest blush
    300: '#F6EEEA',  // Medium blush
    200: '#F7E3E3',  // Light blush
    100: '#FCE3E0',  // Palest blush
    50: '#FDF1EF',   // Very pale blush
  },

  // Primary Accent (pinkish-purple)
  primary: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',   // Primary interactive colour
    500: '#A855F7',   // Hover state
    600: '#9333EA',   // Active state
    700: '#7E22CE',   // Darker variant for accessibility
    800: '#6B21A8',
    900: '#581C87',
  },

  // State colours (pastel variants)
  state: {
    success: {
      bg: '#DCFCE7',    // Soft green background
      text: '#166534',  // Dark green text (accessible)
      border: '#86EFAC',
    },
    error: {
      bg: '#FEE2E2',    // Soft red background
      text: '#991B1B',  // Dark red text (accessible)
      border: '#FCA5A5',
    },
    warning: {
      bg: '#FEF3C7',    // Soft yellow background
      text: '#92400E',  // Dark amber text (accessible)
      border: '#FCD34D',
    },
    info: {
      bg: '#DBEAFE',    // Soft blue background
      text: '#1E40AF',  // Dark blue text (accessible)
      border: '#93C5FD',
    },
  },
} as const;

// CSS gradient generator
export const createGradient = (
  from: string,
  to: string,
  angle: number = 135
): string => {
  return `linear-gradient(${angle}deg, ${from} 0%, ${to} 100%)`;
};

// Predefined gradients for use in components (using fintech reference colours)
export const GRADIENTS = {
  // Lavender gradients (from richest to white)
  lavenderStrong: createGradient(COLORS.lavender[400], COLORS.lavender[100]),
  lavenderMedium: createGradient(COLORS.lavender[300], COLORS.lavender[100]),
  lavenderLight: createGradient(COLORS.lavender[200], COLORS.white),
  lavenderSubtle: createGradient(COLORS.lavender[100], COLORS.white),

  // Mint gradients (from deepest to white)
  mintStrong: createGradient(COLORS.mint[400], COLORS.mint[100]),
  mintMedium: createGradient(COLORS.mint[300], COLORS.mint[100]),
  mintLight: createGradient(COLORS.mint[200], COLORS.white),
  mintSubtle: createGradient(COLORS.mint[100], COLORS.white),

  // Blush gradients (from richest to white)
  blushStrong: createGradient(COLORS.blush[400], COLORS.blush[100]),
  blushMedium: createGradient(COLORS.blush[300], COLORS.blush[100]),
  blushLight: createGradient(COLORS.blush[200], COLORS.white),
  blushSubtle: createGradient(COLORS.blush[100], COLORS.white),

  // Cross-color gradients
  lavenderToBlush: createGradient(COLORS.lavender[300], COLORS.blush[300]),
} as const;

// Colour application guide
export const COLOR_USAGE = {
  // Gradient backgrounds (for hero sections, cards)
  gradientBackgrounds: [
    GRADIENTS.lavenderMedium,
    GRADIENTS.mintLight,
    GRADIENTS.blushLight,
  ],

  // Solid backgrounds (for subtle cards, sections)
  cardBackgrounds: [
    COLORS.lavender[100],
    COLORS.mint[100],
    COLORS.blush[100],
    COLORS.grey[100],
  ],

  // Hover states (slightly darker than base)
  hoverBackgrounds: [
    COLORS.lavender[200],
    COLORS.mint[200],
    COLORS.blush[200],
    COLORS.grey[100],
  ],

  // Focus states (use primary accent)
  focusRing: COLORS.primary[400],
  focusBackground: COLORS.primary[50],

  // Shadows (using neutrals with opacity)
  shadows: {
    sm: `0 1px 2px 0 rgba(15, 17, 18, 0.05)`,
    base: `0 2px 8px 0 rgba(15, 17, 18, 0.04)`,
    md: `0 4px 12px 0 rgba(15, 17, 18, 0.08)`,
    lg: `0 8px 24px 0 rgba(15, 17, 18, 0.12)`,
  },
} as const;

// Accessible text on primary background
export const PRIMARY_TEXT_COLORS = {
  onPrimary400: COLORS.white,        // White on primary.400
  onPrimary300: COLORS.primary[700],  // Dark purple on lighter primary
  onPrimary200: COLORS.primary[800],  // Darker purple on very light primary
} as const;

export const FONT_FAMILY = {
  base: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
} as const;

export const TYPOGRAPHY = {
  // Display (hero numbers, large metrics)
  display: {
    fontSize: '48px',
    lineHeight: '56px',
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },

  // Headings
  h1: {
    fontSize: '32px',
    lineHeight: '40px',
    fontWeight: 700,
    letterSpacing: '-0.01em',
  },
  h2: {
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: 700,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '20px',
    lineHeight: '28px',
    fontWeight: 600,
    letterSpacing: '0',
  },
  h4: {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: 600,
    letterSpacing: '0',
  },

  // Body text
  body: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 400,
    letterSpacing: '0',
  },
  bodyLarge: {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: 400,
    letterSpacing: '0',
  },
  bodySmall: {
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 400,
    letterSpacing: '0',
  },

  // Labels and captions
  label: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 500,
    letterSpacing: '0.01em',
  },
  caption: {
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 400,
    letterSpacing: '0',
    color: COLORS.grey[500],
  },

  // Metrics (for numbers in stat cards)
  metric: {
    fontSize: '36px',
    lineHeight: '40px',
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
  metricLabel: {
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 400,
    letterSpacing: '0.01em',
    textTransform: 'uppercase' as const,
    color: COLORS.grey[600],
  },
} as const;

export const SPACING = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
} as const;

// Semantic spacing tokens
export const SEMANTIC_SPACING = {
  cardPadding: SPACING[6],           // 24px
  cardGap: SPACING[6],               // 24px between cards
  sectionGap: SPACING[8],            // 32px between major sections
  elementGap: SPACING[4],            // 16px between related elements
  inlineGap: SPACING[2],             // 8px for inline elements
  iconGap: SPACING[2],               // 8px icon to text
} as const;

export const INTERACTION_STATES = {
  hover: {
    transform: 'translateY(-1px)',
    transition: 'all 150ms ease',
  },
  active: {
    transform: 'scale(0.98)',
    transition: 'all 100ms ease',
  },
  focus: {
    outline: `2px solid ${COLORS.primary[400]}`,
    outlineOffset: '2px',
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    pointerEvents: 'none' as const,
  },
} as const;

export const TRANSITIONS = {
  fast: '100ms ease',
  base: '150ms ease',
  slow: '300ms ease',
  slower: '500ms ease',
} as const;

// Easing functions
export const EASING = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export const ICON_CONFIG = {
  size: 20,
  strokeWidth: 2,
  color: COLORS.grey[700],
} as const;