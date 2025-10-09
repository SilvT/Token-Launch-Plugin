# Figma Design System Distributor

A high-performance Figma plugin for extracting design tokens from Figma documents and distributing them to development teams via GitHub or local download.

## ✨ Features

### Token Extraction
- **Comprehensive Coverage**: Colors, typography, spacing, effects, shadows, and gradients
- **Figma Variables Support**: Full variable collections, modes, aliases, and semantic relationships
- **Component Token Discovery**: Extract tokens from local styles and component instances
- **Smart Processing**: Parallel extraction with dependency management
- **High Performance**: 96.9% faster extraction (85ms vs 2717ms)

### GitHub Integration
- **Direct Push**: Automated commits to your repositories
- **Secure Credentials**: Encrypted storage via Figma clientStorage
- **Real-time Validation**: Live feedback with 1-second debounce
- **Branch Support**: Main, master, or custom branches
- **Smart Configuration**: Persistent settings with visual validation

### User Experience
- **Dual Export Options**: Choose GitHub push or local JSON download
- **Beautiful UI**: Pastel gradient theme with AAA accessibility (WCAG 7:1)
- **Progress Tracking**: Real-time feedback during extraction and export
- **Security Tooltips**: Integrated guides for token creation and best practices
- **Error Handling**: Graceful fallbacks with helpful error messages

### Performance
- **Optimized Extraction**: Parallel processing with Promise.all()
- **Cached API Calls**: Reduced redundant Figma API requests
- **Conditional Loading**: GitHub diagnostics only when needed
- **Fast Launch**: ~3 seconds total (down from ~4.2 seconds)

## 🎯 Current Status

**Version**: 1.2.0 (Production Ready)
**Last Updated**: October 9, 2025

✅ **Production Ready** - Fully functional with exceptional performance:

| Component | Status | Details |
|-----------|--------|---------|
| Token Extraction | ✅ Complete | 96.9% performance improvement |
| GitHub Integration | ✅ Production Ready | Secure, validated, persistent |
| Export UI | ✅ Polished | Accessible, responsive, intuitive |
| Performance | ✅ Optimized | 3.1s total, 85ms extraction |
| Documentation | ✅ Comprehensive | Full development history |
| Security | ✅ Production Grade | Encrypted storage, scope validation |

### 🏆 Recent Achievements

**UI Streamlining (Oct 9, 2025):**
- Single-step PR workflow (no scrolling)
- Smart branch dropdown with existing branches
- Dual workflow options (Push to Branch / Create PR)
- Collection token count badges
- Minimized statistics display
- Visual NEW tag for branch creation

**Safe PR Workflow (Oct 7, 2025):**
- PR-based workflow preventing direct main branch pushes
- User confirmation before any GitHub action
- Static filename (no timestamp clutter)
- Auto-generated feature branch names
- Custom Base64 and UTF-8 implementations

**Performance Optimization (Oct 6, 2025):**
- Token extraction: 2717ms → 85ms (**96.9% faster**)
- Overall plugin: 4235ms → 3108ms (**26.6% faster**)
- Removed 2600ms of artificial delays
- Implemented parallel token processing
- Added strategic caching

**UI & Security (Oct 2-3, 2025):**
- Persistent credential storage with encryption
- Real-time validation with visual feedback
- Security tooltips and documentation
- Collapsible GitHub setup accordion
- AAA accessibility compliance

## GitHub Integration

### 🚀 **Overview**

The plugin integrates directly with GitHub to push design tokens to repositories, enabling automated design-to-code workflows.

### 🔧 **Setup**

