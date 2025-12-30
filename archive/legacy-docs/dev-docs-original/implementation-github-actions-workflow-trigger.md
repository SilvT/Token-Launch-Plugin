# Implementation Brief: GitHub Actions Workflow Trigger (Option 1)

## Context & Current State

**Plugin Name**: Design System Distributor  
**Current Version**: v1.0.0  
**Current Status**: Production-ready, fully functional  
**Current Behaviour**: Plugin extracts tokens → pushes JSON to GitHub PR → STOPS  
**Target Behaviour**: Plugin extracts tokens → pushes JSON to GitHub PR → triggers GitHub Action workflow (optional)

**Current Export Success Flow**:
```
ExportWorkflow.executePushToGitHub() 
  → GitOperations.createNewFile() / updateExistingFile()
  → GitHubClient.createPullRequest()
  → Return { success: true, prUrl: pr.html_url }
```

---

## Goals

### Primary Goal
Add **optional** GitHub Actions workflow triggering capability without breaking existing functionality.

### Success Criteria
1. ✅ Existing workflow continues working unchanged
2. ✅ Users can opt-in to workflow triggering via UI toggle
3. ✅ Plugin provides link to download sample workflow YAML
4. ✅ Workflow trigger happens after PR creation (not before)
5. ✅ Graceful failure if trigger fails (doesn't block PR creation)
6. ✅ Clear user feedback about trigger status
7. ✅ No performance degradation (<200ms added for trigger)
8. ✅ All existing tests still pass

### Non-Goals (DO NOT IMPLEMENT)
❌ Automatic workflow creation/modification  
❌ Style Dictionary bundling in plugin  
❌ Token transformation in plugin  
❌ Modifying existing GitHub files beyond tokens  

---

## Technical Requirements

### New GitHub API Permission
- Plugin needs to call: `POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches`
- User's GitHub token must have `repo` scope (already required) + `actions:write`
- Gracefully handle missing permission

### New Dependencies
**NONE** - Use existing Octokit instance

### Bundle Size Impact
Target: <5KB added (method implementations only)

---

## Implementation Steps

### Step 1: Add GitHub Actions API Method

**File**: `src/github/GitHubClient.ts`

**Location**: Add after `createPullRequest()` method

**New Method**:
```typescript
/**
 * Triggers a GitHub Actions workflow dispatch event
 * @param owner Repository owner
 * @param repo Repository name  
 * @param workflowId Workflow file name (e.g., 'transform-tokens.yml')
 * @param ref Branch name to run workflow on
 * @param inputs Optional workflow inputs
 * @returns Promise<boolean> - true if successful, false if failed
 */
async triggerWorkflow(
  owner: string,
  repo: string,
  workflowId: string,
  ref: string,
  inputs?: Record<string, string>
): Promise<{ success: boolean; error?: string }> {
  try {
    await this.octokit.rest.actions.createWorkflowDispatch({
      owner,
      repo,
      workflow_id: workflowId,
      ref,
      inputs: inputs || {}
    });
    
    return { success: true };
  } catch (error: any) {
    // Handle specific error cases
    if (error.status === 404) {
      return { 
        success: false, 
        error: 'Workflow file not found. Please add the workflow to your repository.' 
      };
    }
    if (error.status === 403) {
      return { 
        success: false, 
        error: 'Insufficient permissions. Token needs "actions:write" scope.' 
      };
    }
    return { 
      success: false, 
      error: error.message || 'Failed to trigger workflow' 
    };
  }
}
```

**Testing Requirements**:
- Test with valid workflow
- Test with non-existent workflow (404)
- Test with insufficient permissions (403)
- Test with network error
- Verify no breaking changes to existing methods

---

### Step 2: Update GitHubTypes

**File**: `src/github/GitHubTypes.ts`

**Add New Type**:
```typescript
export interface WorkflowTriggerConfig {
  enabled: boolean;           // Whether to trigger workflow
  workflowFileName: string;   // e.g., 'transform-tokens.yml'
  inputs?: Record<string, string>; // Optional workflow inputs
}

export interface WorkflowTriggerResult {
  triggered: boolean;
  success?: boolean;
  error?: string;
  workflowUrl?: string; // Link to Actions page
}
```

**Update Existing Type**:
```typescript
export interface PullRequestOptions {
  title: string;
  body: string;
  branchName: string;
  createPR: boolean;
  
  // NEW: Add workflow trigger config
  workflowTrigger?: WorkflowTriggerConfig;
}
```

---

### Step 3: Update ExportWorkflow Logic

**File**: `src/workflow/ExportWorkflow.ts`

**Modify**: `executePushToGitHub()` method

**Current code** (keep this structure intact):
```typescript
async executePushToGitHub(config, options) {
  // ... existing validation ...
  // ... existing file push ...
  // ... existing PR creation ...
  
  const pr = await client.createPullRequest(...);
  return { success: true, prUrl: pr.html_url };
}
```

**New code** (add after PR creation, before return):
```typescript
async executePushToGitHub(config, options) {
  // ... existing validation ...
  // ... existing file push ...
  // ... existing PR creation ...
  
  const pr = await client.createPullRequest(...);
  
  // NEW: Optionally trigger GitHub Actions workflow
  let workflowResult: WorkflowTriggerResult = { triggered: false };
  
  if (options.workflowTrigger?.enabled) {
    console.log('🔄 Triggering GitHub Actions workflow...');
    const triggerStart = performance.now();
    
    const trigger = await this.triggerWorkflowSafely(
      config,
      options.workflowTrigger,
      options.branchName
    );
    
    const triggerDuration = performance.now() - triggerStart;
    console.log(`✅ Workflow trigger completed in ${triggerDuration.toFixed(0)}ms`);
    
    workflowResult = trigger;
  }
  
  return { 
    success: true, 
    prUrl: pr.html_url,
    workflowTrigger: workflowResult // NEW: Include workflow result
  };
}
```

**Add New Private Method**:
```typescript
/**
 * Safely triggers workflow without throwing errors
 * Failures here should NOT prevent PR creation success
 */
private async triggerWorkflowSafely(
  config: GitHubConfig,
  workflowConfig: WorkflowTriggerConfig,
  branchName: string
): Promise<WorkflowTriggerResult> {
  try {
    const client = GitHubClientHybrid.getInstance();
    
    const result = await client.triggerWorkflow(
      config.owner,
      config.repo,
      workflowConfig.workflowFileName,
      branchName,
      workflowConfig.inputs
    );
    
    if (result.success) {
      const workflowUrl = `https://github.com/${config.owner}/${config.repo}/actions`;
      return {
        triggered: true,
        success: true,
        workflowUrl
      };
    } else {
      console.warn('⚠️ Workflow trigger failed:', result.error);
      return {
        triggered: true,
        success: false,
        error: result.error
      };
    }
  } catch (error: any) {
    console.error('❌ Unexpected error triggering workflow:', error);
    return {
      triggered: true,
      success: false,
      error: error.message || 'Unexpected error'
    };
  }
}
```

**Critical**: Ensure workflow trigger failure does NOT throw errors that would make PR creation appear to fail.

---

### Step 4: Update UI (UnifiedExportUI)

**File**: `src/ui/UnifiedExportUI.ts`

**Location**: In the GitHub PR section (after branch selection)

**Add New UI Elements**:

```typescript
// In createPullRequestSection():

