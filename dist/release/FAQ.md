# Frequently Asked Questions (FAQ)

*This document addresses common questions from designers, stakeholders, and first-time users of the Figma Token Launch plugin.*

---

## 🎯 General Questions

### What does this plugin do?
The plugin extracts design tokens (colors, typography, spacing, etc.) from your Figma documents and automatically pushes them to your GitHub repository as JSON files. This bridges the gap between design and development teams.

### Do I need to know how to code to use this plugin?
No! The plugin is designed for designers and non-technical users. You just need:
- A Figma document with design tokens
- A GitHub account (free)
- 5 minutes for initial setup

### What are "design tokens"?
Design tokens are the building blocks of your design system - colors, font sizes, spacing values, shadows, etc. They ensure consistency across your digital products.

---

## 🔧 Setup & Installation

### How do I install this plugin?
**Option 1: From Figma Community (Recommended)**
1. Open Figma
2. Go to Plugins → Browse all plugins
3. Search for "Token Launch"
4. Click Install

**Option 2: Manual Installation**
1. Download the plugin files
2. Go to Plugins → Development → Import plugin from manifest
3. Select the `manifest.json` file

### What is a GitHub Personal Access Token?
It's like a password that lets the plugin safely connect to your GitHub account. Don't worry - we have a step-by-step guide to create one safely. The plugin will show you exactly what to do.

### Is my GitHub information secure?
Yes! Your credentials are encrypted and stored locally in Figma. They never leave your computer except to connect directly to GitHub.

---

## 📁 GitHub & Git Questions

### I don't use Git/GitHub. Can I still use this plugin?
Absolutely! You can download the tokens as a JSON file instead of pushing to GitHub. Your developer can then use this file however they prefer.

### What's the difference between GitHub and Git?
- **Git**: A system for tracking changes to files
- **GitHub**: A website that uses Git and makes it easier to collaborate on projects
- **For you**: GitHub is where your design tokens will be stored so developers can access them

### Do I need to understand Pull Requests?
No. The plugin can create Pull Requests automatically, but you don't need to understand the technical details. Think of it as a "proposed change" that your developer can review.

### What if I don't have permission to access the GitHub repository?
Ask your developer or project manager to:
1. Add you as a collaborator to the repository, OR
2. Provide you with a Personal Access Token that has the right permissions

---

## 🎨 Design Token Questions

### What tokens does the plugin extract?
- **Colors**: Fill colors, stroke colors, effect colors
- **Typography**: Font families, sizes, weights, line heights
- **Spacing**: Padding, margins, grid systems
- **Effects**: Drop shadows, inner shadows, blurs
- **Variables**: Any Figma variables you've created

### Do I need to organize my tokens in a special way?
No special organization required! The plugin automatically finds and extracts tokens from:
- Color styles
- Text styles
- Effect styles
- Figma variables
- Component properties

### What if my tokens have the same name?
The plugin handles this automatically by including the full path/collection name to avoid conflicts.

---

## 🔄 Workflow Questions

### How often should I run the plugin?
Run it whenever you've made changes to your design tokens that developers need. This could be:
- Daily during active design phases
- Weekly for maintenance
- After major design updates

### Can multiple designers use this on the same project?
Yes! The plugin creates timestamped branches, so multiple people can push tokens without conflicts.

### What happens if something goes wrong?
The plugin has multiple safety features:
- It never pushes directly to your main branch
- You can always download locally as backup
- All changes go through Pull Requests for review
- Clear error messages guide you to solutions

---

## 🛠️ Troubleshooting

### The plugin says "Setup Required"
You need to configure your GitHub connection:
1. Go to the GitHub Setup tab in the plugin
2. Follow the step-by-step guide to create a Personal Access Token
3. Enter your repository information
4. Click "Validate & Save Configuration"

### "Repository not found" error
Check that:
- Repository name is correct (format: `username/repository-name`)
- You have access to the repository
- Your Personal Access Token has the right permissions

### The plugin seems slow or stuck
- Check your internet connection
- Make sure Figma is running smoothly
- Try closing and reopening the plugin
- If it persists, try downloading tokens locally instead

### I can't see my tokens in the exported file
Make sure your design elements are using:
- Published color/text/effect styles, OR
- Figma variables, OR
- Local styles in your document

---

## 📞 Getting Help

### Where can I get more help?
1. **This FAQ** - Check if your question is answered here
2. **Plugin Help** - Look for help links and tooltips within the plugin
3. **Your Developer** - They can help with GitHub setup and repository access
4. **Documentation** - Detailed guides available in the plugin repository

### How do I report a bug or request a feature?
1. Check if it's a known issue in the documentation
2. Contact your development team first
3. If it's a plugin issue, report it through the proper channels

### The plugin isn't working at all
Try these steps:
1. Restart Figma
2. Check that you're using the Figma desktop app (not browser)
3. Verify your internet connection
4. Try the plugin on a simpler document first

---

## 🎓 Learning Resources

### I want to understand Git/GitHub better
- [GitHub's "Git Handbook"](https://guides.github.com/introduction/git-handbook/)
- [GitHub Desktop app](https://desktop.github.com/) - Visual interface for Git
- Ask your developer for a quick walkthrough

### I want to learn more about design tokens
- [Design Tokens W3C Community Group](https://www.w3.org/community/design-tokens/)
- [Figma's guide to design tokens](https://help.figma.com/hc/en-us/articles/15145852043927-Create-and-manage-variables)

---

*This FAQ is regularly updated based on user questions. If you don't find your answer here, please reach out for help!*