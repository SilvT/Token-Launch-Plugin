# Contributing to Design System Distributor

Thank you for your interest in contributing! 🎉

This guide is written for everyone, whether you're new to GitHub or an experienced developer.

---

## Table of Contents

1. [How to Report Issues](#how-to-report-issues)
2. [How to Suggest Features](#how-to-suggest-features)
3. [How to Contribute Code](#how-to-contribute-code)
4. [Git Basics for Beginners](#git-basics-for-beginners)
5. [Code Standards](#code-standards)
6. [Getting Help](#getting-help)

---

## How to Report Issues

Found a bug? Here's how to report it:

### Step 1: Check if it's already reported
- Go to [Issues page](https://github.com/SilvT/Figma-Design-System-Distributor/issues)
- Search for keywords related to your problem
- If found, add a 👍 reaction or comment with your experience

### Step 2: Create a new issue
If not found, create a new issue:

1. Click **"New Issue"** button
2. Choose **"Bug Report"** template
3. Fill in the template:

```markdown
**Describe the bug**
A clear description of what's wrong.

**Steps to reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen instead?

**Screenshots**
If applicable, add screenshots.

**Environment**
- Figma Version: [e.g., Desktop App 116.0]
- Plugin Version: [e.g., 1.0.0]
- Operating System: [e.g., macOS 14.0]
```

### What makes a good bug report?

✅ **Good:**
> "When I click 'Complete Setup' with an invalid token, the button stays enabled instead of showing an error."

❌ **Not helpful:**
> "The setup doesn't work."

---

## How to Suggest Features

Have an idea? We'd love to hear it!

### Step 1: Check existing feature requests
- Go to [Issues page](https://github.com/SilvT/Figma-Design-System-Distributor/issues)
- Filter by label: `enhancement`
- Add 👍 to existing requests you want

### Step 2: Create a feature request

1. Click **"New Issue"**
2. Choose **"Feature Request"** template
3. Fill it out:

```markdown
**Is your feature request related to a problem?**
Describe the problem. Ex: "I'm frustrated when..."

**Describe the solution you'd like**
What would you like to happen?

**Describe alternatives you've considered**
What other solutions did you think about?

**Additional context**
Add mockups, examples, or screenshots.
```

### What makes a good feature request?

✅ **Good:**
> "Add ability to export tokens as CSS variables. This would help developers who don't use JavaScript. Example output: `--color-primary: #FF0000;`"

❌ **Not helpful:**
> "Make it better."

---

## How to Contribute Code

Want to fix a bug or add a feature? Here's how:

### Prerequisites

**What you need installed:**
- [Node.js](https://nodejs.org) (v22 or higher)
- [Git](https://git-scm.com/downloads)
- [Figma Desktop App](https://figma.com/downloads/)
- A code editor (like [VS Code](https://code.visualstudio.com/))

**Don't have these?** Follow the installation guides linked above.

---

### Step-by-Step Contribution Process

#### 1. Fork the Repository

**What is forking?** Creating your own copy of the project.

**How to fork:**
1. Go to the [repository page](https://github.com/SilvT/Figma-Design-System-Distributor)
2. Click the **"Fork"** button (top right)
3. This creates a copy at `https://github.com/YOUR-USERNAME/Figma-Design-System-Distributor`

#### 2. Clone Your Fork

**What is cloning?** Downloading the code to your computer.

**How to clone:**

Open your terminal (Command Prompt on Windows, Terminal on Mac) and type:

```bash
git clone https://github.com/YOUR-USERNAME/Figma-Design-System-Distributor.git
cd Figma-Design-System-Distributor
```

Replace `YOUR-USERNAME` with your actual GitHub username.

#### 3. Set Up the Project

**Install dependencies:**

```bash
npm install
```

**This downloads all the code libraries the project needs.**

#### 4. Create a Branch

**What is a branch?** A separate workspace for your changes.

**How to create a branch:**

```bash
git checkout -b fix/my-bug-fix
```

Or for a feature:

```bash
git checkout -b feature/my-new-feature
```

**Naming tips:**
- Use descriptive names
- Prefix with `fix/` for bugs
- Prefix with `feature/` for new features
- Use hyphens, not spaces

Examples:
- ✅ `fix/button-not-working`
- ✅ `feature/add-css-export`
- ❌ `my changes`

#### 5. Make Your Changes

**Edit the code:**
1. Open the project folder in your code editor
2. Make your changes
3. Save your files

**Test your changes:**

```bash
# Build the plugin
npm run build

# Or watch for changes
npm run watch
```

Then test in Figma:
1. Open Figma Desktop App
2. Go to **Plugins** → **Development** → **Import plugin from manifest...**
3. Select `manifest.json` from the project folder
4. Test your changes

#### 6. Commit Your Changes

**What is a commit?** Saving a snapshot of your changes.

**How to commit:**

```bash
# See what files you changed
git status

# Add files to commit
git add .

# Save the changes with a message
git commit -m "Fix: button stays enabled with invalid token"
```

**Commit message tips:**
- Start with a verb: "Fix", "Add", "Update", "Remove"
- Be specific
- Keep it short (50 characters or less)

Examples:
- ✅ `Fix: validation error when branch is empty`
- ✅ `Add: CSS export format option`
- ❌ `fixed stuff`
- ❌ `changes`

#### 7. Push to GitHub

**What is pushing?** Uploading your commits to GitHub.

**How to push:**

```bash
git push origin fix/my-bug-fix
```

Replace `fix/my-bug-fix` with your branch name.

#### 8. Create a Pull Request

**What is a Pull Request (PR)?** Asking to merge your changes into the main project.

**How to create a PR:**

1. Go to your fork on GitHub
2. You'll see a yellow banner: **"Compare & pull request"** - click it
3. Fill out the PR template:

```markdown
**What does this PR do?**
Brief description of your changes.

**Related issue**
Fixes #123 (if applicable)

**How to test**
1. Open plugin in Figma
2. Go to Setup tab
3. Enter invalid token
4. Verify error shows

**Screenshots**
Add before/after screenshots if relevant.

**Checklist**
- [ ] Tested in Figma Desktop App
- [ ] Code follows project style
- [ ] No console errors
```

4. Click **"Create pull request"**

#### 9. Wait for Review

**What happens next?**
- Maintainers will review your code
- They may ask questions or request changes
- You can discuss in the PR comments
- Once approved, your code gets merged! 🎉

**Be patient!** Reviews may take a few days.

---

## Git Basics for Beginners

### Essential Git Commands

```bash
# See current status (what files changed)
git status

# Create a new branch
git checkout -b branch-name

# Switch to a different branch
git checkout branch-name

# Add files to commit
git add .                    # Add all files
git add filename.ts          # Add specific file

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push origin branch-name

# Pull latest changes
git pull origin main

# See commit history
git log
```

### Common Git Workflows

**Made a mistake?**

```bash
# Undo changes to a file (before commit)
git checkout -- filename.ts

# Undo last commit (keep changes)
git reset HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

**Update your fork with latest changes:**

```bash
# Add original repository as "upstream"
git remote add upstream https://github.com/SilvT/Figma-Design-System-Distributor.git

# Get latest changes
git fetch upstream

# Merge into your main branch
git checkout main
git merge upstream/main

# Push to your fork
git push origin main
```

---

## Code Standards

### TypeScript Style Guide

**File naming:**
- Use PascalCase for classes: `TokenExtractor.ts`
- Use camelCase for utilities: `formatTokens.ts`

**Code formatting:**
- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Add comments for complex logic

**Example:**

```typescript
// Good ✅
export class TokenExtractor {
  private extractColors(): ColorToken[] {
    // Extract color tokens from Figma paint styles
    return figma.getLocalPaintStyles().map(style => ({
      name: style.name,
      value: this.formatColor(style)
    }));
  }
}

// Bad ❌
export class token_extractor {
    private extractColors( ){
return figma.getLocalPaintStyles().map(style=>{return {name:style.name,value:this.formatColor(style)}})
    }
}
```

### Testing Your Changes

**Before submitting a PR, make sure:**

1. ✅ Code builds without errors: `npm run build`
2. ✅ Plugin loads in Figma Desktop App
3. ✅ Your feature/fix works as expected
4. ✅ No console errors in Figma Developer Console
5. ✅ Existing features still work (didn't break anything)

**How to test:**
1. Build: `npm run build`
2. Open Figma Desktop App
3. Import plugin from `manifest.json`
4. Test your changes
5. Check console: **Plugins** → **Development** → **Open Console**

---

## Project Structure

Understanding the codebase:

```
figma-design-system-distributor/
├── src/                          # Source code
│   ├── main.ts                   # Plugin entry point
│   ├── ui/                       # User interface
│   │   ├── UnifiedExportUI.ts    # Main UI (setup, export, settings)
│   │   └── ExportChoiceUI.ts     # Export choice interface
│   ├── github/                   # GitHub integration
│   │   ├── GitHubClient.ts       # API client
│   │   ├── GitHubAuth.ts         # Authentication
│   │   ├── GitOperations.ts      # File operations
│   │   └── TokenPushService.ts   # Push orchestration
│   ├── storage/                  # Data storage
│   │   └── SecureStorage.ts      # Credential storage
│   └── types/                    # TypeScript types
│       └── CommonTypes.ts        # Shared types
├── build/                        # Compiled code (auto-generated)
├── docs/                         # Documentation
├── LOGS/                         # Development logs
├── manifest.json                 # Figma plugin manifest
├── package.json                  # Dependencies
└── README.md                     # Main documentation
```

**Where to make changes:**
- UI fixes → `src/ui/UnifiedExportUI.ts`
- GitHub features → `src/github/`
- Token extraction → `src/TokenExtractor.ts`
- Types → `src/types/CommonTypes.ts`

---

## Getting Help

**Need help contributing?**

1. **Check existing documentation:**
   - [README.md](README.md) - Feature overview
   - [CURRENT_FEATURES.md](CURRENT_FEATURES.md) - Feature list
   - Session logs in [LOGS/](LOGS/)

2. **Ask in GitHub Discussions:**
   - Go to [Discussions page](https://github.com/SilvT/Figma-Design-System-Distributor/discussions)
   - Click **"New discussion"**
   - Choose appropriate category

3. **Comment on related issues:**
   - Find related issue
   - Ask your question in comments

4. **Be specific:**
   - ✅ "I'm trying to add a CSS export feature. Where should I add the transformation logic?"
   - ❌ "How do I code?"

---

## Code of Conduct

**Be respectful:**
- ✅ Constructive feedback
- ✅ Helpful suggestions
- ✅ Patience with beginners
- ❌ Rude comments
- ❌ Personal attacks
- ❌ Harassment

**We're all learning together!**

---

## Recognition

Contributors will be:
- Listed in release notes
- Credited in commit history
- Appreciated in the community! 🙏

---

## Questions?

**Common questions:**

**Q: I've never contributed to open source before. Is that okay?**
A: Absolutely! Everyone starts somewhere. Follow this guide and ask questions.

**Q: How long does PR review take?**
A: Usually a few days. Be patient!

**Q: Can I work on an issue someone else is assigned to?**
A: Ask first in the issue comments to avoid duplicate work.

**Q: My PR was rejected. What now?**
A: Don't worry! Read feedback, make changes, and try again. Rejection is part of learning.

**Q: Can I contribute if I only know HTML/CSS?**
A: Yes! You can help with documentation, UI improvements, and testing.

---

## Thank You! 🎉

Every contribution, no matter how small, makes this project better.

**First-time contributor?** Welcome! We're here to help.

**Experienced developer?** Thank you for your expertise.

Let's build something great together! 🚀