<div class="form-section">
  <label class="checkbox-label">
    <input 
      type="checkbox" 
      id="enable-workflow-trigger" 
      ${storedConfig.workflowTriggerEnabled ? 'checked' : ''}
    >
    <span>Trigger CI/CD workflow after PR creation</span>
  </label>
  
  <div id="workflow-config" style="display: ${storedConfig.workflowTriggerEnabled ? 'block' : 'none'}; margin-left: 24px; margin-top: 8px;">
    <label for="workflow-filename" class="input-label">
      Workflow file name
      <span class="tooltip" title="GitHub Actions workflow file in .github/workflows/">ⓘ</span>
    </label>
    <input 
      type="text" 
      id="workflow-filename" 
      value="${storedConfig.workflowFileName || 'transform-tokens.yml'}"
      placeholder="transform-tokens.yml"
      class="input-field"
    >
    
    <div class="info-box" style="margin-top: 8px;">
      📦 <a href="https://github.com/YourOrg/design-system-distributor/blob/main/examples/transform-tokens.yml" target="_blank">Download sample workflow</a>
    </div>
  </div>
</div>
```

**Add Event Listener** (in constructor or init):

```typescript
// Toggle workflow config visibility
const workflowCheckbox = document.getElementById('enable-workflow-trigger') as HTMLInputElement;
const workflowConfig = document.getElementById('workflow-config') as HTMLElement;

