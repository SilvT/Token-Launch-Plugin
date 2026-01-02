# Token Launch - Developer Documentation

**Technical overview and development resources for the Token Launch Figma plugin.**

[![Version](https://img.shields.io/badge/version-1.3.1-blue.svg)]()
[![Build Status](https://img.shields.io/badge/build-passing-success.svg)]()
[![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)]()
[![Figma Plugin](https://img.shields.io/badge/figma%20plugin-api%20v1-purple.svg)]()

---

## 🏗️ Architecture Overview

### **Core Components**

- **Token Extraction Engine**: Extracts design tokens from Figma variables, styles, and components
- **GitHub Integration**: Secure API integration for automated push to repositories
- **Export Workflows**: Multiple export formats and delivery methods
- **UI System**: Unified design system with shared components and styling
- **Secure Storage**: Encrypted credential management within Figma

### **Technology Stack**

- **Frontend**: TypeScript, HTML5, CSS3
- **Build System**: Figma Plugin API, Webpack-based build
- **APIs**: GitHub REST API, Figma Plugin API
- **Security**: AES encryption for credential storage
- **Performance**: Lazy loading, optimized token extraction (~85ms)

---

## 🚀 Quick Development Setup

### **Prerequisites**
```bash
- Node.js 16+
- npm or yarn
- Figma Desktop App
- Git
```

### **Installation**
```bash
# Clone repository
git clone https://github.com/SilvT/Token-Launch-Plugin.git
cd token-launch-plugin

# Install dependencies
npm install

# Build development version
npm run build

# Build for production
npm run build:prod
```

### **Development Workflow**
```bash
# Watch mode for development
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint
```

---

## 📁 Project Structure

```
src/
├── main.ts                    # Plugin entry point
├── TokenExtractor.ts          # Core token extraction logic
├── MainWithChoice.ts          # Main UI orchestrator
├── ui/                        # UI components
│   ├── UnifiedExportUI.ts     # Main export interface
│   ├── PRWorkflowUI.ts        # GitHub workflow interface
│   ├── GitHubSetupUI.ts       # Setup wizard
│   └── styles/theme.ts        # Design system theme
├── github/                    # GitHub integration
│   ├── GitHubClient.ts        # API client
│   └── GitHubTypes.ts         # Type definitions
├── design-system/             # UI design system
│   ├── tokens.ts              # Design tokens
│   ├── html-utils.ts          # HTML/CSS utilities
│   └── icons.ts               # Icon system
├── storage/                   # Data persistence
│   └── SecureStorage.ts       # Encrypted storage
└── workflow/                  # Export workflows
    └── ExportWorkflow.ts      # Export orchestration
```

---

## 🔄 Current Workflow Implementation

### **Direct Push Workflow**
Token Launch currently implements a **direct push** workflow:

1. **Branch Selection**: Users choose main branch, existing branch, or create new branch
2. **Commit Message**: Auto-suggested based on changes since last push
3. **Direct Push**: JSON file pushed directly to chosen branch (no PR creation)
4. **Metadata Tracking**: Includes timestamps and change tracking for CI/CD integration

### **JSON Output Structure**
```typescript
interface TokenOutput {
  tokens: DesignToken[];
  metadata: {
    timestamp: string;
    figmaDocumentId: string;
    changesSinceLastPush: string;
    version: string;
  };
}
```

### **GitHub Actions Ready**
The JSON format is designed to integrate seamlessly with GitHub Actions or other CI/CD systems for automatic conversion to target formats.

---

## 🔧 Key APIs and Interfaces

### **Token Extraction API**
```typescript
interface ExtractionResult {
  tokens: DesignToken[];
  variables: VariableToken[];
  collections: Collection[];
  metadata: DocumentInfo;
  styleGuide: StyleGuideData;
}
```

### **GitHub Integration API**
```typescript
interface GitHubConfig {
  credentials: { token: string; username: string };
  repository: { owner: string; name: string; branch: string };
  paths: { rawTokens: string; processedTokens: string };
  commitMessage: string;
  metadata: { timestamp: string; changesSinceLastPush: string };
}
```

### **Export Workflow API**
```typescript
interface ExportChoice {
  type: 'git-push' | 'download' | 'cancel';
  gitConfig?: GitHubConfig;
}
```

---

## 🎨 Design System

The plugin includes a comprehensive design system with:

### **Color Palette**
- **Primary**: Purple/Lavender (`#C084FC`, `#DEE3FC`)
- **Secondary**: Neutrals (`#0F1112`, `#B1B2B6`)
- **Accent**: Blush/Mint (`#F7E3E3`, `#6FBFAD`)

### **Typography Scale**
- **Display**: 48px/56px for hero numbers
- **Headings**: 32px, 24px, 20px, 16px
- **Body**: 14px (default), 16px (large), 12px (small)

### **Component System**
- Buttons (Primary, Secondary, Tertiary)
- Cards with hover effects
- Form inputs with validation states
- Loading states and animations

---

## 🔒 Security Implementation

### **Credential Storage**
- All tokens encrypted using Figma's secure storage API
- No credentials stored in plain text
- Optional credential persistence (user choice)

### **GitHub API Access**
- Minimal scope requirements (`repo` or `public_repo`)
- No admin or delete permissions needed
- Direct connection (no intermediary servers)

### **Data Privacy**
- No telemetry or analytics collection
- No data sent to third parties
- Local processing only

---

## 📊 Performance Metrics

### **Current Benchmarks (v1.3.1)**
- **Plugin Load Time**: ~300ms
- **Token Extraction**: ~85ms (96.9% faster than v1.0)
- **GitHub API Calls**: ~1.2s average
- **UI Render Time**: <200ms
- **Build Size**: 266KB minified

### **Optimization Features**
- Lazy loading of UI components
- Dynamic page access for better memory usage
- Efficient token extraction algorithms
- CDN-optimized icon loading

---

## 🧪 Testing

### **Manual Testing Checklist**
```bash
# Core Functionality
□ Token extraction from variables
□ Token extraction from styles
□ GitHub authentication
□ Repository validation
□ File upload to GitHub
□ Download JSON functionality

# Error Handling
□ Invalid GitHub tokens
□ Network failures
□ Repository access issues
□ Malformed token data

# UI/UX
□ Loading states
□ Form validation
□ Responsive layouts
□ Accessibility compliance
```

### **Test Commands**
```bash
# Lint code
npm run lint

# Type check
npm run typecheck

# Build verification
npm run build && npm run build:prod
```

---

## 🚢 Deployment Process

### **Release Workflow**
1. **Version Bump**: Update version in `manifest.json`
2. **Build**: `npm run build:prod`
3. **Test**: Manual testing checklist
4. **Tag**: `git tag -a v1.x.x -m "Release notes"`
5. **Publish**: Submit to Figma Community

### **Build Outputs**
- `build/code.js` - Main plugin code
- `build/ui.html` - UI entry point
- `manifest.json` - Figma plugin manifest

---

## 🐛 Common Development Issues

### **Plugin Not Loading**
```typescript
// Check manifest.json permissions
{
  "documentAccess": "current-page", // Required for token access
  "networkAccess": { "allowedDomains": ["api.github.com"] }
}
```

### **Token Extraction Failures**
```typescript
// Ensure proper page access
await figma.loadFontAsync(node.fontName);
const styles = await figma.getLocalPaintStyles();
```

### **GitHub API Issues**
```typescript
// Proper error handling
try {
  const response = await fetch(githubUrl, {
    headers: { 'Authorization': `token ${token}` }
  });
  if (!response.ok) throw new Error(`GitHub API: ${response.status}`);
} catch (error) {
  // Handle network/auth errors
}
```

---

## 📚 Additional Resources

### **Figma Plugin Development**
- [Figma Plugin API Documentation](https://www.figma.com/plugin-docs/)
- [Plugin Manifest Reference](https://www.figma.com/plugin-docs/manifest/)

### **GitHub API**
- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [Personal Access Token Guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

### **TypeScript Resources**
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Figma Plugin Types](https://www.figma.com/plugin-docs/typescript/)

---

## 🤝 Contributing

### **Development Guidelines**
- Follow TypeScript strict mode
- Use existing design system components
- Maintain backward compatibility
- Document API changes
- Test across different Figma documents

### **Code Style**
- 2-space indentation
- camelCase for variables/functions
- PascalCase for classes/interfaces
- Descriptive variable names
- JSDoc comments for public APIs

### **Pull Request Process**
1. Fork repository
2. Create feature branch
3. Follow coding standards
4. Test thoroughly
5. Submit PR with clear description

---

## 📈 Roadmap

### **Upcoming Features (v1.4)**
- **Pull Request Workflows**: Optional PR creation instead of direct pushes
- **GitHub Actions Integration**: Built-in CI/CD pipeline setup from the plugin
- **More Export Formats**: CSS, SCSS, mobile platforms (iOS, Android)
- **Enhanced Previews**: See exactly what will be exported before pushing

### **Future Considerations (v2.0)**
- **More Git Platforms**: GitLab, Bitbucket, Azure DevOps
- **Advanced CI/CD**: Custom pipeline templates and configurations
- **Multi-format Export**: Simultaneous export to multiple formats
- **Team Collaboration**: Shared configurations and workflow templates

---

## 📞 Developer Support

**Technical Issues:**
- Review this documentation first
- Check [development logs](./archive/development-logs/) for historical context
- Examine [project documentation](./project-docs/) for requirements

**Architecture Questions:**
- Review [technical overview](./dev-docs/TECHNICAL_README.md)
- Check component documentation in source files
- Reference API documentation above

**Bug Reports:**
- Include Figma version, OS, and browser details
- Provide steps to reproduce
- Include relevant console errors
- Test with minimal reproduction case

---

*Last Updated: December 30, 2025 • Version 1.3.1*