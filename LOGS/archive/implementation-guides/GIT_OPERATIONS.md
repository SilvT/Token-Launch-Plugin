# Git Operations Implementation

Complete implementation of Git operations for pushing design tokens to your ds-distributor repository.

## 🏗️ **Architecture Overview**

### Core Components

1. **`GitOperations.ts`** - Low-level Git operations (repository validation, file push, error handling)
2. **`TokenPushService.ts`** - High-level service integrating with token extraction workflow
3. **`MainIntegration.ts`** - Complete workflow examples and integration patterns

## 🚀 **Quick Usage**

### Simple Push to Your Repository

```typescript
import { TokenPushService } from './github/TokenPushService';

// Initialize and push
const pushService = new TokenPushService();
await pushService.initialize();

// Quick push with auto-generated filename
const result = await pushService.quickPush(extractionResult, feedback);

if (result.success) {
  console.log(`✅ Pushed to: ${result.fileInfo?.path}`);
}
```

### Custom Configuration Push

```typescript
import { TokenPushService, PushConfiguration } from './github/TokenPushService';

const config: PushConfiguration = {
  repository: {
    owner: 'SilvT',
    name: 'ds-distributor',
    branch: 'main'
  },
  targetPath: 'tokens/raw/',
  filename: 'figma-tokens-2024-09-23.json',
  commitMessage: 'feat: update design tokens from Dashboard redesign'
};

const result = await pushService.pushTokensToGitHub(tokenData, config, feedback);
```

## 🔧 **Features Implemented**

### Repository Validation
- ✅ **Repository exists check** - Validates repo accessibility
- ✅ **Permission validation** - Ensures write access
- ✅ **Branch verification** - Confirms target branch exists
- ✅ **Connection testing** - Tests GitHub API connectivity

### File Operations
- ✅ **Smart file handling** - Detects existing files and updates vs creates
- ✅ **Timestamp-based naming** - Auto-generates `figma-tokens-[timestamp].json`
- ✅ **Base64 encoding** - Properly encodes JSON for GitHub API
- ✅ **File size tracking** - Reports file sizes for user feedback

### Commit Management
- ✅ **Intelligent commit messages** - Generated from extraction metadata
- ✅ **Document name inclusion** - References source Figma document
- ✅ **Token count reporting** - Includes counts in commit body
- ✅ **Timestamp tracking** - Records extraction time

### Error Handling
- ✅ **Network error recovery** - Handles connection issues gracefully
- ✅ **Permission error messages** - Clear feedback for access issues
- ✅ **Repository not found** - Specific guidance for 404 errors
- ✅ **Rate limiting awareness** - Detects and reports API limits
- ✅ **File conflict detection** - Handles concurrent modifications

### User Feedback
- ✅ **Progress indicators** - Step-by-step progress reporting
- ✅ **Figma notifications** - Native Figma notification integration
- ✅ **Success details** - File size, commit SHA, operation type
- ✅ **Error explanations** - User-friendly error messages

## 📁 **File Structure Generated**

Your repository will have this structure:

```
ds-distributor/
├── tokens/
│   └── raw/
│       ├── figma-tokens-2024-09-23T10-30-00.json
│       ├── figma-tokens-2024-09-23T14-15-30.json
│       └── figma-tokens-latest.json
```

## 🔍 **Validation Process**

Before each push, the system validates:

1. **GitHub Authentication** - Token validity and permissions
2. **Repository Access** - Repo exists and is accessible
3. **Write Permissions** - User can create/update files
4. **Branch Existence** - Target branch is available
5. **File Path Validity** - Destination path is valid

## 📝 **Commit Message Format**

Auto-generated commit messages follow this pattern:

```
feat: update design tokens from [Document Name]

- 45 tokens, 12 variables
- Exported: 2024-09-23
- Processed: 1,234 nodes
```

## 🛡️ **Error Scenarios Handled**

| Error Type | User Message | Recovery Action |
|------------|--------------|-----------------|
| Network failure | "Network connection failed. Please check your internet connection." | Retry prompt |
| Invalid token | "Authentication failed. Please check your GitHub token." | Token reconfiguration |
| No repository access | "Repository not found or you don't have access to it." | Permission guidance |
| File conflicts | "File conflict detected. The file may have been modified by someone else." | Force update option |
| Rate limiting | "GitHub API rate limit exceeded. Please try again later." | Wait and retry |
| Large file | "File is too large for GitHub. Consider reducing token data size." | Data reduction tips |

## 🔧 **Integration with Your main.ts**

### Method 1: Complete Workflow Replacement

```typescript
import { mainWithGitPush } from './github/MainIntegration';

// Replace your existing main function
figma.on('run', async () => {
  await mainWithGitPush();
});
```

### Method 2: Add Git Push to Existing Workflow

```typescript
import { TokenPushService } from './github/TokenPushService';

// In your existing main function, after token extraction:
async function yourExistingMain() {
  // ... your existing extraction code ...
  const extractionResult = await tokenExtractor.extractAllTokens();

  // Add Git push
  try {
    const pushService = new TokenPushService();
    await pushService.initialize();

    const feedback = TokenPushService.createFigmaFeedback();
    const pushResult = await pushService.quickPush(extractionResult, feedback);

    if (pushResult.success) {
      console.log('🎉 Tokens pushed to GitHub!');
    } else {
      console.log('📁 Proceeding with local download...');
      // Your existing download logic
    }
  } catch (error) {
    console.log('📁 Git push failed, using local export...');
    // Your existing download logic
  }
}
```

## 🎯 **Next Steps**

1. **Setup GitHub credentials** using existing auth system
2. **Test repository connection** with your ds-distributor repo
3. **Integrate into main.ts** using one of the patterns above
4. **Test with actual token extraction** from your Figma documents

## 📊 **Expected Output Structure**

The JSON pushed to `tokens/raw/` will have this structure:

```json
{
  "metadata": {
    "exportTimestamp": "2024-09-23T10:30:00.000Z",
    "sourceDocument": {
      "name": "Design System - Main",
      "id": "abc123",
      "totalNodes": 1234,
      "processedNodes": 856
    },
    "tokenCounts": {
      "totalTokens": 45,
      "totalVariables": 12,
      "totalCollections": 3
    }
  },
  "variables": [...],
  "collections": [...],
  "designTokens": [...]
}
```

This structure supports your planned processing pipeline where other tools can consume the raw exports and generate the processed/css/scss/javafx formats.

## 🔄 **Workflow Summary**

1. **Extract** → Design tokens extracted from Figma
2. **Validate** → Repository and permissions checked
3. **Generate** → Filename and commit message created
4. **Push** → File uploaded to GitHub via API
5. **Confirm** → Success notification with details

The implementation is ready for integration with your existing plugin workflow! 🚀