workflowCheckbox?.addEventListener('change', (e) => {
  const enabled = (e.target as HTMLInputElement).checked;
  if (workflowConfig) {
    workflowConfig.style.display = enabled ? 'block' : 'none';
  }
});
```

**Update `handlePullRequest()` Method**:

```typescript
private async handlePullRequest() {
  // ... existing code ...
  
  // NEW: Get workflow trigger config
  const workflowEnabled = (document.getElementById('enable-workflow-trigger') as HTMLInputElement)?.checked || false;
  const workflowFileName = (document.getElementById('workflow-filename') as HTMLInputElement)?.value || 'transform-tokens.yml';
  
  const options: PullRequestOptions = {
    title,
    body,
    branchName,
    createPR: true,
    
    // NEW: Add workflow trigger config
    workflowTrigger: workflowEnabled ? {
      enabled: true,
      workflowFileName: workflowFileName.trim()
    } : undefined
  };
  
  // ... existing push logic ...
  const result = await workflow.executePushToGitHub(config, options);
  
  // NEW: Show workflow trigger status
  if (result.workflowTrigger?.triggered) {
    if (result.workflowTrigger.success) {
      this.showSuccess(`
        Pull request created! Workflow triggered successfully.
        <a href="${result.prUrl}" target="_blank">View PR</a> | 
        <a href="${result.workflowTrigger.workflowUrl}" target="_blank">View Workflow</a>
      `);
    } else {
      this.showWarning(`
        Pull request created, but workflow trigger failed: ${result.workflowTrigger.error}
        <a href="${result.prUrl}" target="_blank">View PR</a>
      `);
    }
  } else {
    // Existing success message
    this.showSuccess(`Pull request created! <a href="${result.prUrl}" target="_blank">View PR</a>`);
  }
}
```

---

### Step 5: Update Storage (Persist Settings)

**File**: `src/storage/SecureStorage.ts`

**Update Stored Config Type**:

```typescript
interface StoredGitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  
  // NEW: Add workflow settings
  workflowTriggerEnabled?: boolean;
  workflowFileName?: string;
}
```

**Update Save/Load Methods**:

```typescript
// In storeCredentials():
const config = {
  token,
  owner,
  repo,
  branch,
  workflowTriggerEnabled,
  workflowFileName
};

// In loadCredentials():
return {
  token: decrypted.token,
  owner: decrypted.owner,
  repo: decrypted.repo,
  branch: decrypted.branch,
  workflowTriggerEnabled: decrypted.workflowTriggerEnabled || false,
  workflowFileName: decrypted.workflowFileName || 'transform-tokens.yml'
};
```

---

### Step 6: Add Documentation

**Create New File**: `docs/GITHUB_ACTIONS_INTEGRATION.md`

```markdown
# GitHub Actions Integration

## Overview

The plugin can optionally trigger a GitHub Actions workflow after creating a pull request. This enables automatic token transformation using Style Dictionary.

## Setup

1. Download the sample workflow: [transform-tokens.yml](../examples/transform-tokens.yml)
2. Add it to your repository at `.github/workflows/transform-tokens.yml`
3. Ensure your GitHub token has `actions:write` scope
4. Enable "Trigger CI/CD workflow" in the plugin UI

## Sample Workflow

