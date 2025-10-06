# Final Output Format - v2.1

## Overview

The plugin now outputs the **absolute cleanest** JSON format possible, containing only essential token data.

## What's Excluded ❌

### Completely Ignored
- ❌ **All metadata** (version, usage, timestamps, etc.)
- ❌ **RGB values** (unless alpha ≠ 1)
- ❌ **HSL values** (unless alpha ≠ 1)
- ❌ **HSB values** (unless alpha ≠ 1)
- ❌ **Collection IDs**
- ❌ **Variable IDs**
- ❌ **Alias IDs** (only name kept)
- ❌ **Scopes**
- ❌ **Descriptions with value "empty"** (case-insensitive)
- ❌ **Tokens with `hiddenFromPublishing: true`**

## What's Included ✅

### Always Included
- ✅ **Token name**
- ✅ **Token type**
- ✅ **Token value** (cleaned)
- ✅ **Mode** (if available)

### Conditionally Included
- ✅ **Description** (only if non-empty and not "empty")
- ✅ **$alias.name** (only for alias references, no ID)

## Color Value Handling

### Opaque Colors (alpha = 1)
**Input:**
```json
{
  "hex": "#1d6bc1",
  "rgb": { "r": 29, "g": 107, "b": 193 },
  "hsl": { "h": 211, "s": 74, "l": 44 },
  "hsb": { "h": 211, "s": 85, "b": 76 },
  "alpha": 1
}
```

**Output:**
```json
{
  "hex": "#1d6bc1"
}
```

### Transparent Colors (alpha ≠ 1)
**Input:**
```json
{
  "hex": "#1d6bc1",
  "rgb": { "r": 29, "g": 107, "b": 193 },
  "hsl": { "h": 211, "s": 74, "l": 44 },
  "hsb": { "h": 211, "s": 85, "b": 76 },
  "alpha": 0.5
}
```

**Output:**
```json
{
  "hex": "#1d6bc1",
  "alpha": 0.5,
  "rgba": "rgba(29, 107, 193, 0.5)"
}
```

## Description Handling

### Valid Descriptions
```json
// Included ✅
{ "description": "Primary brand color" }
{ "description": "Main background" }

// Excluded ❌
{ "description": "" }
{ "description": "   " }
{ "description": "empty" }
{ "description": "Empty" }
{ "description": "EMPTY" }
```

## Complete Output Examples

### Simple Color Token
```json
{
  "name": "brand/600",
  "type": "color",
  "value": {
    "hex": "#1d6bc1"
  }
}
```

### Color with Transparency
```json
{
  "name": "brand/500-a50",
  "type": "color",
  "value": {
    "hex": "#297dce",
    "alpha": 0.5,
    "rgba": "rgba(41, 125, 206, 0.5)"
  },
  "description": "Semi-transparent brand color"
}
```

### Dimension Token
```json
{
  "name": "spacing/12",
  "type": "dimension",
  "value": {
    "value": 12,
    "unit": "px"
  }
}
```

### Alias Token
```json
{
  "name": "background/primary",
  "type": "color",
  "value": {
    "hex": "#ffffff"
  },
  "$alias": {
    "name": "neutral/0"
  },
  "description": "Main background color"
}
```

### Typography Token (Consolidated)
```json
{
  "name": "Body/1",
  "type": "typography",
  "mode": "Mode 1",
  "properties": {
    "fontSize": {
      "value": { "value": 14, "unit": "px" },
      "$alias": { "name": "typography/font-size/14" }
    },
    "fontWeight": {
      "value": 400,
      "$alias": { "name": "typography/font-weight/regular" }
    },
    "lineHeight": {
      "value": { "value": 20, "unit": "px" },
      "$alias": { "name": "typography/line-height/20" }
    },
    "letterSpacing": {
      "value": { "value": 0, "unit": "px" },
      "$alias": { "name": "typography/letter-spacing/0" }
    }
  }
}
```

### Shadow/Effect Token
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
      "hex": "#297dce",
      "alpha": 0.7,
      "rgba": "rgba(41, 125, 206, 0.7)"
    },
    "visible": true
  }
}
```

## Full Document Structure

```json
{
  "version": "2.0.0",
  "generatedAt": "2025-10-06T17:30:00.000Z",
  "source": {
    "document": "Design System",
    "originalTokenCount": 98,
    "originalVariableCount": 212
  },
  "collections": {
    "Primitives": {
      "tokens": {
        "color": [
          {
            "name": "brand/600",
            "type": "color",
            "value": { "hex": "#1d6bc1" }
          },
          {
            "name": "brand/500-a50",
            "type": "color",
            "value": {
              "hex": "#297dce",
              "alpha": 0.5,
              "rgba": "rgba(41, 125, 206, 0.5)"
            }
          }
        ],
        "dimension": [
          {
            "name": "spacing/12",
            "type": "dimension",
            "value": { "value": 12, "unit": "px" }
          }
        ]
      }
    },
    "Semantic": {
      "tokens": {
        "color": [
          {
            "name": "background/primary",
            "type": "color",
            "value": { "hex": "#ffffff" },
            "$alias": { "name": "neutral/0" },
            "description": "Main background"
          }
        ]
      }
    },
    "Typography": {
      "tokens": {
        "typography": [
          {
            "name": "Body/1",
            "type": "typography",
            "mode": "Mode 1",
            "properties": {
              "fontSize": {
                "value": { "value": 14, "unit": "px" },
                "$alias": { "name": "typography/font-size/14" }
              },
              "fontWeight": {
                "value": 400,
                "$alias": { "name": "typography/font-weight/regular" }
              }
            }
          }
        ]
      }
    }
  }
}
```

## Benefits

### 1. Minimal File Size
- Only essential data
- No redundant color formats
- No unnecessary IDs

### 2. Developer-Friendly
- Easy to parse
- Clear structure
- Only what you need

### 3. Direct Usage
```css
/* Opaque colors */
.button {
  background: #1d6bc1; /* Direct hex value */
}

/* Transparent colors */
.overlay {
  background: rgba(41, 125, 206, 0.5); /* RGBA string provided */
}
```

```javascript
// JavaScript usage
const brandColor = tokens.collections.Primitives.tokens.color
  .find(t => t.name === 'brand/600');

console.log(brandColor.value.hex); // "#1d6bc1"
```

## Technical Details

### Color Processing
1. Check if color has `alpha !== 1`
2. If opaque: Keep only `hex`
3. If transparent: Keep `hex`, `alpha`, and generate `rgba` string
4. Remove `rgb`, `hsl`, `hsb` objects

### Description Processing
1. Check if description exists
2. Trim whitespace
3. Check if empty string after trim
4. Check if value is "empty" (case-insensitive)
5. Only include if passes all checks

### Metadata Processing
- All metadata fields are ignored at extraction time
- No version tracking
- No usage tracking
- No timestamps on individual tokens

## Version History

### v2.1 (Current)
- ✅ Clean color values (only hex unless alpha ≠ 1)
- ✅ Filter "empty" descriptions
- ✅ Remove all metadata
- ✅ Remove collection/variable/alias IDs
- ✅ Remove scopes
- ✅ Filter hidden tokens

### v2.0
- Clean transformation
- Alias resolution
- Typography consolidation
- Hierarchical organization

### v1.0
- Raw Figma output
- All metadata included
- Flat structure

---

**This is the final, cleanest possible token format!** 🎉
