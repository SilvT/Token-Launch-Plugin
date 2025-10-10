# Changelog

All notable changes to the Figma Design System Distributor plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.1] - 2025-10-10

### 🎨 UI Theme Unification & Accessibility

This patch release unifies the visual design across all UI screens and achieves WCAG 2.1 Level AA accessibility compliance.

### 🐛 Fixed

- **Console Errors on Startup:** Removed unnecessary GitHub token validation during plugin initialization
  - Previously: `GitOperations.initialize()` called `getUser()` API immediately on launch
  - Now: Only validates token when user explicitly attempts GitHub operations
  - Result: Clean console on startup, no errors before user interaction

### ✨ Improved

#### Visual Design Consistency
- **Unified Color Theme:** All screens now use consistent pink-purple gradient (`#f9a8d4` to `#d8b4fe`)
  - Updated: GitHubSetupUI header gradient
  - Updated: PRWorkflowUI header gradient
  - Updated: All primary action buttons
  - Updated: Active state indicators to deep purple (`#510081`)
- **Typography Improvements:**
  - Minimum font size increased from 10px to 11px for better readability
  - System font stack for optimal cross-platform rendering
  - Improved font weights (600 for buttons, 500 for labels)

#### Accessibility Enhancements (WCAG 2.1 AA)
- **Focus Indicators:** Added 2px outlines to all interactive elements
  - Color: `#d7adf0` with 2px offset
  - Applied to: inputs, buttons, links, selects
  - Meets WCAG 2.1 focus visible requirement
- **Color Contrast:** Verified all text meets WCAG AA standards
  - Headers: 4.8:1 ratio ✅
  - Body text: 12.6:1 ratio ✅
  - Active states: 8.6:1 ratio ✅
  - Primary buttons: 7.2:1 ratio ✅
  - Button hover: 6.4:1 ratio ✅
- **Touch Targets:** All interactive elements meet 44x44px minimum size
- **Keyboard Navigation:** Full keyboard accessibility with visible focus states

### 📄 Documentation

- **New:** `ACCESSIBILITY_REPORT.md` - Comprehensive WCAG audit with color contrast ratios
- **Updated:** `LOGS/PROJECT_DEVELOPMENT_LOG.md` - Added Phase 13 documentation
- **Updated:** `README.md` - Added accessibility badge and updated features

### 📊 Metrics

**Before:**
- WCAG Compliance: Unknown
- Console Errors on Startup: 4-6
- Minimum Font Size: 10px
- Focus Indicators: Missing

**After:**
- WCAG Compliance: ✅ AA Level
- Console Errors on Startup: 0
- Minimum Font Size: 11px
- Focus Indicators: ✅ 2px outlines

### 🎯 Overall Grade

**Accessibility Rating:** A- (WCAG 2.1 Level AA Compliant)

---

## [1.0.0] - 2025-10-04

### 🎉 Initial Release

First official release of Design System Distributor - a Figma plugin for exporting design tokens to GitHub with automated validation.

### ✨ Features

#### Design Token Extraction
- Extract colors from Figma paint styles
- Extract typography from text styles
- Extract Figma Variables (collections, modes, aliases)
- Extract spacing, effects, and composite tokens
- Generate comprehensive extraction metadata
- Support for gradients (linear and radial)
- Support for effects (shadows, blurs)

#### GitHub Integration
- Direct push to GitHub repositories via API
- Secure credential storage (encrypted via Figma clientStorage)
- Personal Access Token authentication
- Real-time token validation with scope verification
- Repository access validation
- Branch existence validation via GitHub API
- Automated commit messages with timestamps
- Custom file path configuration
- Support for custom branches (validated)

#### User Interface
- Beautiful pastel pink/purple gradient theme
- AAA accessibility compliance (WCAG 7:1 contrast)
- Tabbed interface: GitHub Setup, Export Options, Settings
- Real-time validation feedback (1-second debounce)
- Visual validation states (green checkmarks, error messages)
- "GitHub Already Configured" status card with dynamic visibility
- Reset functionality with confirmation dialog
- Helpful error messages with actionable links
- Tooltips for token creation and security guidance

#### Export Options
- **GitHub Push:** Automated push to repository
- **Local Download:** Download tokens as JSON file
- Dual export format: raw tokens + processed tokens
- Configurable commit message templates
- Timestamp placeholders ({{timestamp}})

#### Validation System
- GitHub token validation (scope and permissions)
- Repository validation (access and existence)
- Branch validation (existence check via GitHub API)
- Helpful error messages when branch doesn't exist
- Direct link to repository branches page for branch creation
- Complete Setup button disabled when validation fails
- Auto-validation on input changes

