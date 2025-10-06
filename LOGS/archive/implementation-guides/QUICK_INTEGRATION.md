# Quick Integration Guide

## 🚀 **Add Export Choice to Your Plugin**

Replace step 7 in your existing main.ts with the export choice workflow.

### Current Code (main.ts around line 545-547):

```typescript
// Step 7: Setup JSON file download
console.log('Step 7: Setting up JSON file download...');
await downloadJSONFile(extractionResult, documentInfo, extractionDuration);
console.log('✓ JSON download setup completed');
```

### Replace With:

```typescript
// Step 7: Show export choice and handle user selection
console.log('Step 7: Starting export choice workflow...');
const { ExportWorkflow } = await import('./workflow/ExportWorkflow');

const workflow = new ExportWorkflow({
  tokenExtractor: new TokenExtractor(config), // Use your existing config
  documentInfo
});

const workflowResult = await workflow.runWorkflow();

if (workflowResult.success) {
  console.log(`✅ Export completed via ${workflowResult.choice}`);
} else {
  console.error(`❌ Export failed: ${workflowResult.error}`);
  figma.notify(`Export failed: ${workflowResult.error}`, { error: true });
}
console.log('✓ Export workflow completed');
```

### Required Imports (add to top of main.ts):

```typescript
import { DocumentInfo, BasicTokenCount } from './types/CommonTypes';
```

## 🎯 **What Users Will See**

1. **Token extraction happens normally** ✅
2. **New choice interface appears** with:
   - 🚀 **Push to GitHub** (if configured)
   - 💾 **Download JSON File** (always available)
   - Statistics showing extracted token counts
3. **Users choose their preferred export method**
4. **Plugin handles the choice automatically**

## 🔧 **Testing Steps**

1. **Update your main.ts** with the code above
2. **Run `npm run build`** to compile
3. **Test in Figma:**
   - Run the plugin on a document with design tokens
   - Verify the choice interface appears after extraction
   - Test both download and Git push (if configured)

## 📋 **Complete Integration Checklist**

- [ ] Add import for CommonTypes
- [ ] Replace downloadJSONFile call with ExportWorkflow
- [ ] Test build compiles successfully
- [ ] Test choice interface appears
- [ ] Test download option works
- [ ] Test Git push option (if GitHub configured)
- [ ] Verify error handling works

## 🆘 **If You Need Help**

The complete implementation is in:
- `src/MainWithChoice.ts` - Complete enhanced main function
- `EXPORT_CHOICE_INTEGRATION.md` - Detailed integration guide

You can also use the drop-in replacement:

```typescript
// Replace your entire main function with:
import { enhancedMain } from './MainWithChoice';

figma.on('run', enhancedMain);
```

This gives you the complete workflow with minimal changes! 🎉