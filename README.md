# Token Launch

**Your token launch pad 🚀 Connect your design to development—automatically**

Shoot your Fima Design tokens into code with one click. No technical knowledge required.

[![Version](https://img.shields.io/badge/version-1.3.2-blue.svg)]()
[![Status](https://img.shields.io/badge/status-ready%20to%20use-green.svg)]()
[![Design](https://img.shields.io/badge/made%20for-designers-purple.svg)]()
[![Simple](https://img.shields.io/badge/setup-5%20minutes-brightgreen.svg)]()
[![Safe](https://img.shields.io/badge/safe%20&%20secure-success.svg)]()
[![Accessible](https://img.shields.io/badge/WCAG-AA%20compliant-brightgreen.svg)]()

---

## 📋 Table of Contents

**Quick Navigation:**
- [✨ What This Plugin Does](#-what-this-plugin-does) • [🎯 Perfect For](#-perfect-for) • [🚀 Getting Started](#-getting-started)
- [🔧 Setup Guide](#-first-time-setup-5-minutes) • [🛡️ Security](#-security--privacy) • [🎨 Token Organization](#-how-your-tokens-are-organized)
- [🔄 Workflow](#-typical-workflow) • [🆘 Help & Support](#-need-help) • [📋 Requirements](#-system-requirements)
- [🛠️ For Developers](#️-for-developers) • [🎯 What's Next](#-whats-next)

---

## ✨ What This Plugin Does

**For Designers:**
- Extract your variales and styles from Figma
- Send them directly to your development team's codebase
- No need to manually copy values or create handoff documents
- Keep your values always Up-to-date

**It's That Simple:**
1. **Run the plugin** in your Figma document
2. **Choose how to share** - GitHub (automatic) or download file (manual)
3. **Your tokens are delivered** to your development team

---

## 🎯 Perfect For

✅ **UI/UX Designers** who want to streamline handoffs  
✅ **Design System Teams** managing design tokens  
✅ **Product Managers** coordinating design-dev workflows  
✅ **Small Teams** wanting better design-code consistency  
✅ **Anyone** tired of manually copying design values  

---

## 🚀 Getting Started

### Option 1: Download from Figma Community (Recommended)
*Coming Soon - Plugin submission in progress*

### Option 2: Install Manually (Available Now)
1. **Download:** Get the [Manifest File](/manifest.json) from this repo
2. **Install:** Figma → Plugins → Development → Import plugin from manifest
3. **Run:** Find "Token Launch" in your plugins list

---

## 🔧 First Time Setup (5 Minutes)

### Option A: GitHub Integration (Automatic)
**What you need:**
- A GitHub account (free)
- Access to your team's repository
- 5 minutes for setup

**Setup steps:**
1. Open the plugin in Figma
2. Go to the "GitHub Setup" tab
3. Follow the step-by-step guide to create a GitHub token
4. Enter your repository details
5. Click "Save" - you're done!

6. Push to Github everytime you update or change your tokens.

*The plugin includes helpful guides and tooltips for every step.*

### Option B: File Download (Manual)
**What you need:**
- Nothing! Just run the plugin and download your tokens

**How it works:**
1. Run the plugin
2. Click "Download JSON File"
3. Share the file with your developer

---

## 🛡️ Security & Privacy

**Your data is safe:**
- All credentials encrypted and stored locally in Figma
- No data sent to third parties
- Direct connection between Figma and GitHub only
- You control what gets shared and when

**GitHub access is limited:**
- Only accesses the specific repository you choose
- Can't see your personal files or other projects
- Uses industry-standard security practices

---

## 🎨 How Your Tokens Are Organized

The plugin extracts tokens from:
- **Color Styles** in your Figma document
- **Text Styles** you've created
- **Effect Styles** (shadows, blurs, etc.)
- **Figma Variables** and collections

### Modes
Every variable is exported **once per mode**. A collection with 3 modes (for example `primary`, `secondary`, `tertiary`) produces 3 rows per variable, each with a `mode` field set to that mode's name.

Values are exported exactly as Figma stores them:
- **Aliases** are kept as aliases (`{ "type": "VARIABLE_ALIAS", "id": "...", "name": "..." }`), with the variable name next to the id, so no id lookup is needed.
- **Composed colours** such as `{ color, opacity }` are kept as-is, not resolved.
- Only a raw `{r, g, b, a}` colour is converted to hex.

### Output format
- Collections appear in Figma's order, tokens are sorted by name, and every token has the same property order.
- The file body contains no per-export timestamp, so exporting twice without changing Figma produces an identical file and an empty `git diff`. A rename or edit shows up as only the lines that changed.
- The `uncategorized` group only keeps `typography`, `gradient` and `shadow` styles.

---

## 🔄 Typical Workflow

**Daily/Weekly Use:**
1. Update your design tokens in Figma
2. Run the plugin
3. Choose your target: main branch, existing branch, or create a new branch
4. Add a commit message (auto-suggests changes since last push)
5. Push directly to GitHub or download JSON file
6. Your developer receives the updates as a clean, diff-friendly file

**For GitHub Users:**
- Pushes JSON file directly to your chosen branch
- Output is deterministic, so Git diffs show only real changes
- Ready for GitHub Actions or other CI/CD workflows
- JSON can be easily converted to any format your team needs

---

## 🆘 Need Help?

**Most Common Questions:**
- [**FAQ**](./FAQ.md) - Answers to frequent questions about Git, GitHub, and design tokens

**Setup Help:**
- Built-in tooltips and guides in the plugin
- Step-by-step instructions for GitHub setup
- Clear error messages with solutions

**Still Stuck?**
- Ask your developer for help with GitHub setup
- Check the FAQ for Git/GitHub basics
- The plugin includes helpful guides for every step

---

## 📋 System Requirements

- **Figma Desktop App** (not browser version)
- **Internet connection** (for GitHub integration)
- **GitHub account** (free, for automatic workflow)

**That's it!** No coding knowledge required.

---

## 🛠️ For Developers

**Technical documentation and development resources:**
- [Developer Documentation](./dev-docs/) - Complete technical docs
- [Installation Guide](./INSTALLATION.md) - Setup and build instructions
- [Architecture Details](./dev-docs/TECHNICAL_README.md) - Technical implementation

---

## 📞 Support

**For Users:**
- Check the [FAQ](./FAQ.md) first
- Built-in help tooltips in the plugin
- Ask your development team for GitHub help

**For Developers:**
- Full technical documentation in [dev-docs/](./dev-docs/)
- Development history and architectural decisions included

---

## 🎯 What's Next

We're continuously improving the plugin based on user feedback:

- **Pull Request Workflows:** Optional PR creation instead of direct pushes
- **GitHub Actions Integration:** Built-in CI/CD pipeline setup from the plugin
- **More Export Formats:** CSS, SCSS, mobile platforms (iOS, Android)
- **More Git Platforms:** GitLab, Bitbucket...

---

*Made with ❤️ for design teams who want to move fast and stay organized.*

**Version 1.3.1** • Ready to Use • Safe & Secure