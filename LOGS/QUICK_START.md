# Quick Start Guide - Token Transformation

## 🎯 What This Does

Transforms your bloated Figma token JSON (562.4 KB) into a clean, developer-friendly format (90.5 KB) - **83.9% smaller!**

## 📦 Files Created

1. **[transform-tokens.js](transform-tokens.js)** - Main transformation script
2. **[generate-styles.js](generate-styles.js)** - Style generator (CSS/SCSS/JS)
3. **[tokens-clean.json](tokens-clean.json)** - Your clean tokens (83.9% smaller!)
4. **[tokens-clean.css](tokens-clean.css)** - Generated CSS custom properties
5. **[tokens-clean.scss](tokens-clean.scss)** - Generated SCSS variables
6. **[tokens-clean.js](tokens-clean.js)** - Generated JavaScript module
7. **[token-output-example.json](token-output-example.json)** - Example output
8. **[TOKEN_TRANSFORMATION_README.md](TOKEN_TRANSFORMATION_README.md)** - Full docs
9. **[TRANSFORMATION_SUMMARY.md](TRANSFORMATION_SUMMARY.md)** - Before/after comparison

## ⚡ Quick Commands

### Step 1: Transform Your Tokens
```bash
node transform-tokens.js figma-tokens-2025-09-30-15-34-29.json tokens-clean.json
```

**Output:**
```
✓ Transformation complete!
  Original size: 562.4 KB
  New size: 90.5 KB
  Reduction: 83.9%
```

### Step 2: Generate CSS
```bash
node generate-styles.js tokens-clean.json --format css
```

Creates `tokens-clean.css` with:
```css
:root {
  --brand-950: #102441;
  --brand-600: #1d6bc1;
  /* ... all tokens as CSS custom properties */
}
```

### Step 3: Generate SCSS (optional)
```bash
node generate-styles.js tokens-clean.json --format scss
```

Creates `tokens-clean.scss` with:
```scss
$brand-950: #102441;
$brand-600: #1d6bc1;
// ... all tokens as SCSS variables
```

### Step 4: Generate JavaScript (optional)
```bash
node generate-styles.js tokens-clean.json --format js
```

Creates `tokens-clean.js` with:
```javascript
export const tokens = {
  Primitives: {
    color: {
      brand_950: { value: '#102441' },
      // ...
    }
  }
};
```

## 🔍 What Got Fixed

### ✅ Removed Redundancy
Each token had `id`, `variableId`, AND full `variable` object - **removed duplicates**

### ✅ Resolved Aliases
Changed from:
```json
{ "type": "VARIABLE_ALIAS", "id": "VariableID:..." }
```
To:
```json
{
  "value": { "value": 12, "unit": "px" },
  "$alias": { "name": "sizing/content/12", "id": "VariableID:..." }
}
```

### ✅ Consolidated Typography
Changed from 3 separate tokens:
- `Body/1/size`
- `Body/1/weight`
- `Body/1/LH`

To 1 unified token:
```json
{
  "name": "Body/1",
  "type": "typography",
  "properties": {
    "fontSize": { ... },
    "fontWeight": { ... },
    "lineHeight": { ... }
  }
}
```

### ✅ Hierarchical Organization
From flat array → organized by collection → type:
```json
{
  "collections": {
    "Primitives": {
      "tokens": {
        "color": [...],
        "dimension": [...]
      }
    },
    "Semantic": { ... },
    "Typography": { ... }
  }
}
```

## 📊 Results

| Metric | Before | After |
|--------|--------|-------|
| File Size | 562.4 KB | 90.5 KB ✨ |
| Aliases | Unresolved | Resolved ✨ |
| Typography | Fragmented | Unified ✨ |
| Structure | Flat | Hierarchical ✨ |
| Metadata | Bloated | Clean ✨ |

## 💡 Use Cases

### 1. In Your CSS
```css
.button {
  background: var(--brand-600);
  padding: var(--spacings-12);
}
```

### 2. In Your SCSS
```scss
.button {
  background: $brand-600;
  padding: $spacings-12;
}
```

### 3. In Your JavaScript
```javascript
import { tokens } from './tokens-clean.js';

const brandColor = tokens.Primitives.color.brand_600.value; // '#1d6bc1'
```

