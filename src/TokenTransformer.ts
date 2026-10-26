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

const UNCATEGORIZED_KEEP_TYPES = ['typography', 'gradient', 'shadow'];

export class TokenTransformer {
  private collections: Map<string, CleanCollection>;

  constructor() {
    this.collections = new Map();
  }

  /**
   * Transform raw extraction result to clean format
   */
  public transform(rawData: any): CleanTokenOutput {
    console.log('🔍 DEBUG: TokenTransformer.transform() called with:', {
      variables: rawData.variables?.length || 0,
      designTokens: rawData.designTokens?.length || 0,
      collections: rawData.collections?.length || 0
    });

    // Extract clean tokens from variables
    const variableTokens = this.extractCleanTokens(rawData.variables || []);
    console.log(`🔍 DEBUG: Extracted ${variableTokens.length} tokens from variables`);
    const rowsPerCollectionMode: Record<string, number> = {};
    variableTokens.forEach(t => {
      const key = `${(t as any).collectionName} | ${t.mode}`;
      rowsPerCollectionMode[key] = (rowsPerCollectionMode[key] || 0) + 1;
    });
    console.log('[ModeCheck] exported rows per collection | mode:', rowsPerCollectionMode);

    // Extract clean tokens from design tokens (styles)
    const styleTokens = this.extractCleanStyleTokens(rawData.designTokens || []);
    console.log(`🔍 DEBUG: Extracted ${styleTokens.length} tokens from styles`);

    // Combine all tokens
    const tokens = [...variableTokens, ...styleTokens];
    console.log(`🔍 DEBUG: Combined total tokens: ${tokens.length}`);

    if (tokens.length === 0) {
      console.log(`🚨 DEBUG: NO TOKENS after combination - investigating:`);
      console.log(`🔍 DEBUG: rawData.variables sample:`, rawData.variables?.slice(0, 2));
      console.log(`🔍 DEBUG: rawData.designTokens sample:`, rawData.designTokens?.slice(0, 2));
    }

    // Consolidate typography tokens
    const consolidatedTokens = this.consolidateTypography(tokens);
    console.log(`🔍 DEBUG: After consolidation: ${consolidatedTokens.length} tokens`);

    // Organize hierarchically, then fix ordering so repeated exports are byte-identical
    const organized = this.canonicalize(
      this.organizeHierarchically(consolidatedTokens),
      (rawData.collections || []).map((c: any) => c.name)
    );
    console.log(`🔍 DEBUG: Organized into collections:`, Object.keys(organized));

    // Create final output
    return {
      version: '2.0.0',
      source: {
        document: rawData.metadata?.sourceDocument?.name || 'Unknown',
        originalTokenCount: rawData.metadata?.tokenCounts?.totalTokens || 0,
        originalVariableCount: rawData.metadata?.tokenCounts?.totalVariables || 0
      },
      collections: organized
    };
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
      // console.log(`🎨 Processing style token: "${styleToken.name}" of type ${styleToken.type}`);

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
      const modeName = variable.modeName ?? (Object.values(variable.variable?.modes || {})[0] as string | undefined);

      // Export the mode's value unchanged; aliases keep their id and name, nothing is resolved
      const value = variable.type === 'color' ? this.cleanColorValue(variable.value) : variable.value;
      const reference = variable.value?.type === 'VARIABLE_ALIAS' && variable.value.name
        ? { name: variable.value.name }
        : null;

      // Clean color values (remove RGB, HSL, HSB unless alpha != 1)
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
      if (modeName !== undefined) {
        token.mode = modeName;
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
        const key = `${(token as any).collectionName}|${token.mode}|${baseName}`;

        if (!typography[key]) {
          typography[key] = {
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
        typography[key].properties[standardName as keyof CleanTypographyToken['properties']] = {
          value: token.value,
          ...(token.$alias && { $alias: token.$alias })
        } as any;

        // Preserve description from any fragment
        if (token.description && !typography[key].description) {
          typography[key].description = token.description;
        }
      } else {
        otherTokens.push(token);
      }
    });

    // Convert typography map to array and merge with other tokens
    return [...otherTokens, ...Object.values(typography)];
  }


  /**
   * Deterministic output: collections in Figma order (uncategorized last), token types alphabetical,
   * tokens sorted by name then mode, and a fixed property order inside each token.
   */
  private canonicalize(
    organized: { [key: string]: CleanCollection },
    figmaOrder: string[]
  ): { [key: string]: CleanCollection } {
    const rank = (name: string): number => {
      if (name === 'uncategorized') return Number.MAX_SAFE_INTEGER;
      const i = figmaOrder.indexOf(name);
      return i === -1 ? figmaOrder.length : i;
    };
    const names = Object.keys(organized).sort((a, b) => rank(a) - rank(b) || (a < b ? -1 : a > b ? 1 : 0));

    const result: { [key: string]: CleanCollection } = {};
    names.forEach(name => {
      const tokens: { [type: string]: CleanToken[] } = {};
      Object.keys(organized[name].tokens).sort().forEach(type => {
        tokens[type] = organized[name].tokens[type]
          .map(t => this.orderTokenKeys(t))
          .sort((a: any, b: any) => this.compareTokens(a, b));
      });
      result[name] = { tokens };
    });
    return result;
  }

  private static readonly TOKEN_KEY_ORDER = [
    'name', 'type', 'value', 'description', 'properties', '$alias', 'mode', 'collection', 'collectionName',
    'reference', 'originalType', 'source', 'figmaNodeId', '$extensions'
  ];

  private orderTokenKeys(token: any): any {
    const ordered: any = {};
    TokenTransformer.TOKEN_KEY_ORDER.forEach(k => {
      if (k in token) ordered[k] = token[k];
    });
    Object.keys(token).sort().forEach(k => {
      if (!(k in ordered)) ordered[k] = token[k];
    });
    return ordered;
  }

  private compareTokens(a: any, b: any): number {
    const cmp = (x: string, y: string) => (x < y ? -1 : x > y ? 1 : 0);
    return (
      cmp(String(a.name), String(b.name)) ||
      cmp(String(a.mode ?? ''), String(b.mode ?? '')) ||
      cmp(JSON.stringify(a), JSON.stringify(b))
    );
  }

  /**
   * Organize tokens hierarchically by collection and type
   */
  private organizeHierarchically(tokens: CleanToken[]): { [key: string]: CleanCollection } {
    const organized: { [key: string]: CleanCollection } = {};

    tokens.forEach(token => {
      const collectionName = (token as any).collectionName || 'uncategorized';

      // Style/node tokens land in 'uncategorized'; the pipeline only needs these groups from it
      if (collectionName === 'uncategorized' && !UNCATEGORIZED_KEEP_TYPES.includes(token.type)) {
        return;
      }

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

    if (organized['uncategorized']) {
      const counts = Object.fromEntries(
        Object.entries(organized['uncategorized'].tokens).map(([type, list]) => [type, list.length])
      );
      console.log('[UncategorizedCheck] kept groups:', counts);
    }

    return organized;
  }
}