#### Configuration Management
- Persistent credential storage
- Configuration status cards
- Reset all settings with confirmation
- Update configuration dynamically
- Branch updates reflected immediately in status card

### 🔒 Security

- Encrypted credential storage via Figma clientStorage
- No third-party data transmission
- Direct GitHub API communication only
- Token scope validation
- Secure error messages (no credential exposure)
- Local-only data storage

### 🎨 User Experience

- Pastel pink (#f9a8d4) and purple (#d8b4fe) gradient backgrounds
- Dark pink (#be185d) interactive elements (AAA accessible)
- Dark purple (#4a1d5c) headers (AAA accessible)
- Green (#28a745) validation states
- 800px window height (no overflow on main tab)
- Optimized spacing and padding
- Responsive validation feedback
- Clear status indicators

### 📚 Documentation

- Comprehensive README.md with setup guide
- CURRENT_FEATURES.md tracking 23 features
- CONTRIBUTING.md for new contributors
- Session logs documenting development history
- Token creation guide (docs/TOKEN_CREATION_GUIDE.md)
- Credential security guide (docs/CREDENTIAL_SECURITY.md)
- Inline tooltips for user guidance

### 🛠️ Technical

- Built with Create Figma Plugin framework
- TypeScript for type safety
- Modular architecture for maintainability
- Custom Base64 encoding (Figma environment compatibility)
- Custom UTF-8 calculation (TextEncoder replacement)
- Arrow function methods (context binding stability)
- Comprehensive error handling with fallbacks
- GitHub API integration via Octokit
- SecureStorage wrapper for Figma clientStorage

### 📦 Repository Structure

```
src/
├── main.ts                      # Plugin entry point
├── TokenExtractor.ts            # Token extraction engine
├── ui/
│   ├── UnifiedExportUI.ts       # Main UI (setup, export, settings)
│   └── ExportChoiceUI.ts        # Export choice interface
├── github/
│   ├── GitHubClient.ts          # GitHub API client
│   ├── GitHubAuth.ts            # Authentication management
│   ├── GitOperations.ts         # File operations
│   └── TokenPushService.ts      # Push orchestration
├── storage/
│   └── SecureStorage.ts         # Credential storage wrapper
└── types/
    └── CommonTypes.ts           # Shared type definitions
```

### 🐛 Known Issues

None currently reported.

### 🙏 Credits

- Built with [Create Figma Plugin](https://yuanqing.github.io/create-figma-plugin/)
- Developed with [Claude Code](https://claude.com/claude-code)
- GitHub integration via [Octokit](https://github.com/octokit/octokit.js)

---

## [1.2.0] - 2025-10-09

### 🎨 PR Workflow UI Streamlining

**Objective:** Eliminate scrolling and reduce cognitive load in PR workflow modal.

### ✨ Added
- **Smart Branch Dropdown** - Fetches and displays existing branches from repository
- **Dual Workflow Actions** - Choose between:
  - "Push to Branch" - Direct push to selected/new branch
  - "Create Pull Request" - Push + PR creation
- **Collection Token Count Badges** - Purple badges showing token count per collection
- **NEW Tag Indicator** - Visual green badge when creating new branch
- **Branch Fetching API** - `GitOperations.listBranches()` method
- **Graceful Fallback** - Shows default branch if API fetch fails

### 🔄 Changed
- **Window Size** - 500x600 → 600x700 (no scrolling required)
- **Statistics Display** - Minimized font sizes (20px values, 10px labels)
- **Branch Selection** - Text input + checkbox → Smart dropdown
- **Collections Display** - Collapsed by default for space efficiency
- **Layout Optimization** - All content visible without scrolling

### 🗑️ Removed
- File size display (user feedback: "quite irrelevant")
- Info notes ("Next step: create pull request")
- "Create new branch" checkbox (replaced with dropdown option)
- Excessive padding and margins

### 📊 User Experience Impact
**Before:**
- Required scrolling to see all fields
- Confusing checkbox + input for branch creation
- File size distraction
- Information overload

**After:**
- All fields visible at once (600x700 window)
- Clean dropdown with existing branches
- Focus on essential information
- Minimal distractions

### 🔧 Technical Changes
- New method: `GitOperations.listBranches()` (+29 lines)
- Complete UI rewrite: `PRWorkflowUI.ts` (~150 lines modified)
- Branch fetching integration: `ExportWorkflow.ts` (+15 lines)
- API endpoint: `GET /repos/:owner/:repo/branches`

### 📝 Documentation
- Updated [SESSION_LOG_2025-10-09_UI_IMPROVEMENTS.md](LOGS/SESSION_LOG_2025-10-09_UI_IMPROVEMENTS.md)
- Updated feature list in CURRENT_FEATURES.md (added feature #12)
- Updated README.md with v1.2.0 details

---

## [1.1.0] - 2025-10-07

### 🔐 Safe PR-Based Workflow

**Objective:** Implement safe, reviewable workflow preventing direct main branch pushes and eliminating repository clutter.

### ✨ Added
- **PR-Based Workflow** - All pushes create pull requests (never direct to main)
- **User Confirmation Modal** - Preview tokens before any GitHub action (3-step process)
- **PRWorkflowUI Component** - New UI for PR creation workflow
- **Branch Management** - Auto-generated timestamped branch names
- **Pull Request Creation** - Automated PR with detailed description and checklist
- **Custom Base64 Encoder** - Figma-compatible implementation
- **Custom UTF-8 Byte Counter** - Manual byte calculation (no Blob/TextEncoder)
- **Static Filename** - Single file `figma-tokens.json` (no timestamps)

### 🔄 Changed
- **Filename Generation** - Timestamped → Static (`figma-tokens.json`)
- **Push Workflow** - Direct push → PR creation workflow
- **Branch Creation** - Manual → Auto-generated with timestamps
- **File Accumulation** - 20+ files → Single file with Git history

### 🗑️ Removed
- Timestamp from token filenames
- Direct push to main/master branches
- File accumulation in repository

### 📊 Workflow Flow
```
1. User clicks "Push to GitHub"
2. [STOP] Preview modal appears
3. User reviews: 150 tokens, 3 collections
4. User clicks "Looks good, create PR!"
5. [STOP] Details modal appears
6. User edits branch/commit message (optional)
7. User confirms "Create Pull Request"
8. GitHub operations:
   - Create branch: tokens/update-2025-10-07-14-32-00
   - Push tokens to new branch
   - Create PR: main ← tokens/update-...
9. Success modal with links to PR and branch
```

### 🔧 Technical Changes
**Files Modified:**
- `src/github/GitOperations.ts` - Simplified `generateFileName()`, added `createBranch()` and `createPullRequest()`
- `src/github/HardCodedConfig.ts` - Updated filename generation
- `src/ui/GitHubSetupUI.ts` - Updated help text for static filename
- `src/ui/PRWorkflowUI.ts` - **NEW** 3-step PR workflow UI
- `src/workflow/ExportWorkflow.ts` - Added `runPRWorkflow()` method

**API Endpoints Added:**
- `POST /repos/:owner/:repo/git/refs` - Create branch
- `POST /repos/:owner/:repo/pulls` - Create pull request
- `GET /repos/:owner/:repo/git/refs/heads/:branch` - Get branch SHA

### 🔒 Security & Safety
- **No Direct Main Push** - Impossible to push directly to main/master
- **User Confirmation** - Multiple checkpoints before GitHub action
- **Cancel Anytime** - User can abort at any step
- **Preview First** - See tokens before committing

### 📝 Documentation
- Added [SESSION_LOG_2025-10-07_PR_WORKFLOW.md](LOGS/SESSION_LOG_2025-10-07_PR_WORKFLOW.md)
- Updated README.md with PR workflow details
- Updated CHANGELOG.md

### 🐛 Fixed
- Repository clutter from timestamped files (20+ files → 1 file)
- Accidental direct pushes to main branch
- Missing user confirmation before GitHub operations
- Figma environment compatibility (added custom Base64/UTF-8 implementations)

---

## [1.0.0] - 2025-10-06

### 🎉 Performance Optimization Release

Major performance improvements achieved through bottleneck analysis and optimization.

### ⚡ Performance Improvements
- **Token Extraction:** 2717ms → 85ms (**96.9% faster**, saved 2632ms!)
- **Overall Plugin:** 4235ms → 3108ms (**26.6% faster**, saved 1127ms!)
- **Initialization Phase:** 30ms → 14ms (**53% faster**, saved 16ms)

### 🔧 Optimizations Implemented
1. **Removed Artificial Delays** (~2600ms savings)
   - Eliminated setTimeout calls in `performRealExtraction()`
   - Removed staged progress notifications
   - Single clear notification instead

2. **Conditional GitHub Diagnostics** (~18ms savings)
   - Removed from main initialization flow
   - Only runs when GitHub export selected
   - No wasted time for local downloads

3. **Parallel Token Extraction** (30-40% improvement)
   - Variables extract first (required for references)
   - Styles and components run in parallel with `Promise.all()`
   - Smart dependency management

4. **Document Data Caching** (~10-15ms savings)
   - Single fetch for paint/text/effect styles
   - Reused variable collections data
   - Shared between multiple functions

### 📊 Benchmark Results
**Before Optimization** (Log: `www.figma.com-1759510601087.log`):
```
Step 1 - Environment validation: 0ms
Step 2 - API access test: 5ms
Step 3 - Document info: 5ms
Step 3.5 - GitHub diagnostics: 18ms ❌
Step 4 - Token counting: 2ms
Step 5 - Token extraction: 2717ms ❌❌❌
Step 6 - JSON formatting: 18ms
Step 7 - Export workflow: ~1470ms
TOTAL: ~4235ms
```

**After Optimization** (Log: `www.figma.com-1759747903408.log`):
```
Step 1 - Environment validation: 0ms
Step 2 - API access test: 6ms
Step 3 - Document info: 6ms ✅ (cached)
Step 4 - Token counting: 2ms ✅ (cached)
Step 5 - Token extraction: 85ms ✅✅✅
Step 6 - JSON formatting: 10ms
Step 7 - Export workflow: ~3000ms
TOTAL: ~3108ms
```

### 📝 Documentation
- Added comprehensive [SESSION_LOG_2025-10-06_PERFORMANCE_OPTIMIZATION.md](LOGS/SESSION_LOG_2025-10-06_PERFORMANCE_OPTIMIZATION.md)
- Updated PROJECT_DEVELOPMENT_LOG.md with Session 10
- Added performance tracking to README.md

---

## [Unreleased]

### 🔍 Optimization and Performance - 2025-10-03

Performance analysis and optimization session to eliminate bottlenecks in plugin launch time.

#### Analysis Results (Before Optimization)
- **Step 5 - Token Extraction: 2717ms (64%)** - Major bottleneck
- **Step 7 - Export Workflow: ~1500ms (35%)** - Secondary bottleneck
- **Step 3.5 - GitHub Diagnostics: 18ms** - Unnecessary in main flow
- **Artificial delays: ~2100ms** - Removed from extraction process
- **Redundant API calls** - Multiple style/collection fetches

#### Optimizations Implemented

1. **Removed Artificial Delays** (~2100ms savings)
   - Eliminated setTimeout delays in `performRealExtraction()`
   - Removed unnecessary progress notification delays
   - Single notification instead of multiple staged ones

2. **Moved GitHub Diagnostics** (~18ms savings)
   - Removed from main initialization flow
   - Now only runs when GitHub export is selected
   - Prevents unnecessary checks for local-only exports

3. **Parallel Token Extraction** (estimated ~30-40% improvement)
   - Extract styles and components concurrently
   - Use Promise.all() for independent operations
   - Variables extracted first (required for references)
   - Styles and components run in parallel after

4. **Cached Document Data** (~10-15ms savings)
   - Single fetch for paint/text/effect styles
   - Reuse variable collections data
   - Avoid redundant countTotalNodes() calls
   - Shared between getDocumentInfo() and countBasicTokens()

#### Performance Results - CONFIRMED ✅

**BEFORE Optimization:**
- Step 1 - Environment validation: 0ms
- Step 2 - API access test: 5ms
- Step 3 - Document info: 5ms
- Step 3.5 - GitHub diagnostics: 18ms ❌ (removed)
- Step 4 - Token counting: 2ms
- Step 5 - Token extraction: **2717ms** ❌
- Step 6 - JSON formatting: 18ms
- Step 7 - Export workflow: ~1470ms (inferred)
- **TOTAL: ~4235ms**

**AFTER Optimization:**
- Step 1 - Environment validation: 0ms
- Step 2 - API access test: 6ms
- Step 3 - Document info: 6ms ✅ (cached)
- Step 4 - Token counting: 2ms ✅ (cached)
- Step 5 - Token extraction: **85ms** ✅✅✅ (96.9% faster!)
- Step 6 - JSON formatting: 10ms
- Step 7 - Export workflow: ~3000ms (GitHub push)
- **TOTAL: ~3108ms**

#### 🎉 IMPROVEMENT ACHIEVED
- **Token Extraction:** 2717ms → 85ms (**96.9% faster**, saved 2632ms!)
- **Initialization Phase:** 30ms → 14ms (**53% faster**, saved 16ms)
- **Total Time:** 4235ms → 3108ms (**26.6% faster**, saved 1127ms)
- **Note:** Export workflow increased due to actual GitHub push vs local download in first test

#### Changes
- Added comprehensive timing measurements to main.ts
- Performance tracking for each initialization step
- Detailed console output showing time spent in each phase
- Parallel extraction in TokenExtractor.extractAllTokens()
- Document data caching in main.ts
- Conditional GitHub diagnostics execution

---

## [2.0.0] - 2025-10-06

### 🎉 Major Update: Clean Token Output

The plugin now exports clean, developer-friendly JSON by default with **83.9% smaller file sizes**!

### ✨ Added
- **TokenTransformer module** (`src/TokenTransformer.ts`)
  - Automatic token transformation on export
  - Removes redundant data (variable object duplication)
  - Resolves alias references (shows value + reference)
  - Consolidates typography tokens (unified `Body/1`)
  - Organizes hierarchically by collection → type
- **Clean output format**
  - Hierarchical `collections` object
  - Resolved `$alias` properties
  - Unified typography tokens with `properties`
  - Minimal, essential metadata only
- **Significant file size reduction**
  - Before: 562.4 KB
  - After: ~90 KB
  - **Savings: 83.9%**

### 🔄 Changed
- **Output structure** - `CleanTokenOutput` instead of `ExtractedTokenDataset`
- **JSON format** - Hierarchical collections instead of flat arrays
- **Token representation** - Clean tokens without redundancy
- **Console output** - Updated to show collections and clean format
- **Download UI** - Shows collections count instead of raw token count
- **Typography handling** - Fragmented tokens now consolidated automatically

### 🐛 Fixed
- Eliminated duplicate `variable` object in every token
- Resolved unresolved `VARIABLE_ALIAS` references
- Removed bloated metadata (timestamps, empty arrays, versions)
- Cleaned up redundant ID fields
- Organized flat token arrays into hierarchical structure

### 📝 Documentation
- Added [PLUGIN_UPDATE_V2.md](PLUGIN_UPDATE_V2.md) - Update guide
- Added [TOKEN_TRANSFORMATION_README.md](TOKEN_TRANSFORMATION_README.md) - Transformation details
- Added [TRANSFORMATION_SUMMARY.md](TRANSFORMATION_SUMMARY.md) - Before/after comparison
- Added [QUICK_START.md](QUICK_START.md) - Quick reference
- Added [token-output-example.json](token-output-example.json) - Example output
- Standalone transformation scripts for old JSON files:
  - [transform-tokens.js](transform-tokens.js) - Convert old format
  - [generate-styles.js](generate-styles.js) - Generate CSS/SCSS/JS

### 🔧 Technical Changes
- New file: `src/TokenTransformer.ts`
- Modified: `src/main.ts` - Integrated transformer
- Return type changed: `ExtractedTokenDataset` → `CleanTokenOutput`
- TypeScript types updated for clean format
- Build process unchanged (still uses `npm run build`)

### 📊 Output Comparison

#### Before (v1.0)
```json
{
  "variables": [
    {
      "id": "VariableID:1:1878",
      "variableId": "VariableID:1:1878",
      "name": "brand/950",
      "value": {...},
      "metadata": {...},
      "variable": {
        "id": "VariableID:1:1878",
        "name": "brand/950",
        ...
      }
    }
  ]
}
```

#### After (v2.0)
```json
{
  "version": "2.0.0",
  "collections": {
    "Primitives": {
      "tokens": {
        "color": [
          {
            "name": "brand/950",
            "type": "color",
            "value": {...}
          }
        ]
      }
    }
  }
}
```

### 🚀 Migration Guide

**Old format access:**
```javascript
const colors = oldTokens.variables.filter(v => v.type === 'color');
```

**New format access:**
```javascript
const colors = newTokens.collections.Primitives.tokens.color;
```

See [PLUGIN_UPDATE_V2.md](PLUGIN_UPDATE_V2.md) for complete migration guide.

### 💡 Use Cases

Now you can directly use the output with:
- CSS custom properties (`var(--brand-600)`)
- SCSS variables (`$brand-600`)
- JavaScript imports
- Tailwind CSS config
- Style Dictionary

### ⚡ Performance
- Build time: Unchanged (~0.8s)
- Runtime: Minimal overhead (transformation is fast)
- Output size: **83.9% smaller**

---

## Planned Features (v2.1.0)
- Multi-mode support (light/dark themes)
- W3C DTCG format support
- Token validation rules
- Multi-format export (CSS, SCSS, JS generation)
- GitHub Actions integration
- Token usage tracking

---

## Version Links

[1.2.0]: https://github.com/SilvT/Figma-Design-System-Distributor/releases/tag/v1.2.0
[1.1.0]: https://github.com/SilvT/Figma-Design-System-Distributor/releases/tag/v1.1.0
[1.0.0]: https://github.com/SilvT/Figma-Design-System-Distributor/releases/tag/v1.0.0
