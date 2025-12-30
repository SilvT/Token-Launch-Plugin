# UI Standardization Implementation

## Overview
This document describes the changes made to standardize window sizing and styling across all plugin UI components.

## Problem
Before standardization, different UI windows had inconsistent dimensions:
- **UnifiedExportUI**: 640x800
- **ErrorDialog**: 560x640
- **ExportChoiceUI**: 500x600
- **PRWorkflowUI**: 600x700 (main), 500x450 (success)
- **GitHubSetupUI**: 640x720
- **Main downloadJSONFile**: 450x300

This created a jarring user experience with windows constantly resizing between different flows.

## Solution

### 1. Created UI Constants Module
**File**: `src/ui/constants.ts`

Defines standard window dimensions and configuration:
```typescript
export const WINDOW_SIZE = {
  width: 640,
  height: 800
} as const;

export const STANDARD_WINDOW_OPTIONS = {
  width: WINDOW_SIZE.width,
  height: WINDOW_SIZE.height,
  themeColors: true
} as const;

export function getWindowOptions(title?: string): {...}
```

**Key Features**:
- Consistent 640x800 window size across all flows
- Theme colors enabled for Figma integration
- Optional custom titles
- Note: Figma's `showUI` API does not support a `resizable` property

### 2. Updated All UI Components

Modified the following files to use the standardized window options:

#### UnifiedExportUI.ts
- Import: `import { getWindowOptions } from './constants'`
- Changed from: `figma.showUI(htmlContent, { width: 640, height: 800, themeColors: true })`
- Changed to: `figma.showUI(htmlContent, getWindowOptions('Export Design Tokens'))`

#### ErrorDialog.ts
- Import: `import { getWindowOptions } from './constants'`
- Changed from: `figma.showUI(html, { width: 560, height: 640, title: ... })`
- Changed to: `figma.showUI(html, getWindowOptions(\`Error: ${this.options.error.title}\`))`

#### ExportChoiceUI.ts
- Import: `import { getWindowOptions } from './constants'`
- Changed from: `figma.showUI(htmlContent, { width: 500, height: 600, title: 'Export Design Tokens' })`
- Changed to: `figma.showUI(htmlContent, getWindowOptions('Export Design Tokens'))`

#### PRWorkflowUI.ts
- Import: `import { getWindowOptions } from './constants'`
- Changed from: `figma.showUI(html, { width: 600, height: 700, themeColors: true })`
- Changed to: `figma.showUI(html, getWindowOptions('Push Tokens to GitHub'))`
- Success modal also updated to use: `getWindowOptions('Success')`

#### GitHubSetupUI.ts
- Import: `import { getWindowOptions } from './constants'`
- Changed from: `figma.showUI(htmlContent, { width: 640, height: 720, themeColors: true })`
- Changed to: `figma.showUI(htmlContent, getWindowOptions('GitHub Integration Setup'))`

## Benefits

### User Experience
✅ **Consistent window size** - No more jarring resizing between different plugin screens
✅ **Predictable layout** - Content is always positioned the same way
✅ **Professional appearance** - Uniform sizing across all flows

### Developer Experience
✅ **Single source of truth** - Window dimensions defined in one place
✅ **Easy to maintain** - Change once, apply everywhere
✅ **Type safety** - TypeScript ensures correct usage
✅ **Cleaner code** - Less duplication of window configuration

### Styling Consistency
The existing theme system in `src/ui/styles/theme.ts` already provides:
- Unified color palette
- Consistent spacing
- Standard typography
- Shared component styles
- CSS custom properties

Combined with standardized window sizing, this creates a fully unified UI experience.

## Testing

All changes have been validated:
- ✅ TypeScript compilation successful
- ✅ Build process completed without errors
- ✅ All UI components now use standardized dimensions
- ✅ Theme integration maintained

## Future Improvements

1. **Responsive layouts**: Consider adding viewport-based sizing for different screen sizes
2. **Accessibility**: Add keyboard navigation and screen reader support
3. **Animations**: Add consistent transitions between modal states
4. **Component library**: Extract common UI patterns into reusable components

## Migration Guide

For any new UI components, use this pattern:

```typescript
import { getWindowOptions } from './constants';

// In your UI creation method:
figma.showUI(htmlContent, getWindowOptions('Your Window Title'));
```

Do not hardcode window dimensions. Always use `getWindowOptions()`.

---

**Last Updated**: 2025-10-31
**Version**: 1.0.0
