# Token Transformation Guide

## Overview

The token transformation script converts bloated Figma plugin output into a clean, developer-friendly JSON format. It achieves an **83.9% file size reduction** while preserving all essential information.

## Key Improvements

### 1. **Eliminated Redundancy**
- ✅ Removed duplicate `variable` objects (each token had both `variableId` AND full `variable` object)
- ✅ Removed redundant metadata (timestamps, empty arrays, version strings)
- ✅ Consolidated duplicate IDs

**Before (redundant):**
```json
{
  "id": "VariableID:1:1878",
  "variableId": "VariableID:1:1878",
  "variable": {
    "id": "VariableID:1:1878",
    "name": "brand/950",
    ...
  }
}
```

**After (clean):**
```json
{
  "name": "brand/950",
  "type": "color",
  "value": { ... }
}
```

### 2. **Resolved Aliases with References**
- ✅ Resolves `VARIABLE_ALIAS` to actual values
- ✅ Preserves reference information for traceability

**Before (unresolved):**
```json
{
  "name": "Sizing/icon/small",
  "value": {
    "type": "VARIABLE_ALIAS",
    "id": "VariableID:28:36425"
  }
}
```

**After (resolved with reference):**
```json
{
  "name": "Sizing/icon/small",
  "type": "dimension",
  "value": {
    "value": 12,
    "unit": "px"
  },
  "$alias": {
    "name": "sizing/content/12",
    "id": "VariableID:28:36425"
  }
}
```

### 3. **Consolidated Typography Tokens**
- ✅ Unified fragmented tokens (`Body/1/size`, `Body/1/weight`, `Body/1/LH`) into single composite tokens
- ✅ Standardized property names (size → fontSize, LH → lineHeight, etc.)

**Before (fragmented):**
```json
{
  "name": "Body/1/size",
  "value": { "type": "VARIABLE_ALIAS", "id": "..." }
},
{
  "name": "Body/1/weight",
  "value": { "type": "VARIABLE_ALIAS", "id": "..." }
},
{
  "name": "Body/1/LH",
  "value": { "type": "VARIABLE_ALIAS", "id": "..." }
}
```

**After (unified):**
```json
{
  "name": "Body/1",
  "type": "typography",
  "properties": {
    "fontSize": {
      "value": { "value": 14, "unit": "px" },
      "$alias": { "name": "typography/font-size/14", "id": "..." }
    },
    "fontWeight": {
      "value": 400,
      "$alias": { "name": "typography/font-weight/regular", "id": "..." }
    },
    "lineHeight": {
      "value": { "value": 20, "unit": "px" },
      "$alias": { "name": "typography/line-height/20", "id": "..." }
    }
  }
}
```

### 4. **Hierarchical Organization**
- ✅ Grouped by collection (Primitives, Semantic, Typography, etc.)
- ✅ Grouped by type (color, dimension, typography, shadow, etc.)
- ✅ Removed unnecessary nesting

**Output Structure:**
```json
{
  "version": "2.0.0",
  "generatedAt": "2025-10-06T14:59:19.652Z",
  "source": {
    "document": "MKM - Token",
    "originalTokenCount": 98,
    "originalVariableCount": 212
  },
  "collections": {
    "Primitives": {
      "id": "VariableCollectionId:1:1823",
      "tokens": {
        "color": [ ... ],
        "dimension": [ ... ]
      }
    },
    "Semantic": {
      "id": "VariableCollectionId:2059:493",
      "tokens": {
        "color": [ ... ],
        "dimension": [ ... ]
      }
    },
    "Typography": {
      "id": "VariableCollectionId:2059:545",
      "tokens": {
        "dimension": [ ... ],
        "typography": [ ... ]
      }
    }
  }
}
```

### 5. **Preserved Essential Information**
- ✅ Token descriptions (for documentation)
- ✅ Collection and mode information (for theming)
- ✅ Alias/reference relationships (for traceability)
- ✅ Scopes (for Figma integration)
- ✅ All values needed for CSS/SCSS/JS transformation

## Usage

### Basic Usage
```bash
node transform-tokens.js <input-file> [output-file]
```

### Examples
```bash
# Transform with default output name
node transform-tokens.js figma-tokens-2025-09-30-15-34-29.json

# Transform with custom output name
node transform-tokens.js figma-tokens-2025-09-30-15-34-29.json my-tokens.json
```

### Programmatic Usage
```javascript
const TokenTransformer = require('./transform-tokens');

const transformer = new TokenTransformer('input.json');
const cleanTokens = transformer.run('output.json');

// Access transformed data
console.log(cleanTokens.collections.Primitives.tokens.color);
```

