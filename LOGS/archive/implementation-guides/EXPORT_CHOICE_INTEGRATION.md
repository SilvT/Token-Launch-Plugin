# Export Choice UI Integration

This guide shows how to integrate the new export choice UI (Git Push vs Download) into your existing Figma plugin.

## 🎯 **What's New**

Users now see a choice interface after token extraction:

- **🚀 Push to GitHub** - Direct push to your ds-distributor repository
- **💾 Download JSON** - Traditional local file download
- **❌ Cancel** - Cancel the operation

## 🏗️ **New Components**

### 1. **ExportChoiceUI** (`src/ui/ExportChoiceUI.ts`)
- Beautiful choice interface with token statistics
- Git status indication (configured/not configured)
- Repository information display
- Loading states and progress feedback

### 2. **ExportWorkflow** (`src/workflow/ExportWorkflow.ts`)
- Complete workflow management
- Handles extraction → choice → action flow
- Error handling and fallback scenarios
- Service initialization

### 3. **MainWithChoice** (`src/MainWithChoice.ts`)
- Enhanced main function with choice workflow
- Drop-in replacement for existing main function

## 🔧 **Integration Options**

### Option 1: Complete Replacement (Recommended)

Replace your current main function with the enhanced version:

```typescript
// In your main.ts, replace the main function
import { enhancedMain } from './MainWithChoice';

figma.on('run', async () => {
  await enhancedMain();
});
```

### Option 2: Gradual Migration

Keep both options available:

```typescript
// In your main.ts
import { runWithChoice } from './MainWithChoice';

figma.on('run', async () => {
  try {
    // Try the new workflow first
    await runWithChoice();
  } catch (error) {
    console.log('Falling back to original workflow...');
    // Run your original main() function
    await originalMain();
  }
});
```

### Option 3: Add to Existing Workflow

Integrate choice UI into your existing extraction workflow:

```typescript
// After your existing token extraction
import { ExportChoiceUI } from './ui/ExportChoiceUI';
import { TokenPushService } from './github/TokenPushService';

// Your existing extraction code...
const extractionResult = await tokenExtractor.extractAllTokens();

// Add choice UI
const choiceUI = new ExportChoiceUI({
  extractionResult,
  documentInfo,
  extractionDuration,
  hasGitConfigured: await checkGitStatus(),
  gitRepository: 'SilvT/ds-distributor'
});

const choice = await choiceUI.showChoice();

if (choice.type === 'git-push') {
  // Handle Git push
  const pushService = new TokenPushService();
  await pushService.initialize();
  const result = await pushService.quickPush(extractionResult);
} else if (choice.type === 'download') {
  // Handle download (your existing logic)
  await downloadJSONFile(extractionResult, documentInfo, extractionDuration);
}
```

## 🎨 **UI Preview**

The choice interface shows:

```
🎉 Tokens Extracted Successfully!
Choose how you'd like to export your design tokens

[Statistics Box]
45 Total Tokens    12.3 KB File Size

[🚀 Push to GitHub - Ready]
Push tokens directly to your repository and trigger automated processing
📁 SilvT/ds-distributor → tokens/raw/figma-tokens-2024-09-23.json

[💾 Download JSON File - Always Available]
Download tokens as a JSON file to your computer for manual processing

[Cancel]
```

## 🔄 **Workflow Changes**

### Before (Original)
1. Extract tokens
2. Always download JSON file

### After (With Choice)
1. Extract tokens
2. **Show choice UI**
3. **Either:** Push to GitHub **OR** Download locally
4. Handle errors with fallback options

## ⚙️ **Configuration Requirements**

### For Git Push to Work
- GitHub authentication must be configured
- Repository access must be validated
- ds-distributor repository must be accessible

### For Download (Always Works)
- No configuration required
- Uses existing download functionality

## 🛠️ **Error Handling**

### Git Push Failures
- Network issues → Show error, offer download fallback
- Permission issues → Show configuration guidance
- Repository not found → Verify repository settings

### Download Failures
- File generation issues → Show error details
- Browser restrictions → Provide manual copy option

## 📁 **File Structure**

```
src/
├── ui/
│   └── ExportChoiceUI.ts        # Choice interface
├── workflow/
│   └── ExportWorkflow.ts        # Complete workflow manager
├── github/                      # Existing Git operations
│   ├── GitOperations.ts
│   ├── TokenPushService.ts
│   └── ...
├── MainWithChoice.ts            # Enhanced main function
└── main.ts                      # Your existing main
```

## 🚀 **Quick Start**

1. **Import the enhanced main:**
   ```typescript
   import { enhancedMain } from './MainWithChoice';
   ```

2. **Replace your main function:**
   ```typescript
   figma.on('run', enhancedMain);
   ```

3. **Test with your Figma document:**
   - Run the plugin
   - Extract tokens
   - See the choice interface
   - Try both Git push and download

## 🎯 **User Experience**

### Happy Path - Git Push
1. Plugin extracts tokens ✅
2. Shows choice UI with Git option enabled ✅
3. User clicks "Push to GitHub" ✅
4. Shows progress: "Validating repository..." ✅
5. Shows progress: "Pushing to GitHub..." ✅
6. Success notification: "Pushed to GitHub! tokens/raw/figma-tokens-xxx.json" ✅
7. Plugin closes automatically ✅

### Happy Path - Download
1. Plugin extracts tokens ✅
2. Shows choice UI ✅
3. User clicks "Download JSON File" ✅
4. Shows download interface ✅
5. User downloads file ✅
6. Plugin closes ✅

### Error Path - Git Not Configured
1. Plugin extracts tokens ✅
2. Shows choice UI with Git option disabled ⚠️
3. Shows "Setup Required" status ⚠️
4. User can only choose download ✅

### Error Path - Git Push Fails
1. User chooses Git push ✅
2. Push fails with error message ❌
3. Shows fallback dialog: "Would you like to download instead?" ✅
4. User can choose download as backup ✅

## 💡 **Benefits**

- **User Choice** - Users control their workflow
- **Seamless Integration** - Works with existing GitHub setup
- **Graceful Fallbacks** - Download always available as backup
- **Better UX** - Clear feedback and progress indicators
- **Error Recovery** - Smart fallback options

The choice interface provides a modern, user-friendly way to handle design token exports while maintaining compatibility with your existing workflow! 🎉