### 4. With Tailwind CSS
```javascript
// tailwind.config.js
const tokens = require('./tokens-clean.json');

module.exports = {
  theme: {
    extend: {
      colors: tokens.collections.Primitives.tokens.color.reduce((acc, token) => {
        const key = token.name.replace('/', '-');
        acc[key] = token.value.hex;
        return acc;
      }, {})
    }
  }
};
```

## 🚀 Next Steps

### Option 1: Use Generated CSS Directly
```html
<link rel="stylesheet" href="tokens-clean.css">
```

### Option 2: Build with Style Dictionary
```bash
npm install style-dictionary
```

```javascript
// build-tokens.js
const StyleDictionary = require('style-dictionary');

const sd = StyleDictionary.extend({
  source: ['tokens-clean.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables'
      }]
    }
  }
});

sd.buildAllPlatforms();
```

### Option 3: Custom Integration
```javascript
const tokens = require('./tokens-clean.json');

// Access any token
const primaryBg = tokens.collections.Semantic.tokens.color
  .find(t => t.name === 'background/primary');

console.log(primaryBg.value.hex); // #ffffff
console.log(primaryBg.$alias.name); // neutral/0
```

## 📝 Common Tasks

### Find a Token by Name
```javascript
const tokens = require('./tokens-clean.json');

function findToken(name) {
  for (const collection of Object.values(tokens.collections)) {
    for (const tokenArray of Object.values(collection.tokens)) {
      const found = tokenArray.find(t => t.name === name);
      if (found) return found;
    }
  }
  return null;
}

const token = findToken('brand/600');
console.log(token.value.hex); // #1d6bc1
```

### Get All Colors
```javascript
const tokens = require('./tokens-clean.json');

function getAllColors() {
  const colors = [];
  for (const collection of Object.values(tokens.collections)) {
    if (collection.tokens.color) {
      colors.push(...collection.tokens.color);
    }
  }
  return colors;
}

const allColors = getAllColors();
```

### Export to JSON for Other Tools
```javascript
const tokens = require('./tokens-clean.json');
const fs = require('fs');

// Create a flat map for easy lookup
const flatMap = {};
for (const collection of Object.values(tokens.collections)) {
  for (const tokenArray of Object.values(collection.tokens)) {
    tokenArray.forEach(token => {
      flatMap[token.name] = token.value;
    });
  }
}

fs.writeFileSync('tokens-flat.json', JSON.stringify(flatMap, null, 2));
```

## ❓ FAQ

**Q: Can I revert back to the original format?**
A: The transformation is lossless - all IDs and references are preserved in `$alias` fields.

**Q: What about multiple modes (light/dark)?**
A: Currently single mode. Multi-mode support is on the roadmap.

**Q: Does this work with Figma Tokens plugin?**
A: The input is from Figma Variables API. For Figma Tokens plugin format, you may need to adjust the script.

**Q: Can I customize the transformation?**
A: Yes! Edit `transform-tokens.js` - it's well-commented and modular.

## 🐛 Troubleshooting

**Issue: "Cannot find module"**
```bash
# Make sure you're in the right directory
cd "/Users/silvia/Library/CloudStorage/Dropbox/marca_comercial/Figma DS Engine/figma-design-system-distributor"
```

**Issue: "Alias not resolving"**
- Check that the referenced variable exists in input
- Verify variable IDs match
- Check for circular references (max depth: 10)

**Issue: "Typography not consolidating"**
- Must match pattern: `{base}/{number}/{property}`
- Properties: `size`, `weight`, `LH`, `LS`

## 📚 Documentation

- **[TOKEN_TRANSFORMATION_README.md](TOKEN_TRANSFORMATION_README.md)** - Complete documentation
- **[TRANSFORMATION_SUMMARY.md](TRANSFORMATION_SUMMARY.md)** - Before/after examples
- **[token-output-example.json](token-output-example.json)** - Example output structure

## ✨ Summary

You now have:
- ✅ Clean, hierarchical token JSON (83.9% smaller)
- ✅ CSS custom properties ready to use
- ✅ SCSS variables ready to use
- ✅ JavaScript module ready to import
- ✅ Full documentation
- ✅ All original data preserved

**Start using your clean tokens immediately! 🚀**