#### 1. **Generate GitHub Personal Access Token**
1. Go to [GitHub Settings > Personal Access Tokens](https://github.com/settings/personal-access-tokens/new)
2. Create a new token with `repo` scope
3. Copy the token (starts with `ghp_`)

#### 2. **Configure Repository**
- Target repository: `your-org/design-tokens`
- Target directory: `tokens/raw/`
- Supported branches: `main`, `master`, or custom branch

#### 3. **Plugin Configuration**

**Interactive Setup (In-Plugin)**
1. Run the plugin in Figma
2. Navigate to the GitHub Setup tab
3. Enter your credentials:
   - GitHub Personal Access Token
   - Repository owner/name
   - Target branch (default: main)
   - File path (default: tokens/raw/)
4. Click "Validate & Save Configuration"
5. Credentials are encrypted and stored securely

**Features:**
- Real-time validation with 1-second debounce
- Visual feedback (green checkmarks for valid inputs)
- Persistent storage across sessions
- "GitHub Already Configured" status indicator
- Reset functionality with confirmation dialog

### 🎯 **User Experience**

After token extraction, users see a choice interface:

```
🎉 Tokens Extracted Successfully!
Choose how you'd like to export your design tokens

┌─────────────────────────────────┐
│  45 Total Tokens    12.3 KB     │
└─────────────────────────────────┘

🚀 Push to GitHub                Ready
Push tokens directly to your repository
📁 your-org/design-tokens → tokens/raw/

💾 Download JSON File    Always Available
Download tokens as JSON for manual processing

             [Cancel]
```

### 📁 **Repository Structure**

The plugin creates files in this structure:

```
your-repository/
├── tokens/
│   └── raw/
│       ├── figma-tokens-2024-09-23T10-30-00.json
│       ├── figma-tokens-2024-09-23T14-15-30.json
│       └── figma-tokens-latest.json
```

### 📄 **File Format**

Generated JSON files include:

```json
{
  "metadata": {
    "exportTimestamp": "2024-09-23T10:30:00.000Z",
    "sourceDocument": {
      "name": "Design System - Main",
      "id": "abc123"
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

### 💬 **Commit Messages**

Automated commits include extraction metadata:

```
feat: update design tokens from Figma

- 45 design tokens
- 12 variables
- 3 collections
- Exported: 2024-09-23
- Source: Design System - Main

🤖 Generated with Figma Design System Distributor
```

### 🔒 **Security**

- **Encrypted Storage**: Tokens stored securely within Figma
- **Minimal Permissions**: Only requires `repo` scope
- **Connection Validation**: Verifies access before operations
- **Error Handling**: Secure error messages without token exposure

### 🛠️ **Troubleshooting**

**Common Issues:**

| Issue | Solution |
|-------|----------|
| "Setup Required" | Configure GitHub credentials in plugin |
| "Repository not found" | Check repository name and access permissions |
| "Insufficient permissions" | Ensure token has `repo` scope |
| "Connection failed" | Verify internet connection and GitHub status |

**Debug Mode:**
- Open Figma Developer Console
- Look for detailed GitHub API logs
- Check authentication and repository validation steps

### ⚡ **Performance**

**Optimized for Speed:**
- Token extraction: 85ms (96.9% faster than v0.1)
- GitHub validation: Real-time with caching
- Document data: Single fetch, multiple reuse
- Parallel processing: Independent operations run concurrently

**Technical Details:**
- See [`LOGS/SESSION_LOG_2025-10-06_PERFORMANCE_OPTIMIZATION.md`](LOGS/SESSION_LOG_2025-10-06_PERFORMANCE_OPTIMIZATION.md) for complete optimization journey

## 🏗️ Architecture

Modular, high-performance architecture designed for scalability and maintainability.

### Core Components

| Component | File | Purpose |
|-----------|------|---------|
| **Main Workflow** | `src/main.ts` | Plugin entry point with performance tracking |
| **Token Extractor** | `src/TokenExtractor.ts` | Parallel extraction engine (85ms performance) |
| **Export Workflow** | `src/workflow/ExportWorkflow.ts` | User choice & execution orchestration |

### GitHub Integration

| Component | File | Purpose |
|-----------|------|---------|
| **GitHub Client** | `src/github/GitHubClient.ts` | API client with custom Base64/UTF-8 |
| **GitHub Auth** | `src/github/GitHubAuth.ts` | Authentication & validation |
| **Git Operations** | `src/github/GitOperations.ts` | File operations & commits |
| **Token Push Service** | `src/github/TokenPushService.ts` | Push orchestration with feedback |

### User Interface

| Component | File | Purpose |
|-----------|------|---------|
| **Unified Export UI** | `src/ui/UnifiedExportUI.ts` | 3-tab interface (setup, export, settings) |
| **GitHub Setup UI** | `src/ui/GitHubSetupUI.ts` | Credential configuration with validation |
| **PR Workflow UI** | `src/ui/PRWorkflowUI.ts` | Single-step PR creation with branch selection |

### Infrastructure

| Component | File | Purpose |
|-----------|------|---------|
| **Secure Storage** | `src/storage/SecureStorage.ts` | Encrypted credential storage |
| **Common Types** | `src/types/CommonTypes.ts` | Shared type definitions |
| **Build Diagnostics** | `src/github/BuildEnvironmentDetector.ts` | Environment compatibility checks |

### File Structure

```
figma-design-system-distributor/
├── src/
│   ├── main.ts                          # Main plugin workflow (with timing)
│   ├── TokenExtractor.ts                # Parallel extraction engine
│   ├── workflow/
│   │   └── ExportWorkflow.ts            # Export orchestration
│   ├── github/
│   │   ├── GitHubClient.ts              # API client (custom Base64/UTF-8)
│   │   ├── GitHubAuth.ts                # Authentication & validation
│   │   ├── GitOperations.ts             # File operations & commits
│   │   ├── TokenPushService.ts          # Push workflow
│   │   ├── DiagnosticTester.ts          # Environment testing
│   │   └── BuildEnvironmentDetector.ts  # Compatibility checks
│   ├── ui/
│   │   ├── UnifiedExportUI.ts           # 3-tab interface
│   │   └── GitHubSetupUI.ts             # Setup wizard
│   ├── storage/
│   │   └── SecureStorage.ts             # Encrypted storage
│   └── types/
│       └── CommonTypes.ts               # Type definitions
├── docs/
│   ├── TOKEN_CREATION_GUIDE.md          # GitHub token setup
│   └── CREDENTIAL_SECURITY.md           # Security best practices
├── LOGS/
│   ├── README.md                        # Documentation guide
│   ├── PROJECT_DEVELOPMENT_LOG.md       # Complete dev history
│   ├── CURRENT_FEATURES.md              # Feature tracking
│   └── SESSION_LOG_*.md                 # Session logs
├── CHANGELOG.md                         # Version history
├── manifest.json                        # Figma plugin manifest
└── package.json                         # Dependencies & scripts
```

### Key Design Patterns

**Performance:**
- Parallel token extraction with `Promise.all()`
- Document data caching (single API fetch)
- Conditional GitHub diagnostics
- Strategic timing measurements

**Security:**
- Encrypted credential storage via Figma clientStorage
- Token scope validation before operations
- No credentials in console logs
- Secure error messages

**User Experience:**
- Real-time validation with 1-second debounce
- Visual feedback (checkmarks, error states)
- Graceful degradation on errors
- Comprehensive tooltips and guides

## 🛠️ Development Guide

*Built with [Create Figma Plugin](https://yuanqing.github.io/create-figma-plugin/) + TypeScript*

### Prerequisites

- [Node.js](https://nodejs.org) v22+
- [Figma desktop app](https://figma.com/downloads/)
- Code editor (VS Code recommended)

### Quick Start

```bash
# Install dependencies
npm install

# Build for production (with minification)
npm run build

# Build for development (faster, with type checking)
npm run build:dev

# Watch mode (auto-rebuild on changes)
npm run watch
```

### Build Output

**Production build** (`npm run build`):
- `manifest.json` - Figma plugin manifest
- `build/main.js` - Minified bundle (~6KB)
- Typechecking: ✅ (~0.9s)
- Minification: ✅

**Development build** (`npm run build:dev`):
- Faster compilation
- Source maps included
- No minification
- Ideal for debugging

### Install in Figma

1. Open a Figma document in the Figma desktop app
2. Go to **Plugins** → **Development** → **Import plugin from manifest...**
3. Select the generated `manifest.json` file
4. Run the plugin from the plugins menu

### Testing & Validation

#### Performance Benchmarks
Monitor these metrics in the console:

```
Step 1 - Environment validation: 0ms
Step 2 - API access test: ~5ms
Step 3 - Document info: ~6ms
Step 4 - Token counting: ~2ms
Step 5 - Token extraction: ~85ms ✅ (optimized)
Step 6 - JSON formatting: ~10ms
Step 7 - Export workflow: ~3000ms (GitHub push)
TOTAL: ~3100ms
```

**Red Flags:**
- Token extraction > 200ms (check for regression)
- Document info > 20ms (possible cache miss)
- Total time > 5000ms (investigate bottleneck)

#### Test Scenarios

**1. Local Download Test:**
- ✅ Token extraction completes in ~85ms
- ✅ Export choice UI appears
- ✅ User selects "Download JSON"
- ✅ JSON file downloads to computer
- ✅ Performance breakdown in console

**2. GitHub Push Test (First Time):**
- ✅ Navigate to GitHub Setup tab
- ✅ Enter credentials with real-time validation
- ✅ Green checkmarks appear for valid inputs
- ✅ Configuration saves successfully
- ✅ GitHub push option shows "Ready"

**3. GitHub Push Test (Configured):**
- ✅ Plugin shows "GitHub Already Configured"
- ✅ Token extraction completes
- ✅ User selects "Push to GitHub"
- ✅ File appears in repository with commit
- ✅ Success notification displays

**4. Error Handling Test:**
- ✅ Invalid token shows error message
- ✅ Network errors trigger fallback to download
- ✅ Repository not found shows helpful guidance
- ✅ Branch validation prevents bad pushes

#### Console Output

**What to Expect:**
```
Step 1: Validating Figma environment...
✓ Figma environment validation passed (0ms)
Step 2: Testing Figma API access...
✓ Figma API access test passed (5ms)
...
✓ Token extraction completed (85ms, internal: 85ms)
...
📊 PERFORMANCE BREAKDOWN:
  Step 1 - Environment validation: 0ms
  ...
  TOTAL: 3108ms
```

### Debugging

**Console Access:**
- **Plugins** → **Development** → **Open Console**
- View detailed execution logs
- Monitor performance metrics
- Check GitHub API interactions

**Common Issues:**

| Issue | Cause | Solution |
|-------|-------|----------|
| Slow extraction (>200ms) | Performance regression | Check for added delays, review parallel processing |
| GitHub push fails | Invalid credentials | Re-validate token in GitHub Setup tab |
| "Setup Required" | No saved config | Configure GitHub in setup tab |
| Validation errors | Network/permissions | Check token scopes and repo access |

**Debug Logs:**
All operations logged with ✓/✗ status indicators and timing information.

## 📚 Documentation

### Core Documentation
- **[`LOGS/PROJECT_DEVELOPMENT_LOG.md`](LOGS/PROJECT_DEVELOPMENT_LOG.md)** - Complete development history with all architectural decisions
- **[`LOGS/CURRENT_FEATURES.md`](LOGS/CURRENT_FEATURES.md)** - Comprehensive feature list with descriptions
- **[`LOGS/README.md`](LOGS/README.md)** - Documentation structure and navigation guide

### Development Sessions
- **[Session Log 2025-10-09](LOGS/SESSION_LOG_2025-10-09_UI_IMPROVEMENTS.md)** - UI streamlining with branch dropdown
- **[Session Log 2025-10-07](LOGS/SESSION_LOG_2025-10-07_PR_WORKFLOW.md)** - PR-based workflow & safe push
- **[Session Log 2025-10-06](LOGS/SESSION_LOG_2025-10-06_PERFORMANCE_OPTIMIZATION.md)** - Performance optimization (96.9% improvement!)
- **[Session Log 2025-10-04](LOGS/SESSION_LOG_2025-10-04_TOKEN_TRANSFORMATION.md)** - Token transformation planning
- **[Session Log 2025-10-03](LOGS/SESSION_LOG_2025-10-03.md)** - UI improvements & security guidance
- **[Session Log 2025-10-02](LOGS/SESSION_LOG_2025-10-02.md)** - Credential persistence & auto-validation

### Security & Setup Guides
- **[`docs/TOKEN_CREATION_GUIDE.md`](docs/TOKEN_CREATION_GUIDE.md)** - How to create GitHub Personal Access Tokens
- **[`docs/CREDENTIAL_SECURITY.md`](docs/CREDENTIAL_SECURITY.md)** - Security best practices

### Planning Documents
- **[`LOGS/SCOPE_TOKEN_TRANSFORMATION.md`](LOGS/SCOPE_TOKEN_TRANSFORMATION.md)** - Future feature scope (v2.0)

## 🔮 What's Next (v2.0 Roadmap)

Planned features for future releases:

### Multi-Format Token Export
- **CSS Custom Properties** - Browser-ready CSS variables
- **SCSS Variables** - Sass/SCSS format for preprocessors
- **JavaScript/TypeScript** - ES modules for JS frameworks
- **iOS/Android** - Native platform formats
- **Tokens Studio** - Design Tokens Community Group format

### Token Transformation Pipeline
- **Style Dictionary Integration** - Industry-standard token transformation
- **Custom Transformers** - User-defined transformation rules
- **Platform-Specific Output** - Tailored formats per platform
- **Semantic Token Mapping** - Automatic aliasing and theming

### Enhanced Workflow
- **Incremental Extraction** - Only extract changed tokens (~80% faster)
- **Streaming Results** - Progressive display of tokens
- **Batch Operations** - Multiple document extraction
- **Export History** - Track and compare exports over time

See [`LOGS/SCOPE_TOKEN_TRANSFORMATION.md`](LOGS/SCOPE_TOKEN_TRANSFORMATION.md) for detailed planning.

## 🤝 Contributing

We welcome contributions! Before starting:

1. Review [`LOGS/PROJECT_DEVELOPMENT_LOG.md`](LOGS/PROJECT_DEVELOPMENT_LOG.md) to understand architecture
2. Check [`LOGS/CURRENT_FEATURES.md`](LOGS/CURRENT_FEATURES.md) for current capabilities
3. Read recent session logs for development patterns
4. Follow existing code style and patterns
5. Add performance timing for new operations
6. Update documentation and session logs

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Credits

- Built with [Create Figma Plugin](https://yuanqing.github.io/create-figma-plugin/)
- Developed with [Claude Code](https://claude.com/claude-code)
- GitHub integration via [Octokit](https://github.com/octokit/octokit.js)

---

## See also

- [Create Figma Plugin docs](https://yuanqing.github.io/create-figma-plugin/)
- [`yuanqing/figma-plugins`](https://github.com/yuanqing/figma-plugins#readme)

Official docs and code samples from Figma:

- [Plugin API docs](https://figma.com/plugin-docs/)
- [`figma/plugin-samples`](https://github.com/figma/plugin-samples#readme)
