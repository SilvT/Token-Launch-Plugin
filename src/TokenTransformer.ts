/**
 * TokenTransformer - Converts raw extracted tokens to clean, developer-friendly format
 *
 * Features:
 * - Removes redundant variable objects
 * - Resolves aliases while preserving references
 * - Consolidates fragmented typography tokens
 * - Removes unnecessary metadata
 * - Organizes hierarchically by collection/type
 *
 * @version 2.0.0
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface CleanToken {
  name: string;
  type: string;
  value: any;
  description?: string;
  $alias?: {
    name: string;
  };
  mode?: string;
  collectionName?: string;
  $extensions?: {
    figma: {
      id: string;
      collectionId?: string;
      scopes?: string[];
    };
  };
}

export interface CleanTypographyToken extends CleanToken {
  type: 'typography';
  properties: {
    fontSize?: { value: any; $alias?: { name: string } };
    fontWeight?: { value: any; $alias?: { name: string } };
    lineHeight?: { value: any; $alias?: { name: string } };
    letterSpacing?: { value: any; $alias?: { name: string } };
  };
}

export interface CleanCollection {
  tokens: {
    [tokenType: string]: CleanToken[];
  };
}

export interface CleanTokenOutput {
  _metadata?: {
    file: string;
    exportedAt: string;
    exportedBy: string;
    sourceDocument: string;
    totalTokens: number;
    totalVariables: number;
    collections: string[];
  };
  version: string;
  generatedAt: string;
  source: {
    document: string;
    originalTokenCount: number;
    originalVariableCount: number;
  };
  collections: {
    [collectionName: string]: CleanCollection;
  };
}

// =============================================================================
// TOKEN TRANSFORMER CLASS
// =============================================================================

export class TokenTransformer {
  private variableMap: Map<string, any>;
  private collections: Map<string, CleanCollection>;

  constructor() {
    this.variableMap = new Map();
    this.collections = new Map();
  }

  /**
   * Transform raw extraction result to clean format
   */
  public transform(rawData: any): CleanTokenOutput {
    console.log('🔄 TokenTransformer processing data:', {
      variables: rawData.variables?.length || 0,
      designTokens: rawData.designTokens?.length || 0
    });

    // Build index for alias resolution
    this.buildVariableIndex(rawData.variables || []);

    // Extract clean tokens from variables
    const variableTokens = this.extractCleanTokens(rawData.variables || []);
    console.log(`✅ Extracted ${variableTokens.length} tokens from variables`);

    // Extract clean tokens from design tokens (styles)
    const styleTokens = this.extractCleanStyleTokens(rawData.designTokens || []);
    console.log(`✅ Extracted ${styleTokens.length} tokens from styles`);

    // Combine all tokens
    const tokens = [...variableTokens, ...styleTokens];

    // Consolidate typography tokens
    const consolidatedTokens = this.consolidateTypography(tokens);

    // Organize hierarchically
    const organized = this.organizeHierarchically(consolidatedTokens);

    // Create final output
    return {
      version: '2.0.0',
      generatedAt: new Date().toISOString(),
      source: {
        document: rawData.metadata?.sourceDocument?.name || 'Unknown',
        originalTokenCount: rawData.metadata?.tokenCounts?.totalTokens || 0,
        originalVariableCount: rawData.metadata?.tokenCounts?.totalVariables || 0
      },
      collections: organized
    };
  }

  /**
   * Build index of all variables for alias resolution
   */
  private buildVariableIndex(variables: any[]): void {
    variables.forEach(variable => {
      const id = variable.id || variable.variableId;
      if (id) {
        this.variableMap.set(id, variable);
      }
    });
  }

  /**
   * Resolve a variable alias to its actual value
   */
  private resolveAlias(aliasValue: any, maxDepth: number = 10): any {
    if (!aliasValue || typeof aliasValue !== 'object') {
      return aliasValue;
    }

    if (aliasValue.type === 'VARIABLE_ALIAS' && aliasValue.id) {
      if (maxDepth <= 0) {
        console.warn(`Max depth reached resolving alias ${aliasValue.id}`);
        return aliasValue;
      }

      const referencedVariable = this.variableMap.get(aliasValue.id);
      if (!referencedVariable) {
        console.warn(`Cannot resolve alias: ${aliasValue.id}`);
        return aliasValue;
      }

      // Return both resolved value and reference info
      const resolvedValue = this.resolveAlias(referencedVariable.value, maxDepth - 1);
      return {
        value: resolvedValue,
        $ref: referencedVariable.name,
        $refId: aliasValue.id
      };
    }

    return aliasValue;
  }

  /**
   * Clean color value - remove RGB, HSL, HSB unless alpha != 1
   */
  private cleanColorValue(value: any): any {
    if (!value || typeof value !== 'object') return value;

    // If it's a color value object
    if (value.hex !== undefined) {
      const hasTransparency = value.alpha !== undefined && value.alpha !== 1;

      if (hasTransparency) {
        // Keep hex, alpha, and rgba for transparency
        return {
          hex: value.hex,
          alpha: value.alpha,
          ...(value.rgb && {
            rgba: `rgba(${value.rgb.r}, ${value.rgb.g}, ${value.rgb.b}, ${value.alpha})`
          })
        };
      } else {
        // Only keep hex for opaque colors
        return {
          hex: value.hex
        };
      }
    }

    // If it's a gradient, clean each stop
    if (value.stops && Array.isArray(value.stops)) {
      return {
        ...value,
        stops: value.stops.map((stop: any) => ({
          ...stop,
          color: this.cleanColorValue(stop.color)
        }))
      };
    }

    return value;
  }

  /**
   * Extract clean tokens from style tokens (paint styles, text styles, effect styles)
   */
  private extractCleanStyleTokens(styleTokens: any[]): CleanToken[] {
    return styleTokens.map(styleToken => {
      console.log(`🎨 Processing style token: "${styleToken.name}" of type ${styleToken.type}`);

      // Clean color values for style tokens
      let value = styleToken.value;
      if (styleToken.type === 'color') {
        value = this.cleanColorValue(value);
      }

      return {
        name: styleToken.name,
        description: styleToken.description || '',
        type: styleToken.type,
        value: value,
        collection: this.extractCollectionFromStyleName(styleToken.name),
        reference: null, // Style tokens don't have references
        originalType: styleToken.type,
        source: 'style', // Distinguish from variable source
        figmaNodeId: styleToken.figmaNodeId
      };
    });
  }

  /**
   * Extract collection name from style token name (e.g., "gradient/surface/main" → "gradient")
   */
  private extractCollectionFromStyleName(name: string): string {
    // Split by '/' and take first part as collection
    const parts = name.split('/');
    return parts.length > 1 ? parts[0] : 'Styles';
  }

  /**
   * Extract clean token from raw variable
   */
  private extractCleanTokens(variables: any[]): CleanToken[] {
    return variables.map(variable => {
      const collectionName = variable.variable?.collectionName || 'Uncategorized';
      const modes = variable.variable?.modes || {};
      const modeNames = Object.values(modes);

      // Resolve value
      let value = variable.value;
      let reference = null;

      if (value && typeof value === 'object' && value.type === 'VARIABLE_ALIAS') {
        const resolved = this.resolveAlias(value);
        if (resolved.$ref) {
          value = resolved.value;
          reference = {
            name: resolved.$ref
          };
        }
      }

      // Clean color values (remove RGB, HSL, HSB unless alpha != 1)
      if (variable.type === 'color') {
        value = this.cleanColorValue(value);
      }

      const token: CleanToken = {
        name: variable.name,
        type: variable.type,
        value: value,
        collectionName: collectionName
      };

      // Add description only if non-empty and not "empty"
      if (variable.description &&
          variable.description.trim() !== '' &&
          variable.description.toLowerCase() !== 'empty') {
        token.description = variable.description;
      }

      // Add reference info if this is an alias
      if (reference) {
        token.$alias = reference;
      }

      // Add mode info if available
      if (modeNames.length > 0) {
        token.mode = modeNames[0] as string;
      }

      // Add $extensions with Figma-specific data
      token.$extensions = {
        figma: {
          id: variable.id || variable.variableId,
          ...(variable.variable?.collectionId && { collectionId: variable.variable.collectionId }),
          ...(variable.variable?.scopes && variable.variable.scopes.length > 0 && { scopes: variable.variable.scopes })
        }
      };

      return token;
    });
  }

  /**
   * Consolidate fragmented typography tokens
   */
  private consolidateTypography(tokens: CleanToken[]): CleanToken[] {
    const typography: { [key: string]: CleanTypographyToken } = {};
    const otherTokens: CleanToken[] = [];

    tokens.forEach(token => {
      // Check if this is a fragmented typography token
      const match = token.name.match(/^([^/]+\/\d+)\/(size|weight|LH|LS)$/);

      if (match) {
        const [, baseName, property] = match;

        if (!typography[baseName]) {
          typography[baseName] = {
            name: baseName,
            type: 'typography',
            value: null,
            collectionName: (token as any).collectionName,
            mode: token.mode,
            properties: {}
          } as any;
        }

        // Map property names to standard names
        const propertyMap: { [key: string]: string } = {
          'size': 'fontSize',
          'weight': 'fontWeight',
          'LH': 'lineHeight',
          'LS': 'letterSpacing'
        };

        const standardName = propertyMap[property] || property;
        typography[baseName].properties[standardName as keyof CleanTypographyToken['properties']] = {
          value: token.value,
          ...(token.$alias && { $alias: token.$alias })
        } as any;

        // Preserve description from any fragment
        if (token.description && !typography[baseName].description) {
          typography[baseName].description = token.description;
        }
      } else {
        otherTokens.push(token);
      }
    });

    // Convert typography map to array and merge with other tokens
    return [...otherTokens, ...Object.values(typography)];
  }

  /**
   * Organize tokens hierarchically by collection and type
   */
  private organizeHierarchically(tokens: CleanToken[]): { [key: string]: CleanCollection } {
    const organized: { [key: string]: CleanCollection } = {};

    tokens.forEach(token => {
      const collectionName = (token as any).collectionName || 'uncategorized';

      if (!organized[collectionName]) {
        organized[collectionName] = {
          tokens: {}
          // Removed id field
        };
      }

      const collection = organized[collectionName];
      const tokenType = token.type || 'unknown';

      if (!collection.tokens[tokenType]) {
        collection.tokens[tokenType] = [];
      }

      // Remove collection from token since it's implicit in structure
      const cleanToken = { ...token };
      delete (cleanToken as any).collectionName;

      collection.tokens[tokenType].push(cleanToken);
    });

    return organized;
  }
}
