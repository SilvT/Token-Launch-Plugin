import { FONT_FAMILY, TYPOGRAPHY } from './tokens';

// Helper function to apply typography styles as CSS string
export const applyTypography = (
  variant: keyof typeof TYPOGRAPHY
): string => {
  const styles = TYPOGRAPHY[variant] as any;
  return `
    font-family: ${FONT_FAMILY.base};
    font-size: ${styles.fontSize};
    line-height: ${styles.lineHeight};
    font-weight: ${styles.fontWeight};
    letter-spacing: ${styles.letterSpacing};
    ${styles.color ? `color: ${styles.color};` : ''}
    ${styles.textTransform ? `text-transform: ${styles.textTransform};` : ''}
  `.replace(/\s+/g, ' ').trim();
};

// Helper function to get typography as object for inline styles
export const getTypographyStyles = (
  variant: keyof typeof TYPOGRAPHY
): Record<string, string | number> => {
  return {
    fontFamily: FONT_FAMILY.base,
    ...TYPOGRAPHY[variant],
  };
};