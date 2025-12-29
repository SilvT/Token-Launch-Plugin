/**
 * Phosphor Icons Integration for Figma Plugin
 *
 * Since this is a vanilla HTML/JS environment, we'll use the phosphor-icons
 * library via CDN and create helper functions for common icons.
 */

// Map of emoji to phosphor icon names
export const EMOJI_TO_ICON_MAP = {
  '🎨': 'palette',
  '🎉': 'party-popper',
  '🚀': 'rocket-launch',
  '🔗': 'link',
  '💾': 'download-simple',
  '📄': 'file-text',
  '🚫': 'prohibit',
  '💡': 'lightbulb',
  '⚠️': 'warning',
  '✓': 'check',
  '✅': 'check-circle',
  '❌': 'x-circle',
  '🔄': 'arrow-clockwise',
  '📁': 'folder',
  '🐛': 'bug',
  '🛠️': 'wrench',
  '⭐': 'star',
  '🌟': 'sparkle',
} as const;

/**
 * Generate phosphor icon HTML using CDN
 * @param iconName - Phosphor icon name
 * @param options - Icon options (size, color, weight, etc.)
 * @returns HTML string for the icon
 */
export const createPhosphorIcon = (
  iconName: string,
  options: {
    size?: number;
    color?: string;
    weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
    className?: string;
  } = {}
): string => {
  const size = options.size || 20;
  const color = options.color || 'currentColor';
  const weight = options.weight || 'regular';
  const className = options.className || '';

  // Using phosphor icons via CDN with data-weight attribute
  return `<i class="ph-${iconName} ${className}" data-weight="${weight}"
    style="font-size: ${size}px; color: ${color};"></i>`;
};

/**
 * Generate phosphor icon HTML from emoji
 * @param emoji - Original emoji
 * @param options - Icon options
 * @returns HTML string for the equivalent phosphor icon
 */
export const createIconFromEmoji = (
  emoji: string,
  options: {
    size?: number;
    color?: string;
    weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
    className?: string;
  } = {}
): string => {
  const iconName = EMOJI_TO_ICON_MAP[emoji as keyof typeof EMOJI_TO_ICON_MAP];

  if (!iconName) {
    console.warn(`No phosphor icon mapping found for emoji: ${emoji}`);
    return emoji; // Fallback to original emoji
  }

  return createPhosphorIcon(iconName, options);
};

/**
 * Generate the phosphor icons CDN link to include in HTML head
 * @returns HTML link tag for phosphor icons CSS
 */
export const getPhosphorIconsCDN = (): string => {
  return '<link href="https://unpkg.com/phosphor-icons@1.4.2/src/css/icons.css" rel="stylesheet">';
};

/**
 * Common icon shortcuts for the design system
 */
export const ICONS = {
  // App/System icons
  PALETTE: () => createPhosphorIcon('palette', { size: 64, weight: 'duotone' }),
  ROCKET: () => createPhosphorIcon('rocket-launch', { size: 48, weight: 'duotone' }),

  // Action icons
  DOWNLOAD: () => createPhosphorIcon('download-simple', { size: 20, weight: 'bold' }),
  LINK: () => createPhosphorIcon('link', { size: 20, weight: 'bold' }),
  CHECK: () => createPhosphorIcon('check', { size: 16, weight: 'bold' }),
  CHECK_CIRCLE: () => createPhosphorIcon('check-circle', { size: 20, weight: 'fill' }),
  X_CIRCLE: () => createPhosphorIcon('x-circle', { size: 20, weight: 'fill' }),
  WARNING: () => createPhosphorIcon('warning', { size: 20, weight: 'fill' }),

  // File/Data icons
  FILE_TEXT: () => createPhosphorIcon('file-text', { size: 20, weight: 'regular' }),
  FOLDER: () => createPhosphorIcon('folder', { size: 20, weight: 'regular' }),

  // UI icons
  LIGHTBULB: () => createPhosphorIcon('lightbulb', { size: 16, weight: 'fill' }),
  PROHIBIT: () => createPhosphorIcon('prohibit', { size: 20, weight: 'fill' }),

} as const;