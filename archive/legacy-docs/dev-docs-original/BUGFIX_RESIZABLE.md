# Bug Fix: Removed Unsupported 'resizable' Property

## Issue
The plugin was failing to open UI windows with the following error:
```
❌ Export failed: in showUI: Property "showUI options" failed validation:
Unrecognized key(s) in object: 'resizable'
```

## Root Cause
In [src/ui/constants.ts](src/ui/constants.ts), the `STANDARD_WINDOW_OPTIONS` object included a `resizable: false` property:

```typescript
// BEFORE (incorrect)
export const STANDARD_WINDOW_OPTIONS = {
  width: WINDOW_SIZE.width,
  height: WINDOW_SIZE.height,
  themeColors: true,
  resizable: false  // ❌ Not supported by Figma API
} as const;
```

However, Figma's `figma.showUI()` API does not support a `resizable` property. The valid options are:
- `width` (number)
- `height` (number)
- `title` (string, optional)
- `themeColors` (boolean, optional)
- `position` (object, optional)
- `visible` (boolean, optional)

## Solution
Removed the unsupported `resizable` property from the constants:

```typescript
// AFTER (correct)
export const STANDARD_WINDOW_OPTIONS = {
  width: WINDOW_SIZE.width,
  height: WINDOW_SIZE.height,
  themeColors: true  // ✅ Only valid properties
} as const;
```

## Files Changed
- **[src/ui/constants.ts](src/ui/constants.ts:1-46)** - Removed `resizable: false` from `STANDARD_WINDOW_OPTIONS`
- **[docs/UI_STANDARDIZATION.md](docs/UI_STANDARDIZATION.md:19-42)** - Updated documentation to reflect the change

## Impact
This fix affects all UI components that use the standardized window options:
- ✅ UnifiedExportUI
- ✅ ErrorDialog
- ✅ ExportChoiceUI
- ✅ PRWorkflowUI (main and success modals)
- ✅ GitHubSetupUI

All windows will now open correctly without validation errors.

## Testing
After the fix:
1. ✅ Build successful with no TypeScript errors
2. ✅ All UI windows open without errors
3. ✅ Test error dialog buttons work correctly
4. ✅ No console errors related to showUI options

## Figma API Reference
According to the Figma Plugin API documentation, the valid options for `figma.showUI()` are:

```typescript
interface ShowUIOptions {
  width?: number;
  height?: number;
  title?: string;
  themeColors?: boolean;
  position?: { x: number; y: number };
  visible?: boolean;
}
```

The `resizable` property is not part of the API and will cause validation errors if used.

## Prevention
To prevent similar issues in the future:
1. Always check the Figma Plugin API documentation when using Figma APIs
2. Test plugin behavior after adding new properties to shared constants
3. Check browser console for validation errors during development

## Related Documentation
- [UI Standardization](UI_STANDARDIZATION.md) - Window sizing standards
- [Error Testing](ERROR_TESTING.md) - Error dialog testing guide
- [Figma Plugin API Docs](https://www.figma.com/plugin-docs/api/figma-ui/#showui) - Official API reference

---

**Fixed**: 2025-10-31
**Severity**: High (Blocking)
**Status**: Resolved ✅
