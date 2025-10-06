# Final Output Format with $extensions

## Overview

The plugin now outputs tokens with Figma-specific metadata in a `$extensions.figma` object, following industry standards for token extensions.

## Changes from Previous Version

### Added ✅
- **`$extensions.figma`** - Figma-specific metadata
  - `id` - Variable ID
  - `collectionId` - Collection ID
  - `scopes` - Figma scopes array

### Removed ❌
- ~~`hiddenFromPublishing` filter~~ - All tokens now included

## Token Structure

### Basic Token
```json
{
  "name": "brand/600",
  "type": "color",
  "value": {
    "hex": "#1d6bc1"
  },
  "mode": "Mode 1",
  "$extensions": {
    "figma": {
      "id": "VariableID:1:1880",
      "collectionId": "VariableCollectionId:1:1823",
      "scopes": ["ALL_SCOPES"]
    }
  }
}
```

### Token with Transparency
```json
{
  "name": "brand/500-a50",
  "type": "color",
  "value": {
    "hex": "#297dce",
    "alpha": 0.5,
    "rgba": "rgba(41, 125, 206, 0.5)"
  },
  "mode": "Mode 1",
  "$extensions": {
    "figma": {
      "id": "VariableID:1:1875",
      "collectionId": "VariableCollectionId:1:1823",
      "scopes": ["ALL_SCOPES"]
    }
  }
}
```

### Token with Alias
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
  "description": "Main background color",
  "mode": "Mode 1",
  "$extensions": {
    "figma": {
      "id": "VariableID:2059:500",
      "collectionId": "VariableCollectionId:2059:493",
      "scopes": ["ALL_FILLS"]
    }
  }
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
  },
  "mode": "Mode 1",
  "$extensions": {
    "figma": {
      "id": "VariableID:28:36425",
      "collectionId": "VariableCollectionId:1:1823",
      "scopes": ["WIDTH_HEIGHT", "GAP"]
    }
  }
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
  },
  "$extensions": {
    "figma": {
      "id": "VariableID:2059:795",
      "collectionId": "VariableCollectionId:2059:545",
      "scopes": ["FONT_SIZE", "FONT_WEIGHT", "LINE_HEIGHT", "LETTER_SPACING"]
    }
  }
}
```

## Full Document Example

```json
{
  "version": "2.0.0",
  "generatedAt": "2025-10-06T20:30:00.000Z",
  "source": {
    "document": "MKM - Token",
    "originalTokenCount": 98,
    "originalVariableCount": 212
  },
  "collections": {
    "Primitives": {
      "tokens": {
        "color": [
          {
            "name": "brand/950",
            "type": "color",
            "value": {
              "hex": "#102441"
            },
            "mode": "Mode 1",
            "$extensions": {
              "figma": {
                "id": "VariableID:1:1878",
                "collectionId": "VariableCollectionId:1:1823",
                "scopes": ["ALL_SCOPES"]
              }
            }
          },
          {
            "name": "brand/500-a50",
            "type": "color",
            "value": {
              "hex": "#297dce",
              "alpha": 0.5,
              "rgba": "rgba(41, 125, 206, 0.5)"
            },
            "mode": "Mode 1",
            "$extensions": {
              "figma": {
                "id": "VariableID:1:1875",
                "collectionId": "VariableCollectionId:1:1823",
                "scopes": ["ALL_SCOPES"]
              }
            }
          }
        ],
        "dimension": [
          {
            "name": "spacing/12",
            "type": "dimension",
            "value": {
              "value": 12,
              "unit": "px"
            },
            "mode": "Mode 1",
            "$extensions": {
              "figma": {
                "id": "VariableID:28:36425",
                "collectionId": "VariableCollectionId:1:1823",
                "scopes": ["WIDTH_HEIGHT", "GAP"]
              }
            }
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
            "value": {
              "hex": "#ffffff"
            },
            "$alias": {
              "name": "neutral/0"
            },
            "description": "Main background color",
            "mode": "Mode 1",
            "$extensions": {
              "figma": {
                "id": "VariableID:2059:500",
                "collectionId": "VariableCollectionId:2059:493",
                "scopes": ["ALL_FILLS"]
              }
            }
          }
        ]
      }
    }
  }
}
```

## $extensions.figma Object

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ Yes | Figma variable ID (e.g., "VariableID:1:1878") |
| `collectionId` | string | ⚠️ Conditional | Collection ID (included if available) |
| `scopes` | string[] | ⚠️ Conditional | Figma scopes array (included if non-empty) |

### Common Scope Values

- **ALL_SCOPES** - Can be used anywhere
- **ALL_FILLS** - Fill colors
- **STROKE_COLOR** - Stroke colors
- **TEXT_FILL** - Text colors
- **WIDTH_HEIGHT** - Width and height dimensions
- **GAP** - Gap/spacing values
- **FONT_SIZE** - Font sizes
- **FONT_WEIGHT** - Font weights
- **LINE_HEIGHT** - Line heights
- **LETTER_SPACING** - Letter spacing values

## What's Included ✅

- ✅ Token name
- ✅ Token type
- ✅ Token value (cleaned - only hex for opaque colors)
- ✅ Description (if non-empty and not "empty")
- ✅ `$alias.name` (reference name)
- ✅ Mode
- ✅ **`$extensions.figma`** with id, collectionId, scopes

## What's Excluded ❌

- ❌ RGB, HSL, HSB (unless alpha ≠ 1)
- ❌ Empty descriptions
- ❌ Descriptions with value "empty"
- ❌ Top-level metadata per token

## Color Value Logic

### Opaque (alpha = 1)
```json
{
  "value": {
    "hex": "#1d6bc1"
  }
}
```

### Transparent (alpha ≠ 1)
```json
{
  "value": {
    "hex": "#297dce",
    "alpha": 0.5,
    "rgba": "rgba(41, 125, 206, 0.5)"
  }
}
```

## Benefits

### 1. Industry Standard
The `$extensions` pattern follows the [Design Tokens Community Group (DTCG)](https://tr.designtokens.org/format/) specification for vendor-specific extensions.

### 2. Figma Integration
The `id` allows you to:
- Link back to Figma variables
- Update specific tokens programmatically
- Maintain sync between code and design

### 3. Scope Information
Scopes tell you:
- Where the token can be used in Figma
- What properties it applies to
- How to validate token usage

### 4. Collection Tracking
The `collectionId` allows you to:
- Group tokens by collection
- Track token organization
- Maintain collection structure

## Usage Examples

### Find Token by Figma ID
```javascript
const tokens = require('./figma-tokens.json');

