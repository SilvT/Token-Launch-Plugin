# Changelog

All notable changes to the Figma Design System Distributor plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

## [Unreleased]

### Planned Features (v2.0.0)
- Multi-format token export (CSS, SCSS, JavaScript, iOS, Android)
- GitHub Actions integration for automated transformations
- Style Dictionary support
- Team collaboration features
- Export history tracking
- Token comparison and diff

---

[1.0.0]: https://github.com/SilvT/Figma-Design-System-Distributor/releases/tag/v1.0.0
