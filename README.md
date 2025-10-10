# Figma Design System Distributor

**Extract design tokens from Figma and push them directly to GitHub—automatically.**

A high-performance Figma plugin that bridges the gap between design and development by extracting design tokens and distributing them to your codebase.

[![Version](https://img.shields.io/badge/version-1.2.1-blue.svg)](CHANGELOG.md)
[![Status](https://img.shields.io/badge/status-production%20ready-green.svg)]()
[![Performance](https://img.shields.io/badge/performance-96.9%25%20faster-brightgreen.svg)](LOGS/SESSION_LOG_2025-10-06_PERFORMANCE_OPTIMIZATION.md)
[![Safety](https://img.shields.io/badge/workflow-PR%20based-success.svg)](LOGS/SESSION_LOG_2025-10-07_PR_WORKFLOW.md)
[![UX](https://img.shields.io/badge/UI-streamlined-purple.svg)](LOGS/SESSION_LOG_2025-10-09_UI_IMPROVEMENTS.md)
[![Accessibility](https://img.shields.io/badge/WCAG-AA%20compliant-brightgreen.svg)](ACCESSIBILITY_REPORT.md)

---

## ✨ What It Does

1. **Extract** design tokens from your Figma document (colors, typography, spacing, effects, variables)
2. **Preview** token summary with counts and collections
3. **Review** and customize commit message and PR title
4. **Create PR** — tokens pushed to a feature branch with a GitHub Pull Request

**Fast:** Extracts tokens in ~85ms (96.9% faster than v0.1)
**Secure:** Encrypted credential storage with validation
**Safe:** PR-based workflow with user confirmation at every step
**Easy:** Beautiful UI with real-time feedback

---

## 🚀 Quick Start

### Install the Plugin

1. Download or clone this repository
2. Run `npm install && npm run build`
3. In Figma: **Plugins** → **Development** → **Import plugin from manifest...**
4. Select the `manifest.json` file
5. Run the plugin!

### First Time Setup

**For GitHub Push:**
1. Create a [GitHub Personal Access Token](https://github.com/settings/personal-access-tokens/new) (needs `repo` scope)
2. Open the plugin and go to the **GitHub Setup** tab
3. Enter your token, repository, and branch
4. Click **Validate & Save Configuration**
5. Done! Your credentials are encrypted and saved

**For Local Download:**
- No setup needed—just run and download your tokens as JSON

---

## 💡 Features

### Token Extraction
- Colors, typography, spacing, effects, shadows, gradients
- Figma variables with full collection and mode support
- Component tokens and local styles
- **96.9% faster extraction** (optimized with parallel processing)

### Export Options
- **GitHub PR Workflow:** Safe pull request creation with user confirmation
- **Local Download:** JSON file for manual processing
- Real-time progress tracking
- Graceful error handling with fallbacks

### GitHub Integration
- **PR-Based Workflow:** Never pushes directly to main branch
- **User Confirmation:** Preview tokens before creating PR
- **Customizable:** Edit commit messages and PR titles
- **Safe Branch Creation:** Auto-generates timestamped feature branches
- **Collision Avoidance:** Automatically handles duplicate branch names
- Secure encrypted credential storage
- Real-time validation (token, repository, branch)
- Visual feedback (green checkmarks, error messages)
- Persistent configuration across sessions

### Pull Request Workflow (v1.2.0)
- **Single-Step UI:** Streamlined workflow in one compact 600x700 modal (no scrolling)
- **Dual Workflow Options:** Choose between:
  - **Push to Branch**: Direct push to selected/new branch
  - **Create Pull Request**: Push + automated PR creation
- **Smart Branch Dropdown:** Fetches existing branches from your repository
- **Easy Branch Creation:** "+ Create new branch" option with visual green NEW tag
- **Collection Insights:** Token count badges for each collection (purple badges)
- **Compact Stats:** Essential token/variable/collection counts (minimized display)
- **Static Filename:** Single file `figma-tokens.json` (no timestamp clutter)
- **Auto-Generated Branch:** Timestamped branch names (tokens/update-YYYY-MM-DD-HH-MM-SS)
- **GitHub PR:** Creates pull request with detailed metadata and review checklist
- **Success Feedback:** Clickable links to view PR or branch on GitHub
- **Cancel Anytime:** Abort at any time without side effects
- **User Confirmation:** Preview tokens before any GitHub action

### User Experience (v1.2.1)
- **Unified Design Theme:** Consistent pink-purple gradient across all screens
- **WCAG AA Accessibility:** All color combinations meet 4.5:1+ contrast ratios (verified)
- **Keyboard Navigation:** Visible 2px focus indicators on all interactive elements
- **Readable Typography:** Minimum 11px font size with system font stack
- **No Startup Errors:** Clean console on plugin launch
- Security tooltips and guides
- Collapsible setup sections
- Performance metrics in console

---

## 📸 Screenshots

**Export Choice Interface:**
```
🎉 Tokens Extracted Successfully!
┌─────────────────────────────────┐
│  45 Total Tokens    12.3 KB     │
└─────────────────────────────────┘

🚀 Push to GitHub                Ready
💾 Download JSON File    Always Available
```

**GitHub Setup:**
- Real-time validation with visual feedback
- "GitHub Already Configured" status card
- Helpful tooltips for security best practices

---

## 🎯 Use Cases

- **Design Systems:** Sync design tokens to your component library
- **CI/CD Integration:** Automated token updates trigger builds
- **Multi-Platform:** Export once, transform to CSS/SCSS/JS/iOS/Android
- **Version Control:** Track token changes over time in Git
- **Team Collaboration:** Designers update tokens, developers get them automatically

---

## 📊 Performance

| Metric | Time | Note |
|--------|------|------|
| Token Extraction | **85ms** | 96.9% faster than v0.1 |
| GitHub Validation | Real-time | 1-second debounce |
| Total Plugin Launch | ~3.1s | Including GitHub push |

See [performance optimization details](LOGS/SESSION_LOG_2025-10-06_PERFORMANCE_OPTIMIZATION.md) for the complete story.

---

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Build for development (faster, no minification)
npm run build:dev

# Watch mode
npm run watch
```

**Requirements:** Node.js v22+, Figma desktop app

---

## 📚 Documentation

### For Users
- **[Quick Start Guide](docs/TOKEN_CREATION_GUIDE.md)** - How to create GitHub tokens
- **[Security Best Practices](docs/CREDENTIAL_SECURITY.md)** - Keep your credentials safe
- **[Feature List](LOGS/CURRENT_FEATURES.md)** - Complete feature overview

### For Developers
- **[Technical README](TECHNICAL_README.md)** - Detailed architecture and API docs
- **[Development Log](LOGS/PROJECT_DEVELOPMENT_LOG.md)** - Complete development history
- **[Session Logs](LOGS/)** - Day-by-day development sessions
- **[Documentation Guide](LOGS/README.md)** - How to navigate all docs

### Recent Updates
- **[v1.2.0 - UI Streamlining](LOGS/SESSION_LOG_2025-10-09_UI_IMPROVEMENTS.md)** - Smart branch dropdown, token count badges, no scrolling
- **[v1.1.0 - PR Workflow](LOGS/SESSION_LOG_2025-10-07_PR_WORKFLOW.md)** - Safe PR-based workflow, static filename
- **[Performance Optimization](LOGS/SESSION_LOG_2025-10-06_PERFORMANCE_OPTIMIZATION.md)** - 96.9% improvement achieved
- **[UI Improvements](LOGS/SESSION_LOG_2025-10-03.md)** - Security tooltips and accordion
- **[Credential Persistence](LOGS/SESSION_LOG_2025-10-02.md)** - Auto-validation UX

---

## 🔮 Roadmap (v2.0)

Planned features for future releases:

- **Multi-Format Export:** CSS, SCSS, JavaScript, iOS, Android
- **Token Transformation:** Style Dictionary integration
- **Incremental Updates:** Only extract changed tokens (~80% faster)
- **Export History:** Track and compare changes over time

See [complete roadmap](LOGS/SCOPE_TOKEN_TRANSFORMATION.md) for details.

---

## 🤝 Contributing

We welcome contributions! Please:

1. Review the [Development Log](LOGS/PROJECT_DEVELOPMENT_LOG.md) to understand the architecture
2. Check [Current Features](LOGS/CURRENT_FEATURES.md) to see what's already done
3. Read recent [session logs](LOGS/) for development patterns
4. Follow existing code style
5. Add performance timing for new operations
6. Update documentation

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

---

## 🙏 Credits

- Built with [Create Figma Plugin](https://yuanqing.github.io/create-figma-plugin/)
- Developed with [Claude Code](https://claude.com/claude-code)
- GitHub integration via [Octokit](https://github.com/octokit/octokit.js)

---

## 🔗 Resources

**Figma Plugin Development:**
- [Figma Plugin API](https://figma.com/plugin-docs/)
- [Plugin Samples](https://github.com/figma/plugin-samples)
- [Create Figma Plugin](https://yuanqing.github.io/create-figma-plugin/)

**This Project:**
- [Technical Documentation](TECHNICAL_README.md)
- [Complete Feature List](LOGS/CURRENT_FEATURES.md)
- [Development History](LOGS/PROJECT_DEVELOPMENT_LOG.md)
- [Changelog](CHANGELOG.md)

---

**Made with ❤️ for design systems**

*Version 1.2.0 - Production Ready*
*Last Updated: October 9, 2025*

---

## 📝 Version History

- **v1.2.0** (Oct 9, 2025) - Streamlined PR UI with smart branch dropdown
- **v1.1.0** (Oct 7, 2025) - PR-based workflow, static filename
- **v1.0.0** (Oct 6, 2025) - Performance optimization (96.9% faster)
- **v0.9.0** (Oct 3, 2025) - UI polish, security tooltips
- **v0.8.0** (Oct 2, 2025) - Credential persistence