[Link to your repo's example file]

## Token Permissions

Your GitHub Personal Access Token needs:
- ✅ `repo` (already required)
- ✅ `actions:write` (for triggering workflows)

## Troubleshooting

**"Workflow file not found"**
- Add the workflow YAML file to `.github/workflows/` in your repository

**"Insufficient permissions"**
- Recreate your token with `actions:write` scope

**Workflow doesn't run**
- Check Actions tab in your repository
- Verify workflow file name matches plugin setting
```

**Create Example File**: `examples/transform-tokens.yml`

```yaml
name: Transform Design Tokens

on:
  workflow_dispatch:
    inputs:
      pr_number:
        description: 'PR number that triggered this'
        required: false
  push:
    paths:
      - 'figma-tokens.json'

jobs:
  transform:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Style Dictionary
        run: npm install -g style-dictionary
      
      - name: Transform tokens
        run: style-dictionary build
      
      - name: Commit transformed files
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: "🎨 Transform design tokens [automated]"
          file_pattern: "tokens/*"
```

**Update**: `README.md`

Add new section:
```markdown
## CI/CD Integration (Optional)

The plugin can trigger GitHub Actions workflows to automatically transform tokens after PR creation.

**Setup**:
1. Download [sample workflow](examples/transform-tokens.yml)
2. Add to `.github/workflows/` in your repository
3. Enable in plugin settings

[See full documentation](docs/GITHUB_ACTIONS_INTEGRATION.md)
```

---

## Testing Strategy

### Unit Tests (Manual for now)

**Test 1: Workflow Trigger Success**
```typescript
// Mock Octokit response
const mockSuccess = {
  rest: {
    actions: {
      createWorkflowDispatch: jest.fn().mockResolvedValue({})
    }
  }
};

const client = new GitHubClient(mockSuccess);
const result = await client.triggerWorkflow('owner', 'repo', 'test.yml', 'main');

expect(result.success).toBe(true);
expect(result.error).toBeUndefined();
```

**Test 2: Workflow Not Found (404)**
```typescript
const mockNotFound = {
  rest: {
    actions: {
      createWorkflowDispatch: jest.fn().mockRejectedValue({ status: 404 })
    }
  }
};

const result = await client.triggerWorkflow('owner', 'repo', 'missing.yml', 'main');

expect(result.success).toBe(false);
expect(result.error).toContain('not found');
```

**Test 3: Insufficient Permissions (403)**
```typescript
const mockForbidden = {
  rest: {
    actions: {
      createWorkflowDispatch: jest.fn().mockRejectedValue({ status: 403 })
    }
  }
};

const result = await client.triggerWorkflow('owner', 'repo', 'test.yml', 'main');

expect(result.success).toBe(false);
expect(result.error).toContain('permissions');
```

**Test 4: PR Creation Still Succeeds When Workflow Fails**
```typescript
// Mock workflow failure
const mockWorkflowFail = jest.fn().mockResolvedValue({ success: false, error: 'Test error' });

// PR should still succeed
const result = await workflow.executePushToGitHub(config, options);

expect(result.success).toBe(true); // ← CRITICAL
expect(result.prUrl).toBeDefined();
expect(result.workflowTrigger.success).toBe(false);
```

### Integration Tests (Manual Testing Required)

**Test Scenario 1: Happy Path**
1. Create test repository
2. Add sample workflow YAML to `.github/workflows/`
3. Run plugin with workflow trigger enabled
4. Verify:
   - ✅ PR created successfully
   - ✅ Workflow appears in Actions tab
   - ✅ Workflow runs on correct branch
   - ✅ Success message shows both links

**Test Scenario 2: Workflow Disabled**
1. Run plugin with workflow trigger unchecked
2. Verify:
   - ✅ PR created successfully
   - ✅ No workflow trigger attempted
   - ✅ No workflow-related errors
   - ✅ Existing behavior unchanged

**Test Scenario 3: Missing Workflow File**
1. Run plugin with non-existent workflow name
2. Verify:
   - ✅ PR created successfully
   - ✅ Warning message about workflow not found
   - ✅ PR link still provided
   - ✅ Plugin doesn't crash

**Test Scenario 4: Invalid Token Permissions**
1. Use token without `actions:write` scope
2. Verify:
   - ✅ PR created successfully
   - ✅ Clear error about insufficient permissions
   - ✅ Guidance to update token scope
   - ✅ Plugin doesn't crash

**Test Scenario 5: Network Failure During Trigger**
1. Simulate network disconnect after PR creation
2. Verify:
   - ✅ PR created successfully
   - ✅ Graceful error handling
   - ✅ User informed of issue
   - ✅ Plugin doesn't crash

---

## Debugging Strategy

### Logging Points

**Add Console Logs** (controlled by `logging.ts`):

```typescript
// In GitHubClient.triggerWorkflow():
console.log('[GitHub Actions] Triggering workflow:', { owner, repo, workflowId, ref });

// In ExportWorkflow.triggerWorkflowSafely():
console.log('[Workflow Trigger] Starting...');
console.log('[Workflow Trigger] Config:', workflowConfig);

// Success:
console.log('[Workflow Trigger] ✅ Success:', result);

// Failure:
console.warn('[Workflow Trigger] ⚠️ Failed:', error);
```

**Performance Timing**:
```typescript
const start = performance.now();
// ... workflow trigger ...
console.log(`Workflow trigger took ${performance.now() - start}ms`);
```

### Debug Checklist

When workflow trigger fails, check:

1. **Token Permissions**:
   - Go to GitHub → Settings → Developer settings → Tokens
   - Verify `actions:write` is checked
   - Regenerate if needed

2. **Workflow File**:
   - Check `.github/workflows/` directory
   - Verify file name matches setting
   - Validate YAML syntax

3. **Repository Settings**:
   - Go to repo → Settings → Actions
   - Verify Actions are enabled
   - Check workflow permissions

4. **Network**:
   - Check browser Network tab
   - Look for 404, 403, 500 errors
   - Verify GitHub API is accessible

5. **Plugin Console**:
   - Open Figma DevTools Console
   - Look for error messages
   - Check performance timing

---

## Safety Measures

### 1. Feature Flag (Built-in)
- Workflow trigger is opt-in (unchecked by default)
- Users must explicitly enable it

### 2. Graceful Degradation
```typescript
// If workflow fails, PR still succeeds
// If API errors, catch and log, don't throw
// If network fails, show warning, not error
```

### 3. Backwards Compatibility
```typescript
// Old workflows without workflowTrigger field still work
if (options.workflowTrigger?.enabled) {
  // Only run if explicitly enabled
}
```

### 4. Error Boundaries
```typescript
try {
  // Workflow trigger
} catch (error) {
  // Log but don't throw
  console.warn('Workflow trigger failed:', error);
}
```

### 5. Performance Budget
- Max 200ms for workflow trigger call
- Use Promise.race with timeout if needed:

```typescript
const triggerPromise = client.triggerWorkflow(...);
const timeoutPromise = new Promise((_, reject) => 
  setTimeout(() => reject(new Error('Timeout')), 5000)
);

await Promise.race([triggerPromise, timeoutPromise]);
```

---

## Success Checklist

Before marking this complete:

### Code Quality
- [ ] TypeScript compiles with no errors
- [ ] No console errors in Figma console
- [ ] ESLint passes
- [ ] Code follows existing patterns

### Functionality
- [ ] PR creation works with workflow disabled (existing behavior)
- [ ] PR creation works with workflow enabled (new behavior)
- [ ] Workflow trigger failures don't break PR creation
- [ ] UI checkbox persists across sessions
- [ ] Documentation links work

### Performance
- [ ] Plugin startup time unchanged (<2s)
- [ ] Token extraction time unchanged (~85ms)
- [ ] Workflow trigger adds <200ms
- [ ] No memory leaks

### User Experience
- [ ] Clear UI labels and tooltips
- [ ] Success messages show both PR and workflow links
- [ ] Error messages are actionable
- [ ] Documentation is clear

### Edge Cases
- [ ] Works with missing workflow file (shows error)
- [ ] Works with insufficient permissions (shows error)
- [ ] Works with network failures (graceful degradation)
- [ ] Works with long branch names
- [ ] Works with special characters in workflow name

---

## Rollback Plan

If this feature causes issues:

1. **Quick Fix**: Add kill switch in UI
```typescript
const ENABLE_WORKFLOW_TRIGGER = false; // Set to false to disable feature
```

2. **Revert**: Remove changes to these files:
   - `src/github/GitHubClient.ts` (remove `triggerWorkflow()`)
   - `src/workflow/ExportWorkflow.ts` (remove workflow trigger logic)
   - `src/ui/UnifiedExportUI.ts` (remove checkbox UI)

3. **Existing functionality unaffected** (no breaking changes)

---

## Timeline Estimate

- **Step 1** (GitHubClient): 30 minutes
- **Step 2** (Types): 15 minutes
- **Step 3** (ExportWorkflow): 45 minutes
- **Step 4** (UI): 1 hour
- **Step 5** (Storage): 30 minutes
- **Step 6** (Documentation): 45 minutes
- **Testing**: 1-2 hours
- **Total**: 4-5 hours

---

## Final Notes

### Critical Principles

1. **Non-Breaking**: Existing workflow MUST continue working exactly as before
2. **Opt-In**: Feature is disabled by default
3. **Fail-Safe**: Workflow trigger failures don't prevent PR creation success
4. **Performance**: No significant impact on existing operations
5. **Documentation**: Clear guidance for users

### What NOT to Touch

❌ Token extraction logic (`TokenExtractor.ts`)  
❌ GitHub authentication (`GitHubAuth.ts`)  
❌ Existing PR creation flow  
❌ Build configuration  
❌ Dependencies (no new packages)  

### Success Definition

When complete:
- Users can optionally enable CI/CD workflow triggering
- PR creation always succeeds (with or without workflow)
- Clear documentation for setup
- No breaking changes to existing functionality
- Performance impact <200ms

---

**Ready to implement? Start with Step 1 and test each step before proceeding.**

---

## Quick Reference: Files to Modify

1. ✏️ `src/github/GitHubClient.ts` - Add `triggerWorkflow()` method
2. ✏️ `src/github/GitHubTypes.ts` - Add workflow types
3. ✏️ `src/workflow/ExportWorkflow.ts` - Add trigger logic after PR creation
4. ✏️ `src/ui/UnifiedExportUI.ts` - Add checkbox UI and event handlers
5. ✏️ `src/storage/SecureStorage.ts` - Persist workflow settings
6. 📝 `docs/GITHUB_ACTIONS_INTEGRATION.md` - New documentation file
7. 📝 `examples/transform-tokens.yml` - New example workflow file
8. ✏️ `README.md` - Add CI/CD section

**Total Files**: 8 files (5 modifications, 3 new files)