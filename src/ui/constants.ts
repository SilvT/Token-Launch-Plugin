/**
 * UI Constants - Standardized dimensions and settings for all UI components
 *
 * Ensures consistent window sizing and theming across all plugin flows
 */

import { PLUGIN_DIMENSIONS } from '../design-system/tokens';

// =============================================================================
// WINDOW DIMENSIONS
// =============================================================================

/**
 * Standard window dimensions for all plugin UI windows
 * Now using the new design system dimensions
 */
export const WINDOW_SIZE = {
  width: PLUGIN_DIMENSIONS.DEFAULT_WIDTH,
  height: PLUGIN_DIMENSIONS.DEFAULT_HEIGHT
} as const;

/**
 * Standard window options for figma.showUI
 * Note: resizable is not supported in Figma's showUI API
 */
export const STANDARD_WINDOW_OPTIONS = {
  width: WINDOW_SIZE.width,
  height: WINDOW_SIZE.height,
  themeColors: true
} as const;

// =============================================================================
// THEME INTEGRATION
// =============================================================================

/**
 * Get standard window options with custom title
 */
export function getWindowOptions(title?: string): {
  width: number;
  height: number;
  themeColors: boolean;
  title?: string;
} {
  return {
    ...STANDARD_WINDOW_OPTIONS,
    ...(title && { title })
  };
}
