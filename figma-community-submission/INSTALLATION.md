# Installation Instructions

## Option 1: Install from GitHub Release (Recommended for Users)

**This is the easiest way to install the plugin locally before it's available on Figma Community.**

1. **Download the latest release package:**
   - Go to [Releases](https://github.com/SilvT/Figma-Design-System-Distributor/releases)
   - Download `figma-design-system-distributor-v1.3.0.zip`
   - Extract the ZIP file

2. **Install in Figma Desktop:**
   - Open Figma Desktop app
   - Go to Menu → Plugins → Development → Import plugin from manifest...
   - Navigate to the extracted folder
   - Select `manifest.json`
   - The plugin is now installed!

3. **Run the plugin:**
   - Open any Figma file
   - Go to Menu → Plugins → Development → Token Launch
   - The plugin will launch

---

## Option 2: Build from Source (For Developers)

**If you want to modify the plugin or contribute to development:**

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SilvT/Figma-Design-System-Distributor.git
   cd Figma-Design-System-Distributor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the plugin:**
   ```bash
   npm run build
   ```

   This will:
   - Typecheck the code
   - Compile TypeScript to JavaScript
   - Minify the output
   - Generate `manifest.json`
   - Create the `build/` folder

4. **Install in Figma Desktop:**
   - Open Figma Desktop app
   - Go to Menu → Plugins → Development → Import plugin from manifest...
   - Navigate to your cloned repository folder
   - Select `manifest.json`
   - The plugin is now installed!

5. **Development mode (optional):**
   ```bash
   npm run watch
   ```

   This runs the build in watch mode - any changes to source files will automatically rebuild the plugin.

---

## Troubleshooting

### Plugin doesn't appear in Figma
- Make sure you're using **Figma Desktop** (not the web version)
- Verify that `manifest.json` and `build/main.js` exist in your plugin folder
- Try removing and re-importing the plugin

### Build errors
- Ensure Node.js is installed: `node --version`
- Delete `node_modules/` and reinstall: `npm install`
- Check for TypeScript errors: `npm run build:dev`

### Plugin crashes or shows errors
- Check the Figma console (Plugins → Development → Open Console)
- Rebuild the plugin: `npm run build`
- Report issues at: https://github.com/SilvT/Figma-Design-System-Distributor/issues

---

## File Structure

After installation, your plugin folder should contain:

```
figma-design-system-distributor/
├── manifest.json          # Plugin manifest (required by Figma)
├── build/                 # Compiled plugin code
│   └── main.js           # Main plugin script
├── README.md             # User documentation
└── LICENSE               # MIT license
```

If you built from source, you'll also have:

```
├── src/                  # Source TypeScript files
├── package.json          # Node.js dependencies
├── node_modules/         # Installed dependencies
└── tsconfig.json         # TypeScript configuration
```

---

## Updating the Plugin

### From Release Package
1. Download the new release ZIP
2. Extract it (you can overwrite the old folder)
3. In Figma: Plugins → Development → Remove plugin
4. Re-import the new `manifest.json`

### From Source
```bash
git pull origin main
npm install
npm run build
```

The plugin will automatically use the new version next time you run it.

---

## Uninstalling

1. Open Figma Desktop
2. Go to Menu → Plugins → Development
3. Find "Token Launch"
4. Click the "..." menu → Remove plugin

---

## Next Steps

- Read the [README.md](README.md) for usage instructions
- Check the [FAQ.md](FAQ.md) for common questions
- For developers: See [dev-docs/TECHNICAL_README.md](dev-docs/TECHNICAL_README.md) for technical documentation
- Report bugs or request features at [GitHub Issues](https://github.com/SilvT/Figma-Design-System-Distributor/issues)

---

**Questions?** Open an issue on GitHub or check the documentation!