function findTokenById(id) {
  for (const collection of Object.values(tokens.collections)) {
    for (const tokenArray of Object.values(collection.tokens)) {
      const found = tokenArray.find(t => t.$extensions?.figma?.id === id);
      if (found) return found;
    }
  }
  return null;
}

const token = findTokenById('VariableID:1:1880');
console.log(token.name); // "brand/600"
```

### Filter by Scope
```javascript
function getTokensByScope(scope) {
  const result = [];
  for (const collection of Object.values(tokens.collections)) {
    for (const tokenArray of Object.values(collection.tokens)) {
      const filtered = tokenArray.filter(t =>
        t.$extensions?.figma?.scopes?.includes(scope)
      );
      result.push(...filtered);
    }
  }
  return result;
}

const fillColors = getTokensByScope('ALL_FILLS');
```

### Generate Figma Plugin Code
```javascript
// Use the IDs to update variables in Figma
const brandColor = findTokenByName('brand/600');
const variableId = brandColor.$extensions.figma.id;

// In your Figma plugin:
const variable = figma.variables.getVariableById(variableId);
```

## Build Status

```bash
✅ Typechecked in 1.045s
✅ Built in 0.060s
```

## Summary

The plugin now outputs tokens with:
- ✅ Clean values (hex only for opaque colors)
- ✅ Figma metadata in `$extensions.figma`
- ✅ All tokens included (no hiddenFromPublishing filter)
- ✅ Industry-standard extensions format
- ✅ Full Figma integration data

**Ready to use with full Figma traceability!** 🎉
