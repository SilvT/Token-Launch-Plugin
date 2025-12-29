# Design System Implementation Guide
## Figma Plugin Visual Redesign

**Document Version:** 1.0  
**Last Updated:** December 29, 2025  
**Target:** TypeScript implementation for Figma plugin  
**Style Reference:** Modern fintech aesthetic with soft pastels and bold contrast

---

## Executive Summary

This guide provides a complete design system specification for redesigning your Figma plugin with a modern, professional aesthetic. The system combines soft pastel gradients with high-contrast elements to create a tool that feels both approachable and authoritative. Every specification is implementation-ready for TypeScript with no component library dependencies to maintain minimal plugin weight.

**Design Philosophy:**
- Soft gradients for approachability
- Bold black elements for clarity and hierarchy
- High contrast for accessibility
- Minimal visual weight on secondary elements
- Professional "system tool" aesthetic

---

## Table of Contents

1. [Plugin Dimensions](#plugin-dimensions)
2. [Colour System](#colour-system)
3. [Typography System](#typography-system)
4. [Spacing System](#spacing-system)
5. [Component Library](#component-library)
6. [State Management](#state-management)
7. [Icons](#icons)
8. [Animation & Transitions](#animation--transitions)
9. [Implementation Examples](#implementation-examples)
10. [Priority Implementation Roadmap](#priority-implementation-roadmap)

---

## Plugin Dimensions

### Window Sizing

```typescript
// Plugin window configuration
export const PLUGIN_DIMENSIONS = {
  DEFAULT_WIDTH: 480,
  DEFAULT_HEIGHT: 680,
  MIN_WIDTH: 70,      // Figma API minimum
  MIN_HEIGHT: 100,    // Figma API minimum on resize
  MAX_HEIGHT: 800,    // Recommended maximum for screen fit
} as const;

// Initialize plugin
figma.showUI(__html__, {
  width: PLUGIN_DIMENSIONS.DEFAULT_WIDTH,
  height: PLUGIN_DIMENSIONS.DEFAULT_HEIGHT,
});
```

**Rationale:**
- 480px width accommodates forms and cards comfortably
- 680px height allows for multi-step workflows without scrolling
- 800px max height prevents overflow on typical screens

---

## Colour System

### Core Palette

```typescript
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
    400: '#D7D9F6',  // Richest lavender
    300: '#DEE3FC',  // Medium lavender
    200: '#E8E9FD',  // Light lavender
    100: '#ECEDF6',  // Palest lavender
  },
  
  // Mint/Green system (from fintech reference)
  mint: {
    400: '#E0E4E5',  // Deepest mint
    300: '#E8ECF1',  // Medium mint
    200: '#F2F3F7',  // Light mint
    100: '#FAFAFC',  // Palest mint
  },
  
  // Blush/Pink system (from fintech reference)
  blush: {
    400: '#E5C7C8',  // Richest blush
    300: '#F6EEEA',  // Medium blush
    200: '#F7E3E3',  // Light blush
    100: '#FCE3E0',  // Palest blush
  },
  
  // Primary Accent (pinkish-purple for interactive elements)
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
```

### Gradient Utilities

```typescript
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
```

### Colour Application Examples

Here's how to apply the fintech colour palette throughout your plugin:

#### Background Colours

```typescript
// Hero sections, feature highlights
const heroBackground = GRADIENTS.lavenderMedium;

// Metric cards
const metricBackgrounds = {
  primary: GRADIENTS.lavenderLight,
  secondary: GRADIENTS.blushLight,
  tertiary: GRADIENTS.mintLight,
};

// Subtle section backgrounds
const sectionBackgrounds = {
  lavender: COLORS.lavender[100],  // #ECEDF6
  mint: COLORS.mint[100],          // #FAFAFC
  blush: COLORS.blush[100],        // #FCE3E0
  grey: COLORS.grey[100],          // #F3F5F9
};

// Card fills
const cardFill = COLORS.white;
```

#### Text Colours

```typescript
// Primary text (headings, important content)
const primaryText = COLORS.black;  // #0F1112

// Body text
const bodyText = COLORS.grey[600];  // Derived mid-grey

// Secondary text (labels, captions)
const secondaryText = COLORS.grey[500];  // #B1B2B6

// Disabled text
const disabledText = COLORS.grey[400];  // Derived light grey
```

#### Interactive States

```typescript
// Default state
const buttonDefault = {
  background: COLORS.black,
  text: COLORS.white,
};

// Hover state
const buttonHover = {
  background: COLORS.grey[800],
  text: COLORS.white,
  shadow: COLOR_USAGE.shadows.base,
};

// Focus state (keyboard navigation)
const buttonFocus = {
  outline: `2px solid ${COLOR_USAGE.focusRing}`,
  outlineOffset: '2px',
  background: COLOR_USAGE.focusBackground,  // #FAF5FF
};

// Active/pressed state
const buttonActive = {
  transform: 'scale(0.98)',
  background: COLORS.grey[900],
};

// Disabled state
const buttonDisabled = {
  opacity: 0.5,
  cursor: 'not-allowed',
};
```

#### Input Field States

```typescript
// Default input
const inputDefault = {
  background: COLORS.white,
  border: `2px solid ${COLORS.grey[200]}`,
};

// Focus input
const inputFocus = {
  background: COLOR_USAGE.focusBackground,  // #FAF5FF
  border: `2px solid ${COLOR_USAGE.focusRing}`,  // #C084FC
  boxShadow: `0 0 0 3px ${COLORS.primary[100]}`,
};

// Error input
const inputError = {
  background: COLORS.white,
  border: `2px solid ${COLORS.state.error.border}`,
};

// Disabled input
const inputDisabled = {
  background: COLORS.grey[100],  // #F3F5F9
  border: `2px solid ${COLORS.grey[200]}`,
};
```

#### Hover States for Cards

```typescript
// Card with hover (interactive)
const cardHover = {
  default: {
    backgroundColor: COLORS.white,
    boxShadow: COLOR_USAGE.shadows.base,
  },
  hover: {
    backgroundColor: COLORS.white,
    boxShadow: COLOR_USAGE.shadows.md,
    cursor: 'pointer',
  },
};

// Pastel card with hover
const pastelCardHover = {
  default: {
    backgroundColor: COLORS.mint[100],
  },
  hover: {
    backgroundColor: COLORS.mint[200],
    cursor: 'pointer',
  },
};
```

#### Accordion/Section States

```typescript
// Accordion header default
const accordionDefault = {
  background: COLORS.white,
  border: `1px solid ${COLORS.grey[200]}`,
};

// Accordion header hover
const accordionHover = {
  background: COLORS.grey[100],
  border: `1px solid ${COLORS.grey[300]}`,
};

// Accordion content background
const accordionContent = COLORS.mint[100];  // #FAFAFC
```

#### Shadows

```typescript
// Use shadows to create depth hierarchy
const shadowLevels = {
  subtle: COLOR_USAGE.shadows.sm,   // 0 1px 2px rgba(15,17,18,0.05)
  base: COLOR_USAGE.shadows.base,   // 0 2px 8px rgba(15,17,18,0.04)
  medium: COLOR_USAGE.shadows.md,   // 0 4px 12px rgba(15,17,18,0.08)
  strong: COLOR_USAGE.shadows.lg,   // 0 8px 24px rgba(15,17,18,0.12)
};

// Apply shadows based on element importance
const elementShadows = {
  button: COLOR_USAGE.shadows.sm,
  card: COLOR_USAGE.shadows.base,
  cardHover: COLOR_USAGE.shadows.md,
  modal: COLOR_USAGE.shadows.lg,
};
```

#### Status Indicators

```typescript
// Status badge backgrounds (use state colours)
const statusBadges = {
  success: {
    background: COLORS.state.success.bg,
    text: COLORS.state.success.text,
    border: COLORS.state.success.border,
  },
  error: {
    background: COLORS.state.error.bg,
    text: COLORS.state.error.text,
    border: COLORS.state.error.border,
  },
  warning: {
    background: COLORS.state.warning.bg,
    text: COLORS.state.warning.text,
    border: COLORS.state.warning.border,
  },
  info: {
    background: COLORS.state.info.bg,
    text: COLORS.state.info.text,
    border: COLORS.state.info.border,
  },
};
```

#### Dividers and Borders

```typescript
// Subtle dividers
const subtleDivider = `1px solid ${COLORS.grey[200]}`;

// Prominent borders
const prominentBorder = `2px solid ${COLORS.black}`;

// Input borders
const inputBorder = `2px solid ${COLORS.grey[200]}`;

// Focus borders
const focusBorder = `2px solid ${COLOR_USAGE.focusRing}`;
```

### Accessibility Considerations

**Contrast Ratios:**
- All text on white backgrounds meets WCAG AA (4.5:1 minimum)
- Primary accent (C084FC) has sufficient contrast on white
- For text on primary background, use `primary.700` or darker
- State text colours are specifically chosen for WCAG AAA compliance

```typescript
// Accessible text on primary background
export const PRIMARY_TEXT_COLORS = {
  onPrimary400: COLORS.white,        // White on primary.400
  onPrimary300: COLORS.primary.700,  // Dark purple on lighter primary
  onPrimary200: COLORS.primary.800,  // Darker purple on very light primary
} as const;
```

---

## Typography System

### Font Stack

```typescript
export const FONT_FAMILY = {
  base: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
  // System fonts for maximum compatibility and lightweight plugin
} as const;
```

**Rationale:** Using system fonts eliminates the need to bundle custom fonts, keeping the plugin lightweight while maintaining professional appearance across platforms.

### Type Scale

```typescript
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
```

### Typography Utilities

```typescript
// Helper function to apply typography styles
export const applyTypography = (
  variant: keyof typeof TYPOGRAPHY
): React.CSSProperties => {
  return {
    fontFamily: FONT_FAMILY.base,
    ...TYPOGRAPHY[variant],
  };
};
```

---

## Spacing System

### Spacing Scale (4px base unit)

```typescript
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
```

---

## Component Library

### 1. Buttons

#### Primary Button

```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  loading = false,
}) => {
  const baseStyles: React.CSSProperties = {
    fontFamily: FONT_FAMILY.base,
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '20px',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 150ms ease',
    backgroundColor: COLORS.black,
    color: COLORS.white,
    opacity: disabled ? 0.5 : 1,
    boxShadow: COLOR_USAGE.shadows.sm,
  };

  return (
    <button
      style={baseStyles}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.backgroundColor = COLORS.grey[800];
          e.currentTarget.style.boxShadow = COLOR_USAGE.shadows.base;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = COLORS.black;
        e.currentTarget.style.boxShadow = COLOR_USAGE.shadows.sm;
      }}
      onMouseDown={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'scale(0.98)';
        }
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = `2px solid ${COLOR_USAGE.focusRing}`;
        e.currentTarget.style.outlineOffset = '2px';
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = 'none';
      }}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};
```

#### Secondary Button

```typescript
export const SecondaryButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  loading = false,
}) => {
  const baseStyles: React.CSSProperties = {
    fontFamily: FONT_FAMILY.base,
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '20px',
    padding: '12px 24px',
    borderRadius: '8px',
    border: `2px solid ${COLORS.black}`,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 150ms ease',
    backgroundColor: COLORS.white,
    color: COLORS.black,
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <button
      style={baseStyles}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.backgroundColor = COLORS.grey[100];
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = COLORS.white;
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = `2px solid ${COLOR_USAGE.focusRing}`;
        e.currentTarget.style.outlineOffset = '2px';
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = 'none';
      }}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};
```

#### Tertiary Button (text only)

```typescript
export const TertiaryButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
}) => {
  const baseStyles: React.CSSProperties = {
    fontFamily: FONT_FAMILY.base,
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '20px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 150ms ease',
    backgroundColor: 'transparent',
    color: COLORS.black,
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <button
      style={baseStyles}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = COLORS.grey[100];
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = `2px solid ${COLOR_USAGE.focusRing}`;
        e.currentTarget.style.outlineOffset = '2px';
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = 'none';
      }}
    >
      {children}
    </button>
  );
};
```

### 2. Cards

#### White Card Component

```typescript
interface CardProps {
  children: React.ReactNode;
  padding?: keyof typeof SPACING;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 6,
  onClick,
}) => {
  const styles: React.CSSProperties = {
    backgroundColor: COLORS.white,
    borderRadius: '16px',
    padding: SPACING[padding],
    boxShadow: COLOR_USAGE.shadows.base,
    transition: 'box-shadow 150ms ease',
    cursor: onClick ? 'pointer' : 'default',
  };

  return (
    <div
      style={styles}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = COLOR_USAGE.shadows.md;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = COLOR_USAGE.shadows.base;
      }}
    >
      {children}
    </div>
  );
};
```

#### Pastel Background Card

```typescript
type PastelColor = 'lavender' | 'mint' | 'blush' | 'grey';

interface PastelCardProps {
  children: React.ReactNode;
  color: PastelColor;
  padding?: keyof typeof SPACING;
}

export const PastelCard: React.FC<PastelCardProps> = ({
  children,
  color,
  padding = 6,
}) => {
  const colorMap = {
    lavender: COLORS.lavender[100],
    mint: COLORS.mint[100],
    blush: COLORS.blush[100],
    grey: COLORS.grey[100],
  };

  const styles: React.CSSProperties = {
    backgroundColor: colorMap[color],
    borderRadius: '16px',
    padding: SPACING[padding],
  };

  return <div style={styles}>{children}</div>;
};
```

#### Gradient Background Card

```typescript
type GradientVariant = keyof typeof GRADIENTS;

interface GradientCardProps {
  children: React.ReactNode;
  gradient: GradientVariant;
  padding?: keyof typeof SPACING;
}

export const GradientCard: React.FC<GradientCardProps> = ({
  children,
  gradient,
  padding = 6,
}) => {
  const styles: React.CSSProperties = {
    background: GRADIENTS[gradient],
    borderRadius: '16px',
    padding: SPACING[padding],
  };

  return <div style={styles}>{children}</div>;
};
```

### 3. Metric Cards (Stat Display)

```typescript
interface MetricCardProps {
  value: string | number;
  label: string;
  gradient?: GradientVariant;
  pastelColor?: PastelColor;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  gradient,
  pastelColor,
}) => {
  const getBackground = (): string => {
    if (gradient) return GRADIENTS[gradient];
    if (pastelColor) {
      const colorMap = {
        lavender: COLORS.lavender[100],
        mint: COLORS.mint[100],
        blush: COLORS.blush[100],
        grey: COLORS.grey[100],
      };
      return colorMap[pastelColor];
    }
    return COLORS.white;
  };

  const containerStyles: React.CSSProperties = {
    background: getBackground(),
    borderRadius: '16px',
    padding: SPACING[6],
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING[1],
    minWidth: '120px',
    boxShadow: gradient || pastelColor ? 'none' : COLOR_USAGE.shadows.base,
  };

  return (
    <div style={containerStyles}>
      <div style={applyTypography('metric')}>{value}</div>
      <div style={applyTypography('metricLabel')}>{label}</div>
    </div>
  );
};
```

### 4. Status Badges

```typescript
type StatusVariant = 'success' | 'error' | 'warning' | 'info';

interface StatusBadgeProps {
  children: React.ReactNode;
  variant: StatusVariant;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  children,
  variant,
}) => {
  const colors = COLORS.state[variant];
  
  const styles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '24px',
    backgroundColor: colors.bg,
    color: colors.text,
    border: `1px solid ${colors.border}`,
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '16px',
  };

  return <span style={styles}>{children}</span>;
};
```

### 5. Input Fields

```typescript
interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  error = false,
  helperText,
}) => {
  const inputStyles: React.CSSProperties = {
    fontFamily: FONT_FAMILY.base,
    fontSize: '14px',
    lineHeight: '20px',
    padding: '12px 16px',
    borderRadius: '8px',
    border: `2px solid ${error ? COLORS.state.error.border : COLORS.grey[200]}`,
    backgroundColor: disabled ? COLORS.grey[100] : COLORS.white,
    color: COLORS.grey[900],
    width: '100%',
    boxSizing: 'border-box' as const,
    transition: 'all 150ms ease',
    outline: 'none',
  };

  const helperStyles: React.CSSProperties = {
    ...applyTypography('caption'),
    color: error ? COLORS.state.error.text : COLORS.grey[500],
    marginTop: SPACING[1],
  };

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={inputStyles}
        onFocus={(e) => {
          if (!error) {
            e.currentTarget.style.borderColor = COLOR_USAGE.focusRing;
            e.currentTarget.style.backgroundColor = COLOR_USAGE.focusBackground;
            e.currentTarget.style.boxShadow = `0 0 0 3px ${COLORS.primary[100]}`;
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error
            ? COLORS.state.error.border
            : COLORS.grey[200];
          e.currentTarget.style.backgroundColor = disabled ? COLORS.grey[100] : COLORS.white;
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      {helperText && <div style={helperStyles}>{helperText}</div>}
    </div>
  );
};
```

### 6. Tab Navigation

```typescript
interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    gap: SPACING[2],
    borderBottom: `1px solid ${COLORS.grey[200]}`,
  };

  const getTabStyles = (isActive: boolean): React.CSSProperties => ({
    fontFamily: FONT_FAMILY.base,
    fontSize: '14px',
    fontWeight: isActive ? 600 : 400,
    lineHeight: '20px',
    padding: '12px 16px',
    border: 'none',
    backgroundColor: 'transparent',
    color: isActive ? COLORS.black : COLORS.grey[600],
    borderBottom: `2px solid ${isActive ? COLORS.black : 'transparent'}`,
    cursor: 'pointer',
    transition: 'all 150ms ease',
    marginBottom: '-1px',
  });

  return (
    <div style={containerStyles}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          style={getTabStyles(tab.id === activeTab)}
          onClick={() => onChange(tab.id)}
          onMouseEnter={(e) => {
            if (tab.id !== activeTab) {
              e.currentTarget.style.color = COLORS.black;
            }
          }}
          onMouseLeave={(e) => {
            if (tab.id !== activeTab) {
              e.currentTarget.style.color = COLORS.grey[600];
            }
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
```

### 7. Accordion/Collapsible Section

```typescript
interface AccordionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  icon?: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  isOpen,
  onToggle,
  icon,
}) => {
  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING[4],
    cursor: 'pointer',
    backgroundColor: COLORS.white,
    borderRadius: '8px',
    border: `1px solid ${COLORS.grey[200]}`,
    transition: 'all 150ms ease',
  };

  const titleContainerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING[2],
  };

  const contentStyles: React.CSSProperties = {
    padding: SPACING[4],
    backgroundColor: COLORS.mint[100],
    borderRadius: '0 0 8px 8px',
    marginTop: SPACING[2],
  };

  return (
    <div>
      <div
        style={headerStyles}
        onClick={onToggle}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = COLORS.grey[100];
          e.currentTarget.style.borderColor = COLORS.grey[300];
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = COLORS.white;
          e.currentTarget.style.borderColor = COLORS.grey[200];
        }}
      >
        <div style={titleContainerStyles}>
          {icon}
          <span style={applyTypography('label')}>{title}</span>
        </div>
        <span style={{ 
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', 
          transition: 'transform 150ms ease',
          color: COLORS.grey[500],
        }}>
          ▼
        </span>
      </div>
      {isOpen && <div style={contentStyles}>{children}</div>}
    </div>
  );
};
```

---

## State Management

### Interactive States

```typescript
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
```

### Loading State

```typescript
export const LoadingSpinner: React.FC = () => {
  const spinnerStyles: React.CSSProperties = {
    width: '24px',
    height: '24px',
    border: `3px solid ${COLORS.grey[200]}`,
    borderTop: `3px solid ${COLORS.primary[400]}`,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  };

  // Inject keyframes animation
  const styleSheet = document.styleSheets[0];
  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  
  if (!document.querySelector('[data-spin-animation]')) {
    const style = document.createElement('style');
    style.setAttribute('data-spin-animation', 'true');
    style.textContent = keyframes;
    document.head.appendChild(style);
  }

  return <div style={spinnerStyles} />;
};
```

### Line Loader (Progress Bar)

```typescript
interface LineLoaderProps {
  progress?: number; // 0-100, undefined for indeterminate
}

export const LineLoader: React.FC<LineLoaderProps> = ({ progress }) => {
  const containerStyles: React.CSSProperties = {
    width: '100%',
    height: '4px',
    backgroundColor: COLORS.grey[200],
    borderRadius: '2px',
    overflow: 'hidden',
  };

  const barStyles: React.CSSProperties = {
    height: '100%',
    backgroundColor: COLORS.primary[400],
    borderRadius: '2px',
    width: progress !== undefined ? `${progress}%` : '30%',
    transition: progress !== undefined ? 'width 300ms ease' : 'none',
    animation: progress === undefined ? 'loading 1.5s ease-in-out infinite' : 'none',
  };

  // Inject keyframes for indeterminate animation
  if (progress === undefined && !document.querySelector('[data-loading-animation]')) {
    const style = document.createElement('style');
    style.setAttribute('data-loading-animation', 'true');
    style.textContent = `
      @keyframes loading {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
    `;
    document.head.appendChild(style);
  }

  return (
    <div style={containerStyles}>
      <div style={barStyles} />
    </div>
  );
};
```

---

## Icons

### Icon System (Phosphor Icons)

**Icon Configuration:**
- **Library:** Phosphor Icons
- **Stroke Weight:** 2px
- **Default Size:** 20px × 20px
- **Colour:** Inherit from parent or COLORS.grey[700]

```typescript
export const ICON_CONFIG = {
  size: 20,
  strokeWidth: 2,
  color: COLORS.grey[700],
} as const;

// Icon wrapper component
interface IconProps {
  children: React.ReactNode;
  size?: number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({
  children,
  size = ICON_CONFIG.size,
  color = ICON_CONFIG.color,
}) => {
  const styles: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: color,
    flexShrink: 0,
  };

  return <span style={styles}>{children}</span>;
};
```

**Implementation Note:**
Install Phosphor Icons: `npm install phosphor-react` or use Phosphor SVGs directly to minimize bundle size.

Example usage:
```typescript
import { GithubLogo, Download, Rocket } from 'phosphor-react';

<Icon><GithubLogo weight="regular" /></Icon>
```

### Common Icon Patterns

```typescript
// Icon with text
export const IconWithText: React.FC<{
  icon: React.ReactNode;
  text: string;
}> = ({ icon, text }) => {
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING[2],
  };

  return (
    <div style={containerStyles}>
      <Icon>{icon}</Icon>
      <span style={applyTypography('body')}>{text}</span>
    </div>
  );
};
```

---

## Animation & Transitions

### Transition Timing

```typescript
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
```

### Animation Patterns

```typescript
// Fade in animation
export const fadeIn: React.CSSProperties = {
  animation: 'fadeIn 300ms ease-out',
};

// Scale in animation
export const scaleIn: React.CSSProperties = {
  animation: 'scaleIn 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
};

// Inject animation keyframes
const animations = `
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
`;

// Add to document head once
if (!document.querySelector('[data-animations]')) {
  const style = document.createElement('style');
  style.setAttribute('data-animations', 'true');
  style.textContent = animations;
  document.head.appendChild(style);
}
```

---

## Implementation Examples

### Landing Page

```typescript
export const LandingPage: React.FC = () => {
  return (
    <div style={{
      padding: SPACING[6],
      display: 'flex',
      flexDirection: 'column',
      gap: SPACING[6],
    }}>
      {/* Header with gradient background */}
      <GradientCard gradient="lavenderMedium" padding={6}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: SPACING[3],
          marginBottom: SPACING[4],
        }}>
          <Icon><Rocket weight="regular" /></Icon>
          <h1 style={applyTypography('h1')}>Design Tokens Extracted!</h1>
        </div>
        <p style={{
          ...applyTypography('body'),
          color: COLORS.grey[600],
        }}>
          Choose how you'd like to export your design tokens
        </p>
      </GradientCard>

      {/* Metrics row */}
      <div style={{
        display: 'flex',
        gap: SPACING[4],
      }}>
        <MetricCard
          value="3486"
          label="Total Tokens"
          gradient="lavenderLight"
        />
        <MetricCard
          value="2342.2 KB"
          label="File Size"
          gradient="blushLight"
        />
        <MetricCard
          value="5s"
          label="Duration"
          gradient="mintLight"
        />
      </div>

      {/* Action cards */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: SPACING[4],
      }}>
        <Card>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING[2] }}>
              <IconWithText
                icon={<GithubLogo weight="regular" />}
                text="Push to GitHub"
              />
              <p style={{
                ...applyTypography('bodySmall'),
                color: COLORS.grey[600],
              }}>
                Push tokens directly to your GitHub repository with automated commits
              </p>
            </div>
            <StatusBadge variant="success">Ready</StatusBadge>
          </div>
        </Card>

        <Card>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING[2] }}>
              <IconWithText
                icon={<Download weight="regular" />}
                text="Download JSON File"
              />
              <p style={{
                ...applyTypography('bodySmall'),
                color: COLORS.grey[600],
              }}>
                Download tokens as JSON file for manual processing or integration
              </p>
            </div>
            <StatusBadge variant="info">Always Available</StatusBadge>
          </div>
        </Card>
      </div>
    </div>
  );
};
```

### Loading Screen

```typescript
export const LoadingScreen: React.FC = () => {
  return (
    <GradientCard
      gradient="lavenderMedium"
      padding={8}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: SPACING[6],
      }}>
        {/* Animated icon */}
        <div style={{
          ...scaleIn,
        }}>
          <Icon size={64}>
            <Palette weight="regular" />
          </Icon>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: SPACING[2],
        }}>
          <h2 style={applyTypography('h2')}>Design System Distributor</h2>
          <LoadingSpinner />
        </div>

        {/* Progress bar */}
        <div style={{ width: '240px' }}>
          <LineLoader />
        </div>
      </div>
    </GradientCard>
  );
};
```

### GitHub Setup Options

```typescript
export const GitHubSetup: React.FC = () => {
  const [openAccordion, setOpenAccordion] = React.useState<string | null>(null);

  return (
    <div style={{
      padding: SPACING[6],
      display: 'flex',
      flexDirection: 'column',
      gap: SPACING[4],
    }}>
      <Tabs
        tabs={[
          { id: 'export', label: 'Export Options' },
          { id: 'github', label: 'GitHub Setup' },
        ]}
        activeTab="github"
        onChange={(id) => console.log(id)}
      />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: SPACING[3],
      }}>
        <Card padding={4}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: SPACING[2],
            marginBottom: SPACING[2],
          }}>
            <Icon><CheckCircle weight="regular" color={COLORS.state.success.text} /></Icon>
            <h3 style={applyTypography('h4')}>GitHub Configured</h3>
          </div>
          <p style={{
            ...applyTypography('bodySmall'),
            color: COLORS.grey[600],
          }}>
            You can update your configuration below if needed
          </p>
        </Card>

        <Accordion
          title="GitHub Personal Access Token"
          isOpen={openAccordion === 'token'}
          onToggle={() => setOpenAccordion(openAccordion === 'token' ? null : 'token')}
          icon={<Icon><Key weight="regular" /></Icon>}
        >
          <Input
            value=""
            onChange={(v) => console.log(v)}
            placeholder="ghp_xxxxxxxxxxxx"
          />
        </Accordion>

        <Accordion
          title="Repository Configuration"
          isOpen={openAccordion === 'repo'}
          onToggle={() => setOpenAccordion(openAccordion === 'repo' ? null : 'repo')}
          icon={<Icon><FolderOpen weight="regular" /></Icon>}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: SPACING[3],
          }}>
            <Input
              value="owner/repository"
              onChange={(v) => console.log(v)}
              placeholder="owner/repository"
            />
            <Input
              value="main"
              onChange={(v) => console.log(v)}
              placeholder="Branch name"
            />
          </div>
        </Accordion>

        <Accordion
          title="File Paths & Settings"
          isOpen={openAccordion === 'paths'}
          onToggle={() => setOpenAccordion(openAccordion === 'paths' ? null : 'paths')}
          icon={<Icon><Path weight="regular" /></Icon>}
        >
          <Input
            value="SilvT/ds-output → tokens/raw/"
            onChange={(v) => console.log(v)}
            helperText="Configure where tokens should be saved in your repository"
          />
        </Accordion>
      </div>

      <div style={{
        display: 'flex',
        gap: SPACING[3],
        marginTop: SPACING[4],
      }}>
        <SecondaryButton>Reset</SecondaryButton>
        <PrimaryButton>Complete Setup</PrimaryButton>
      </div>
    </div>
  );
};
```

---

## Priority Implementation Roadmap

### Phase 1: Foundation (Priority 1)
**Timeline:** Week 1

1. **Set up design tokens file**
   - Create `tokens.ts` with all colour, typography, and spacing values
   - Export all constants for use throughout the application

2. **Implement base components**
   - PrimaryButton, SecondaryButton, TertiaryButton
   - Card, GradientCard
   - Input component
   - Icon wrapper

3. **Create loading states**
   - LoadingSpinner component
   - LineLoader component
   - LoadingScreen layout

### Phase 2: Core Screens (Priority 2)
**Timeline:** Week 2

1. **Landing page redesign**
   - Implement gradient header
   - Add MetricCard components
   - Update action cards with new styling

2. **GitHub setup flow**
   - Implement Tabs component
   - Create Accordion component
   - Update form layouts

### Phase 3: Polish & States (Priority 3)
**Timeline:** Week 3

1. **Interactive states**
   - Add hover/focus/active states to all interactive elements
   - Implement keyboard navigation focus indicators
   - Add loading states to all async actions

2. **Status indicators**
   - StatusBadge component
   - Success/error/warning states
   - Progress indicators

3. **Animations**
   - Add fade-in animations to page transitions
   - Implement scale-in for modals
   - Add smooth transitions to accordions and tabs

### Phase 4: Optimization (Priority 4)
**Timeline:** Week 4

1. **Performance audit**
   - Minimize bundle size
   - Optimize icon imports
   - Review and remove unused code

2. **Accessibility audit**
   - Test keyboard navigation
   - Verify colour contrast ratios
   - Add ARIA labels where needed

3. **Cross-browser testing**
   - Test in Chrome, Firefox, Safari
   - Verify Figma desktop app compatibility

---

## Additional Notes

### Component Library Decision

**Should you use a component library?**

Given your requirement to keep the plugin lightweight, I recommend **NOT using a component library**. Here's why:

**Pros of no library:**
- Minimal bundle size (critical for plugin performance)
- Complete control over styling
- No dependency management
- No version conflicts
- Faster load times

**Cons of no library:**
- Need to build components from scratch
- More initial development time
- Maintain your own components

**Recommendation:** The components provided in this guide are intentionally simple and self-contained. They give you a professional appearance without the overhead of a full component library. The time investment upfront will pay off in plugin performance and maintainability.

### File Organization

```
src/
├── design-system/
│   ├── tokens.ts              # All design tokens
│   ├── typography.ts          # Typography utilities
│   ├── animations.ts          # Animation keyframes
│   └── components/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Tabs.tsx
│       ├── Accordion.tsx
│       ├── StatusBadge.tsx
│       ├── MetricCard.tsx
│       ├── Icon.tsx
│       ├── LoadingSpinner.tsx
│       └── LineLoader.tsx
├── screens/
│   ├── LandingPage.tsx
│   ├── LoadingScreen.tsx
│   └── GitHubSetup.tsx
└── main.tsx
```

### Testing Checklist

Before deploying the redesign, verify:

- [ ] All interactive elements have hover states
- [ ] Focus indicators are visible for keyboard navigation
- [ ] Colours meet WCAG AA contrast requirements
- [ ] Loading states work correctly
- [ ] Error states are properly styled
- [ ] Plugin window resizes gracefully
- [ ] All gradients render correctly
- [ ] Icons display at correct size and weight
- [ ] Typography is consistent throughout
- [ ] Spacing follows the 4px grid
- [ ] Transitions are smooth (not jarring)
- [ ] Plugin loads quickly (<2s initial load)

---

## Conclusion

This design system provides a complete, implementation-ready foundation for your Figma plugin redesign. The soft pastel aesthetic combined with high-contrast elements creates a professional, approachable tool that will stand out in the Figma Community.

All specifications are TypeScript-native and designed for minimal bundle size. No external dependencies beyond Phosphor icons are required, keeping your plugin lightweight and performant.

For questions or clarifications during implementation, refer back to the specific sections of this guide or consult the example implementations provided.