## Output Format Details

### Token Structure

#### Color Token
```json
{
  "name": "brand/600",
  "type": "color",
  "value": {
    "hex": "#1d6bc1",
    "rgb": { "r": 29, "g": 107, "b": 193 },
    "hsl": { "h": 211, "s": 74, "l": 44 },
    "hsb": { "h": 211, "s": 85, "b": 76 },
    "alpha": 1
  },
  "mode": "Mode 1",
  "scopes": ["ALL_SCOPES"]
}
```

#### Dimension Token (with alias)
```json
{
  "name": "Sizing/icon/small",
  "type": "dimension",
  "value": {
    "value": 12,
    "unit": "px"
  },
  "$alias": {
    "name": "sizing/content/12",
    "id": "VariableID:28:36425"
  },
  "mode": "Mode 1",
  "scopes": ["WIDTH_HEIGHT"]
}
```

#### Typography Token (consolidated)
```json
{
  "name": "Body/1",
  "type": "typography",
  "mode": "Mode 1",
  "properties": {
    "fontSize": {
      "value": { "value": 14, "unit": "px" },
      "$alias": { "name": "typography/font-size/14", "id": "..." }
    },
    "fontWeight": {
      "value": 400,
      "$alias": { "name": "typography/font-weight/regular", "id": "..." }
    },
    "lineHeight": {
      "value": { "value": 20, "unit": "px" },
      "$alias": { "name": "typography/line-height/20", "id": "..." }
    },
    "letterSpacing": {
      "value": { "value": 0, "unit": "px" },
      "$alias": { "name": "typography/letter-spacing/0", "id": "..." }
    }
  }
}
```

#### Shadow/Effect Token
```json
{
  "name": "Drop/Main/brand",
  "type": "shadow",
  "description": "For Tooltips",
  "value": {
    "type": "drop-shadow",
    "x": 0,
    "y": 0.5,
    "blur": 1,
    "spread": 0,
    "color": {
      "r": 0.16078431904315948,
      "g": 0.4901960790157318,
      "b": 0.8078431487083435,
      "a": 0.699999988079071
    },
    "visible": true
  }
}
```

## File Size Comparison

| Metric | Before | After | Reduction |
|--------|--------|-------|-----------|
| File Size | 562.4 KB | 90.5 KB | **83.9%** |
| Variables | 212 | 212 (preserved) | - |
| Tokens | 98 | 98 (preserved) | - |
| Structure | Flat + Redundant | Hierarchical | ✓ |
| Aliases | Unresolved | Resolved | ✓ |
| Typography | Fragmented | Consolidated | ✓ |

## Next Steps

### 1. CSS/SCSS Generation
Use the clean output to generate CSS variables:

```javascript
function generateCSS(tokens) {
  const colors = tokens.collections.Primitives.tokens.color;
  return colors.map(t => `--${t.name.replace('/', '-')}: ${t.value.hex};`).join('\n');
}
```

### 2. TypeScript Types
Generate type definitions from tokens:

```javascript
function generateTypes(tokens) {
  const colors = tokens.collections.Primitives.tokens.color;
  const colorNames = colors.map(t => `'${t.name}'`).join(' | ');
  return `export type BrandColor = ${colorNames};`;
}
```

### 3. Style Dictionary Integration
The clean format is compatible with [Style Dictionary](https://amzn.github.io/style-dictionary/):

```javascript
const StyleDictionary = require('style-dictionary');

// Convert to Style Dictionary format
const sd = StyleDictionary.extend({
  source: ['tokens-clean.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [{
        destination: 'variables.css',
        format: 'css/variables'
      }]
    }
  }
});

sd.buildAllPlatforms();
```

## Troubleshooting

### Alias Resolution Issues
If aliases aren't resolving correctly:
- Check that the referenced variable exists in the input
- Verify the variable ID matches
- Check for circular references (max depth: 10)

### Typography Not Consolidating
Typography consolidation looks for this pattern:
- `{base}/{number}/{property}` (e.g., `Body/1/size`)
- Properties: `size`, `weight`, `LH` (line height), `LS` (letter spacing)

### Collection Not Found
If tokens appear in "uncategorized":
- Verify the variable has a `collection` object
- Check that `collectionName` is set in the original data

## Future Enhancements

Potential improvements to consider:
- [ ] Multi-mode support (light/dark themes)
- [ ] Token validation against schema
- [ ] Automatic CSS/SCSS/JS generation
- [ ] Integration with design token standards (W3C DTCG)
- [ ] Figma plugin integration for live sync
