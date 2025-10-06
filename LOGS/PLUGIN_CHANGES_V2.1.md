# Plugin Changes v2.1 - Cleaner Output

## Summary

Updated the plugin to produce even cleaner JSON output by removing unnecessary fields and filtering hidden tokens.

## Changes Made

### 1. Removed Fields from Output

The following fields are **no longer** included in the exported JSON:

- ❌ **`collectionId`** - Removed from collection objects
- ❌ **`id`** - Removed from `$alias` references (kept only `name`)
- ❌ **`scopes`** - Removed from all tokens
- ❌ **`metadata.version`** - Not included
- ❌ **`metadata.usage`** - Not included

### 2. Filter Hidden Tokens

Tokens with `hiddenFromPublishing: true` are now **automatically filtered out** and will not appear in the exported JSON.

## Before vs After

### Before (v2.0)
```json
{
  "collections": {
    "Primitives": {
      "id": "VariableCollectionId:1:1823",
      "tokens": {
        "color": [
          {
            "name": "brand/600",
            "type": "color",
            "value": { "hex": "#1d6bc1", ... },
            "$alias": {
              "name": "base/brand",
              "id": "VariableID:1:234"
            },
            "scopes": ["ALL_SCOPES"],
            "mode": "Mode 1"
          }
        ]
      }
    }
  }
}
```

### After (v2.1)
```json
{
  "collections": {
    "Primitives": {
      "tokens": {
        "color": [
          {
            "name": "brand/600",
            "type": "color",
            "value": { "hex": "#1d6bc1", ... },
            "$alias": {
              "name": "base/brand"
            },
            "mode": "Mode 1"
          }
        ]
      }
    }
  }
}
```

## What's Included

The output now contains **only essential information**:

✅ **Token name** - The token identifier
✅ **Token type** - color, dimension, typography, etc.
✅ **Token value** - The actual value (resolved if alias)
✅ **Description** - If present and non-empty
✅ **$alias.name** - Reference name for aliases (no ID)
✅ **Mode** - If multiple modes exist

## What's Excluded

❌ Collection IDs
❌ Variable IDs
❌ Alias IDs
❌ Scopes
❌ Version metadata
❌ Usage metadata
❌ Tokens with `hiddenFromPublishing: true`

## Hidden Token Filtering

Tokens marked as hidden in Figma will be automatically excluded:

```typescript
// In Figma, if a variable has:
variable.hiddenFromPublishing = true

// It will NOT appear in the exported JSON
```

This is useful for:
- Internal-only tokens
- Work-in-progress tokens
- Deprecated tokens you want to hide
- Test tokens

## Technical Changes

### Updated Files
- **src/TokenTransformer.ts**
  - Updated `CleanToken` interface (removed id, scopes, collectionId)
  - Updated `CleanTypographyToken` interface (removed id from $alias)
  - Updated `CleanCollection` interface (removed id)
  - Added filter for `hiddenFromPublishing` in `extractCleanTokens()`
  - Removed `id` from alias references
  - Removed `collectionId` from tokens
  - Removed `scopes` from tokens
  - Removed `id` from collections

### Build Status
✅ TypeScript compiles successfully
✅ No type errors
✅ Plugin builds correctly

## Usage

Simply export from the plugin as usual:

1. **Run plugin** in Figma
2. **Export tokens** (console, download, or GitHub)
3. **Get clean JSON** automatically with:
   - No unnecessary IDs
   - No scopes
   - No hidden tokens
   - Only essential data

## Example Output Structure

```json
{
  "version": "2.0.0",
  "generatedAt": "2025-10-06T...",
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
            "value": {
              "hex": "#1d6bc1",
              "rgb": { "r": 29, "g": 107, "b": 193 },
              "hsl": { "h": 211, "s": 74, "l": 44 },
              "alpha": 1
            },
            "mode": "Mode 1"
          }
        ],
        "dimension": [
          {
            "name": "spacing/12",
            "type": "dimension",
            "value": { "value": 12, "unit": "px" },
            "description": "Small spacing unit"
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
            "value": { "hex": "#ffffff", ... },
            "$alias": {
              "name": "neutral/0"
            },
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

1. **Smaller file size** - Even more reduction by removing IDs
2. **Cleaner structure** - Only what you need
3. **Better readability** - Less clutter
4. **Hidden token support** - Control what gets exported
5. **Simplified aliases** - Just the reference name

## Version

- **v2.1.0** - Current version with cleaner output
- **v2.0.0** - Initial clean transformation
- **v1.0.0** - Original raw output

## Notes

- All changes are **backwards compatible** in structure
- Token data remains complete and usable
- Alias resolution still works perfectly
- Typography consolidation unchanged
- Hierarchical organization unchanged

---

For full documentation, see [PLUGIN_UPDATE_V2.md](PLUGIN_UPDATE_V2.md)
