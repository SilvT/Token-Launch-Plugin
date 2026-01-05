/**
 * Token Launch - Figma Plugin for Design Token Automation
 * Copyright (c) 2026 Silvia Travieso
 * Licensed under the MIT License
 *
 * TokenExtractor - Comprehensive design token extraction for Token Launch
 *
 * This class handles extraction of all design token types from Figma documents,
 * including colors, typography, spacing, effects, and Figma variables.
 *
 * @author Token Launch
 * @version 1.0.0
 */

// =============================================================================
// TYPE DEFINITIONS AND INTERFACES
// =============================================================================

/**
 * Base interface for all design tokens
 */
interface BaseToken {
  id: string;
  name: string;
  description?: string;
  category?: string;
  type: TokenType;
  value: any;
  metadata: TokenMetadata;
  figmaNodeId?: string;
  variableId?: string;
}

/**
 * Token metadata for tracking creation, modification, and usage
 */
interface TokenMetadata {
  createdAt: Date;
  modifiedAt: Date;
  creator?: string;
  version: string;
  usage?: TokenUsage[];
  tags?: string[];
  deprecated?: boolean;
  deprecationReason?: string;
}

/**
 * Token usage tracking
 */
interface TokenUsage {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  pageId: string;
  pageName: string;
}

/**
 * Supported token types
 */
type TokenType =
  | 'color'
  | 'typography'
  | 'spacing'
  | 'border-radius'
  | 'shadow'
  | 'blur'
  | 'stroke'
  | 'dimension'
  | 'opacity'
  | 'font-family'
  | 'font-weight'
  | 'font-size'
  | 'line-height'
  | 'letter-spacing'
  | 'paragraph-spacing'
  | 'text-case'
  | 'text-decoration'
  | 'string'
  | 'boolean';

/**
 * Color token interface
 */
interface ColorToken extends BaseToken {
  type: 'color';
  value: {
    hex: string;
    rgb: { r: number; g: number; b: number };
    hsl: { h: number; s: number; l: number };
    hsb: { h: number; s: number; b: number };
    alpha: number;
    gradient?: GradientData;
    pattern?: ImageData;
  };
}

/**
 * Gradient data structure with variable reference support
 */
interface GradientData {
  type: 'linear' | 'radial' | 'angular' | 'diamond';
  stops: Array<{
    position: number;
    color?: { r: number; g: number; b: number; a: number };
    variableReference?: {
      id: string;
      name: string;
      type: 'VARIABLE_REFERENCE';
    };
  }>;
  transform?: Transform;
}

/**
 * Typography token interface
 */
interface TypographyToken extends BaseToken {
  type: 'typography';
  value: {
    fontFamily: string;
    fontWeight: number | string;
    fontSize: number;
    lineHeight: number | string;
    letterSpacing: number | string;
    paragraphSpacing?: number;
    textCase?: 'original' | 'upper' | 'lower' | 'title';
    textDecoration?: 'none' | 'underline' | 'strikethrough';
    fontStyle?: 'normal' | 'italic';
    textAlign?: 'left' | 'center' | 'right' | 'justified';
  };
}

/**
 * Spacing token interface
 */
interface SpacingToken extends BaseToken {
  type: 'spacing';
  value: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
    horizontal?: number;
    vertical?: number;
    all?: number;
    gap?: number;
  };
}

/**
 * Effect token interface (shadows, blur, etc.)
 */
interface EffectToken extends BaseToken {
  type: 'shadow' | 'blur' | 'border-radius';
  value: {
    type: 'drop-shadow' | 'inner-shadow' | 'layer-blur' | 'background-blur' | 'border-radius';
    x?: number;
    y?: number;
    blur: number;
    spread?: number;
    color?: { r: number; g: number; b: number; a: number };
    radius?: number | { topLeft: number; topRight: number; bottomLeft: number; bottomRight: number };
    visible?: boolean;
  };
}

/**
 * Stroke token interface
 */
interface StrokeToken extends BaseToken {
  type: 'stroke';
  value: {
    color: { r: number; g: number; b: number; a: number };
    weight: number;
    align: 'inside' | 'center' | 'outside';
    cap?: 'none' | 'round' | 'square' | 'arrow_lines' | 'arrow_equilateral';
    join?: 'miter' | 'bevel' | 'round';
    dashPattern?: number[];
    visible?: boolean;
  };
}

/**
 * Figma variable token interface
 */
interface VariableToken extends BaseToken {
  type: TokenType;
  value: any;
  variable: {
    id: string;
    name: string;
    description: string;
    resolvedType: VariableResolvedDataType;
    scopes: VariableScope[];
    collectionId: string;
    collectionName: string;
    modes: Record<string, any>;
    valuesByMode: Record<string, any>;
    codeSyntax: Record<string, string>;
    hiddenFromPublishing: boolean;
  };
}

/**
 * Variable collection information
 */
interface ExtractedVariableCollection {
  id: string;
  name: string;
  description: string;
  modes: Array<{
    modeId: string;
    name: string;
  }>;
  variables: VariableToken[];
  remote: boolean;
  hiddenFromPublishing: boolean;
}

/**
 * Extraction configuration
 */
interface ExtractionConfig {
  includeLocalStyles: boolean;
  includeComponentTokens: boolean;
  includeVariables: boolean;
  traverseInstances: boolean;
  maxDepth: number;
  includeHiddenLayers: boolean;
  includeMetadata: boolean;
  filterByPage?: string[];
  filterByNodeType?: NodeType[];
  customFilters?: Array<(node: SceneNode) => boolean>;
}

/**
 * Extraction result
 */
interface ExtractionResult {
  tokens: BaseToken[];
  variables: VariableToken[];
  collections: ExtractedVariableCollection[];
  metadata: {
    extractedAt: Date;
    documentId: string;
    documentName: string;
    totalNodes: number;
    processedNodes: number;
    errors: ExtractionError[];
    warnings: string[];
  };
}

/**
 * Extraction error
 */
interface ExtractionError {
  nodeId?: string;
  nodeName?: string;
  error: string;
  severity: 'warning' | 'error' | 'critical';
  context?: any;
}

// =============================================================================
// TOKEN EXTRACTOR CLASS
// =============================================================================

/**
 * Comprehensive token extractor for Figma design systems
 *
 * This class provides methods to extract all types of design tokens from Figma documents,
 * including colors, typography, spacing, effects, and Figma variables with full mode support.
 */
export class TokenExtractor {
  private config: ExtractionConfig;
  private errors: ExtractionError[] = [];
  private warnings: string[] = [];
  private processedNodes = 0;
  private totalNodes = 0;

  // Track processed variables to avoid duplicates
  private processedVariables = new Set<string>();
  private variableRegistry = new Map<string, any>();

  /**
   * Creates a new TokenExtractor instance
   * @param config - Configuration for token extraction
   */
  constructor(config: Partial<ExtractionConfig> = {}) {
    this.config = {
      includeLocalStyles: true,
      includeComponentTokens: true,
      includeVariables: true,
      traverseInstances: false,
      maxDepth: 10,
      includeHiddenLayers: false,
      includeMetadata: true,
      ...config
    };
  }

  // =============================================================================
  // PUBLIC METHODS
  // =============================================================================

  /**
   * Extract all design tokens from the current Figma document
   * @returns Promise containing all extracted tokens and metadata
   */
  public async extractAllTokens(): Promise<ExtractionResult> {
    try {
      this.resetState();
      this.log('Starting comprehensive token extraction...');

      const result: ExtractionResult = {
        tokens: [],
        variables: [],
        collections: [],
        metadata: {
          extractedAt: new Date(),
          documentId: figma.fileKey || '',
          documentName: figma.root.name,
          totalNodes: 0,
          processedNodes: 0,
          errors: [],
          warnings: []
        }
      };

      // In dynamic-page mode, we cannot count nodes without loading pages
      // This would defeat the purpose of dynamic loading, so we set to 0
      this.totalNodes = 0;
      result.metadata.totalNodes = this.totalNodes;

      // FIRST: Pre-populate variable registry to enable proper reference handling
      if (this.config.includeVariables) {
        await this.populateVariableRegistry();
      }

      // Extract tokens in parallel for better performance
      const extractionPromises: Promise<any>[] = [];

      // Extract Figma variables (must complete before styles for proper references)
      if (this.config.includeVariables) {
        const variablesPromise = this.extractVariables().then(({ variables, collections }) => {
          result.variables = variables;
          result.collections = collections;
        });
        extractionPromises.push(variablesPromise);
      }

      // Wait for variables to complete before extracting styles (they may reference variables)
      if (this.config.includeVariables) {
        await Promise.all(extractionPromises);
        extractionPromises.length = 0;
      }

      // Now extract styles and components in parallel (they can run independently)
      if (this.config.includeLocalStyles) {
        extractionPromises.push(
          this.extractStyleTokens().then(styleTokens => {
            result.tokens.push(...styleTokens);
          })
        );
      }

      if (this.config.includeComponentTokens) {
        extractionPromises.push(
          this.extractComponentTokens().then(componentTokens => {
            result.tokens.push(...componentTokens);
          })
        );
      }

      // Wait for all parallel extractions to complete
      await Promise.all(extractionPromises);

      // Update metadata
      result.metadata.processedNodes = this.processedNodes;
      result.metadata.errors = this.errors;
      result.metadata.warnings = this.warnings;

      this.log(`Extraction complete. Found ${result.tokens.length} tokens, ${result.variables.length} variables, ${result.collections.length} collections`);

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.addError('Critical extraction failure', 'critical', { error: errorMessage });
      throw error;
    }
  }

  /**
   * Extract color tokens from paint styles and variable colors
   */
  public async extractColorTokens(): Promise<ColorToken[]> {
    const colorTokens: ColorToken[] = [];

    try {
      // Extract from local paint styles
      const paintStyles = figma.getLocalPaintStyles();
      console.log(`🎨 Found ${paintStyles.length} local paint styles`);

      for (const style of paintStyles) {
        try {
          console.log(`🎨 Processing paint style: "${style.name}" with ${style.paints?.length || 0} paints`);
          if (style.paints && style.paints.length > 0) {
            console.log(`🎨 Paint type for "${style.name}": ${style.paints[0].type}`);
          }

          const colorToken = this.convertPaintStyleToColorToken(style);
          if (colorToken) {
            console.log(`✅ Successfully converted paint style: "${style.name}" to color token`);
            colorTokens.push(colorToken);
          } else {
            console.log(`❌ Failed to convert paint style: "${style.name}" (returned null)`);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(`❌ Error processing paint style "${style.name}":`, error);
          this.addError(`Failed to process paint style: ${style.name}`, 'error', { styleId: style.id, error: errorMessage });
        }
      }

      // Extract color variables
      const colorVariables = await this.extractColorVariables();
      colorTokens.push(...colorVariables);

      this.log(`Extracted ${colorTokens.length} color tokens`);
      return colorTokens;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.addError('Failed to extract color tokens', 'error', { error: errorMessage });
      return [];
    }
  }

  /**
   * Extract typography tokens from text styles and variables
   */
  public async extractTypographyTokens(): Promise<TypographyToken[]> {
    const typographyTokens: TypographyToken[] = [];

    try {
      // Extract from local text styles
      const textStyles = figma.getLocalTextStyles();
      console.log(`📝 Found ${textStyles.length} local text styles`);

      for (const style of textStyles) {
        try {
          console.log(`📝 Processing text style: "${style.name}"`);
          const typographyToken = this.convertTextStyleToTypographyToken(style);
          if (typographyToken) {
            console.log(`✅ Successfully converted text style: "${style.name}" to typography token`);
            typographyTokens.push(typographyToken);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.addError(`Failed to process text style: ${style.name}`, 'error', { styleId: style.id, error: errorMessage });
        }
      }

      // Extract typography variables
      const typographyVariables = await this.extractTypographyVariables();
      typographyTokens.push(...typographyVariables);

      this.log(`Extracted ${typographyTokens.length} typography tokens`);
      return typographyTokens;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.addError('Failed to extract typography tokens', 'error', { error: errorMessage });
      return [];
    }
  }

  /**
   * Extract spacing tokens from auto-layout and padding properties
   */
  public async extractSpacingTokens(): Promise<SpacingToken[]> {
    const spacingTokens: SpacingToken[] = [];

    try {
      // Extract from components with auto-layout
      const components = figma.root.findAll(node =>
        node.type === 'COMPONENT' || node.type === 'COMPONENT_SET'
      ) as (ComponentNode | ComponentSetNode)[];

      for (const component of components) {
        try {
          const spacingToken = this.extractSpacingFromNode(component);
          if (spacingToken) {
            spacingTokens.push(spacingToken);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.addError(`Failed to extract spacing from component: ${component.name}`, 'error', { nodeId: component.id, error: errorMessage });
        }
      }

      // Extract spacing variables
      const spacingVariables = await this.extractSpacingVariables();
      spacingTokens.push(...spacingVariables);

      this.log(`Extracted ${spacingTokens.length} spacing tokens`);
      return spacingTokens;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.addError('Failed to extract spacing tokens', 'error', { error: errorMessage });
      return [];
    }
  }

  /**
   * Extract effect tokens (shadows, blur, border radius)
   */
  public async extractEffectTokens(): Promise<EffectToken[]> {
    const effectTokens: EffectToken[] = [];

    try {
      // Extract from local effect styles
      const effectStyles = figma.getLocalEffectStyles();
      console.log(`✨ Found ${effectStyles.length} local effect styles`);

      for (const style of effectStyles) {
        try {
          console.log(`✨ Processing effect style: "${style.name}"`);
          const effectToken = this.convertEffectStyleToEffectToken(style);
          if (effectToken) {
            console.log(`✅ Successfully converted effect style: "${style.name}" to effect token`);
            effectTokens.push(effectToken);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.addError(`Failed to process effect style: ${style.name}`, 'error', { styleId: style.id, error: errorMessage });
        }
      }

      // Extract effect variables
      const effectVariables = await this.extractEffectVariables();
      effectTokens.push(...effectVariables);

      this.log(`Extracted ${effectTokens.length} effect tokens`);
      return effectTokens;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.addError('Failed to extract effect tokens', 'error', { error: errorMessage });
      return [];
    }
  }

  // =============================================================================
  // FIGMA VARIABLES EXTRACTION
  // =============================================================================

  /**
   * Extract all Figma variables and their collections
   */
  public async extractVariables(): Promise<{ variables: VariableToken[]; collections: ExtractedVariableCollection[] }> {
    try {
      this.log('Extracting Figma variables...');

      const collections: ExtractedVariableCollection[] = [];
      const variables: VariableToken[] = [];

      // Get all variable collections
      const variableCollections = figma.variables.getLocalVariableCollections();

      for (const collection of variableCollections) {
        try {
          const collectionData = await this.processVariableCollection(collection);
          collections.push(collectionData);
          variables.push(...collectionData.variables);
        } catch (error) {
          this.addError(`Failed to process variable collection: ${collection.name}`, 'error', {
            collectionId: collection.id,
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }

      this.log(`Extracted ${variables.length} variables from ${collections.length} collections`);
      return { variables, collections };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.addError('Failed to extract variables', 'error', { error: errorMessage });
      return { variables: [], collections: [] };
    }
  }

  // =============================================================================
  // PRIVATE METHODS - STYLE CONVERSION
  // =============================================================================

  /**
   * Convert Figma paint style to color token
   */
  private convertPaintStyleToColorToken(style: PaintStyle): ColorToken | null {
    try {
      if (!style.paints || style.paints.length === 0) {
        this.addWarning(`Paint style ${style.name} has no paints`);
        return null;
      }

      const paint = style.paints[0]; // Use first paint for primary color

      if (paint.type === 'SOLID') {
        const { r, g, b } = paint.color;
        const alpha = paint.opacity !== undefined ? paint.opacity : 1;

        return {
          id: style.id,
          name: style.name,
          description: style.description,
          type: 'color',
          value: {
            hex: this.rgbToHex(r, g, b),
            rgb: { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) },
            hsl: this.rgbToHsl(r, g, b),
            hsb: this.rgbToHsb(r, g, b),
            alpha
          },
          metadata: this.createTokenMetadata(style),
          figmaNodeId: style.id
        };
      } else if (paint.type === 'GRADIENT_LINEAR' || paint.type === 'GRADIENT_RADIAL' || paint.type === 'GRADIENT_ANGULAR' || paint.type === 'GRADIENT_DIAMOND') {
        return this.convertGradientToColorToken(style, paint);
      } else if (paint.type === 'IMAGE') {
        return this.convertImageToColorToken(style, paint);
      }

      this.addWarning(`Unsupported paint type for style ${style.name}: ${paint.type}`);
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.addError(`Failed to convert paint style ${style.name}`, 'error', { error: errorMessage });
      return null;
    }
  }

  /**
   * Convert gradient paint to color token with variable reference support
   */
  private convertGradientToColorToken(style: PaintStyle, paint: GradientPaint): ColorToken {
    console.log(`🌈 Converting gradient "${style.name}" of type ${paint.type}`);
    console.log(`🌈 Gradient has ${paint.gradientStops.length} stops`);

    const gradientType = paint.type.replace('GRADIENT_', '').toLowerCase() as 'linear' | 'radial' | 'angular' | 'diamond';

    // Process gradient stops with variable reference handling
    const processedStops = paint.gradientStops.map(stop => {
      const variableId = this.getVariableIdFromReference(stop.color);

      if (variableId) {
        // This is a variable reference - store reference instead of extracting value
        const variableInfo = this.getVariableInfo(variableId);
        this.log(`Gradient stop references variable: ${variableInfo?.name || variableId}`);

        return {
          position: stop.position,
          variableReference: {
            id: variableId,
            name: variableInfo?.name || 'Unknown Variable',
            type: 'VARIABLE_REFERENCE' as const
          }
        };
      } else {
        // Direct color value - process normally
        return {
          position: stop.position,
          color: {
            r: stop.color.r,
            g: stop.color.g,
            b: stop.color.b,
            a: stop.color.a
          }
        };
      }
    });

    // Calculate primary color from first stop
    const firstStop = processedStops[0];
    let primaryColor = { r: 0, g: 0, b: 0 };

    if ('color' in firstStop && firstStop.color) {
      primaryColor = firstStop.color;
    } else if ('variableReference' in firstStop) {
      // For variable references, we'll use a placeholder or resolve the variable
      this.log(`Primary color is variable reference: ${firstStop.variableReference.name}`);
      // You could resolve the variable value here if needed
    }

    const token: ColorToken = {
      id: style.id,
      name: style.name,
      description: style.description,
      type: 'color',
      value: {
        hex: this.rgbToHex(primaryColor.r, primaryColor.g, primaryColor.b),
        rgb: {
          r: Math.round(primaryColor.r * 255),
          g: Math.round(primaryColor.g * 255),
          b: Math.round(primaryColor.b * 255)
        },
        hsl: this.rgbToHsl(primaryColor.r, primaryColor.g, primaryColor.b),
        hsb: this.rgbToHsb(primaryColor.r, primaryColor.g, primaryColor.b),
        alpha: 1,
        gradient: {
          type: gradientType,
          stops: processedStops,
          transform: paint.gradientTransform
        }
      },
      metadata: this.createTokenMetadata(style),
      figmaNodeId: style.id
    };

    console.log(`✅ Successfully created gradient token for "${style.name}"`);
    return token;
  }

  /**
   * Convert image paint to color token
   */
  private convertImageToColorToken(style: PaintStyle, paint: ImagePaint): ColorToken {
    return {
      id: style.id,
      name: style.name,
      description: style.description,
      type: 'color',
      value: {
        hex: '',
        rgb: { r: 0, g: 0, b: 0 },
        hsl: { h: 0, s: 0, l: 0 },
        hsb: { h: 0, s: 0, b: 0 },
        alpha: paint.opacity !== undefined ? paint.opacity : 1,
        pattern: {} as any
      },
      metadata: this.createTokenMetadata(style),
      figmaNodeId: style.id
    };
  }

  /**
   * Convert text style to typography token
   */
  private convertTextStyleToTypographyToken(style: TextStyle): TypographyToken | null {
    try {
      // Defensive checks for typography properties
      this.log(`Processing text style: ${style.name}`);

      // Validate font name properties
      const fontFamily = style.fontName?.family || 'Arial';
      const fontWeight = style.fontName?.style || 'Regular';

      // Log property availability for debugging
      this.log(`Font family: ${fontFamily}, Font weight: ${fontWeight}`);

      // Safe font style extraction
      const fontStyle = this.extractFontStyle(style.fontName?.style);

      // Safe text align extraction
      const textAlign = this.extractTextAlign(style);

      return {
        id: style.id,
        name: style.name,
        description: style.description || '',
        type: 'typography',
        value: {
          fontFamily: fontFamily,
          fontWeight: fontWeight,
          fontSize: style.fontSize || 16,
          lineHeight: this.convertLineHeightSafe(style.lineHeight),
          letterSpacing: this.convertLetterSpacingSafe(style.letterSpacing),
          paragraphSpacing: style.paragraphSpacing || 0,
          textCase: this.convertTextCaseSafe(style.textCase),
          textDecoration: this.convertTextDecorationSafe(style.textDecoration),
          fontStyle: fontStyle,
          textAlign: textAlign
        },
        metadata: this.createTokenMetadata(style),
        figmaNodeId: style.id
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.addError(`Failed to convert text style ${style.name}`, 'error', {
        error: errorMessage,
        styleId: style.id,
        fontName: style.fontName,
        fontSize: style.fontSize
      });
      return null;
    }
  }

  /**
   * Convert effect style to effect token
   */
  private convertEffectStyleToEffectToken(style: EffectStyle): EffectToken | null {
    try {
      if (!style.effects || style.effects.length === 0) {
        this.addWarning(`Effect style ${style.name} has no effects`);
        return null;
      }

      const effect = style.effects[0]; // Use first effect

      return {
        id: style.id,
        name: style.name,
        description: style.description,
        type: this.mapEffectType(effect.type),
        value: {
          type: effect.type.toLowerCase().replace('_', '-') as any,
          x: 'offset' in effect ? effect.offset.x : undefined,
          y: 'offset' in effect ? effect.offset.y : undefined,
          blur: effect.radius,
          spread: 'spread' in effect ? effect.spread : undefined,
          color: 'color' in effect ? {
            r: effect.color.r,
            g: effect.color.g,
            b: effect.color.b,
            a: effect.color.a
          } : undefined,
          visible: effect.visible
        },
        metadata: this.createTokenMetadata(style),
        figmaNodeId: style.id
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.addError(`Failed to convert effect style ${style.name}`, 'error', { error: errorMessage });
      return null;
    }
  }

  // =============================================================================
  // PRIVATE METHODS - VARIABLE PROCESSING
  // =============================================================================

  /**
   * Process a variable collection and extract all variables
   */
  private async processVariableCollection(collection: any): Promise<ExtractedVariableCollection> {
    const variables: VariableToken[] = [];

    // Get all variables in this collection
    const variableIds = collection.variableIds || [];

    for (const variableId of variableIds) {
      try {
        const variable = figma.variables.getVariableById(variableId);
        if (variable) {
          const variableToken = await this.convertFigmaVariableToToken(variable, collection);
          if (variableToken) {
            variables.push(variableToken);
          }
        }
      } catch (error) {
        this.addError(`Failed to process variable ${variableId}`, 'error', {
          variableId,
          collectionId: collection.id,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    return {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      modes: collection.modes.map((mode: any) => ({
        modeId: mode.modeId,
        name: mode.name
      })),
      variables,
      remote: collection.remote,
      hiddenFromPublishing: collection.hiddenFromPublishing
    };
  }

  /**
   * Convert Figma variable to token
   */
  private async convertFigmaVariableToToken(variable: Variable, collection: any): Promise<VariableToken | null> {
    try {
      // Check if this variable has already been processed
      if (this.isVariableProcessed(variable.id)) {
        this.log(`Skipping already processed variable: ${variable.name} (${variable.id})`);
        return null;
      }

      this.log(`Processing variable: ${variable.name} (type: ${variable.resolvedType})`);

      // Mark as processed to prevent duplicates
      this.markVariableAsProcessed(variable.id);

      const tokenType = this.mapVariableTypeToTokenType(variable.resolvedType);
      const baseValue = this.getVariableBaseValue(variable);

      // Enhanced value processing based on variable type
      const processedValue = this.processVariableValue(variable.resolvedType, baseValue, variable);

      this.log(`Variable ${variable.name}: tokenType=${tokenType}, baseValue=${JSON.stringify(baseValue)}, processedValue=${JSON.stringify(processedValue)}`);

      return {
        id: variable.id,
        name: variable.name,
        description: variable.description || '',
        type: tokenType,
        value: processedValue,
        metadata: this.createVariableMetadata(variable),
        variableId: variable.id,
        variable: {
          id: variable.id,
          name: variable.name,
          description: variable.description || '',
          resolvedType: variable.resolvedType,
          scopes: variable.scopes,
          collectionId: collection.id,
          collectionName: collection.name,
          modes: Object.fromEntries(collection.modes.map((mode: any) => [mode.modeId, mode.name])),
          valuesByMode: variable.valuesByMode,
          codeSyntax: variable.codeSyntax,
          hiddenFromPublishing: variable.hiddenFromPublishing
        }
      };
    } catch (error) {
      this.addError(`Failed to convert variable ${variable.name}`, 'error', {
        variableId: variable.id,
        variableType: variable.resolvedType,
        valuesByMode: variable.valuesByMode,
        error: error instanceof Error ? error.message : String(error)
      });
      return null;
    }
  }

  /**
   * Extract color variables specifically
   */
  private async extractColorVariables(): Promise<ColorToken[]> {
    const colorTokens: ColorToken[] = [];

    try {
      const collections = figma.variables.getLocalVariableCollections();

      for (const collection of collections) {
        for (const variableId of collection.variableIds) {
          const variable = figma.variables.getVariableById(variableId);
          if (variable && variable.resolvedType === 'COLOR') {
            const colorToken = await this.convertColorVariableToToken(variable, collection);
            if (colorToken) {
              colorTokens.push(colorToken);
            }
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.addError('Failed to extract color variables', 'error', { error: errorMessage });
    }

    return colorTokens;
  }

  /**
   * Convert color variable to color token
   */
  private async convertColorVariableToToken(variable: Variable, collection: any): Promise<ColorToken | null> {
    try {
      // Get the default mode value
      const defaultMode = collection.modes[0];
      const colorValue = variable.valuesByMode[defaultMode.modeId];

      if (typeof colorValue === 'object' && 'r' in colorValue && 'g' in colorValue && 'b' in colorValue) {
        const colorObj = colorValue as any;
        const { r, g, b, a = 1 } = colorObj;

        return {
          id: variable.id,
          name: variable.name,
          description: variable.description,
          type: 'color',
          value: {
            hex: this.rgbToHex(r, g, b),
            rgb: { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) },
            hsl: this.rgbToHsl(r, g, b),
            hsb: this.rgbToHsb(r, g, b),
            alpha: a
          },
          metadata: this.createVariableMetadata(variable),
          variableId: variable.id
        };
      }

      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.addError(`Failed to convert color variable ${variable.name}`, 'error', { error: errorMessage });
      return null;
    }
  }

  /**
   * Extract typography variables
   */
  private async extractTypographyVariables(): Promise<TypographyToken[]> {
    // Typography variables are typically stored as FLOAT (for sizes) or STRING (for families)
    // Implementation would depend on how typography is structured in variables
    return [];
  }

  /**
   * Extract spacing variables
   */
  private async extractSpacingVariables(): Promise<SpacingToken[]> {
    const spacingTokens: SpacingToken[] = [];

    try {
      const collections = figma.variables.getLocalVariableCollections();

      for (const collection of collections) {
        for (const variableId of collection.variableIds) {
          const variable = figma.variables.getVariableById(variableId);
          if (variable && variable.resolvedType === 'FLOAT' && this.isSpacingVariable(variable)) {
            const spacingToken = await this.convertSpacingVariableToToken(variable, collection);
            if (spacingToken) {
              spacingTokens.push(spacingToken);
            }
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.addError('Failed to extract spacing variables', 'error', { error: errorMessage });
    }

    return spacingTokens;
  }

  /**
   * Extract effect variables
   */
  private async extractEffectVariables(): Promise<EffectToken[]> {
    // Effect variables would be structured as complex objects
    // Implementation depends on how effects are stored in variables
    return [];
  }

  // =============================================================================
  // PRIVATE METHODS - COMPONENT TOKEN EXTRACTION
  // =============================================================================

  /**
   * Extract all style tokens from local styles
   */
  private async extractStyleTokens(): Promise<BaseToken[]> {
    const tokens: BaseToken[] = [];

    // Extract color tokens
    const colorTokens = await this.extractColorTokens();
    tokens.push(...colorTokens);

    // Extract typography tokens
    const typographyTokens = await this.extractTypographyTokens();
    tokens.push(...typographyTokens);

    // Extract effect tokens
    const effectTokens = await this.extractEffectTokens();
    tokens.push(...effectTokens);

    return tokens;
  }

  /**
   * Extract tokens from components
   */
  private async extractComponentTokens(): Promise<BaseToken[]> {
    const tokens: BaseToken[] = [];

    try {
      const components = figma.root.findAll(node =>
        node.type === 'COMPONENT' || node.type === 'COMPONENT_SET'
      ) as (ComponentNode | ComponentSetNode)[];

      for (const component of components) {
        const componentTokens = await this.extractTokensFromNode(component);
        tokens.push(...componentTokens);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.addError('Failed to extract component tokens', 'error', { error: errorMessage });
    }

    return tokens;
  }

  /**
   * Extract tokens from a specific node
   */
  private async extractTokensFromNode(node: SceneNode): Promise<BaseToken[]> {
    const tokens: BaseToken[] = [];
    this.processedNodes++;

    try {
      // Extract spacing from auto-layout
      if ('layoutMode' in node && node.layoutMode !== 'NONE') {
        const spacingToken = this.extractSpacingFromNode(node);
        if (spacingToken) {
          tokens.push(spacingToken);
        }
      }

      // Extract border radius
      if ('cornerRadius' in node && typeof node.cornerRadius === 'number' && node.cornerRadius > 0) {
        const borderRadiusToken = this.extractBorderRadiusFromNode(node);
        if (borderRadiusToken) {
          tokens.push(borderRadiusToken);
        }
      }

      // Extract stroke tokens
      if ('strokes' in node && node.strokes.length > 0) {
        const strokeTokens = this.extractStrokeTokensFromNode(node);
        tokens.push(...strokeTokens);
      }

      // Recursively process children if traversal is enabled
      if (this.config.traverseInstances && 'children' in node) {
        for (const child of node.children) {
          const childTokens = await this.extractTokensFromNode(child);
          tokens.push(...childTokens);
        }
      }
    } catch (error) {
      this.addError(`Failed to extract tokens from node ${node.name}`, 'error', {
        nodeId: node.id,
        error: error instanceof Error ? error.message : String(error)
      });
    }

    return tokens;
  }

  /**
   * Extract spacing token from node with auto-layout
   */
  private extractSpacingFromNode(node: SceneNode): SpacingToken | null {
    try {
      if (!('layoutMode' in node) || node.layoutMode === 'NONE') {
        return null;
      }

      const spacing: any = {};

      if ('itemSpacing' in node) {
        spacing.gap = node.itemSpacing;
      }

      if ('paddingTop' in node) {
        spacing.top = node.paddingTop;
        spacing.right = node.paddingRight;
        spacing.bottom = node.paddingBottom;
        spacing.left = node.paddingLeft;
      }

      if (Object.keys(spacing).length === 0) {
        return null;
      }

      return {
        id: `${node.id}-spacing`,
        name: `${node.name}/spacing`,
        type: 'spacing',
        value: spacing,
        metadata: this.createNodeMetadata(node),
        figmaNodeId: node.id
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.addError(`Failed to extract spacing from node ${node.name}`, 'error', { error: errorMessage });
      return null;
    }
  }

  /**
   * Extract border radius token from node
   */
  private extractBorderRadiusFromNode(node: SceneNode): EffectToken | null {
    try {
      if (!('cornerRadius' in node)) {
        return null;
      }

      let radiusValue: any;

      if (typeof node.cornerRadius === 'number') {
        radiusValue = { radius: node.cornerRadius };
      } else {
        radiusValue = {
          radius: {
            topLeft: (node as any).topLeftRadius || 0,
            topRight: (node as any).topRightRadius || 0,
            bottomLeft: (node as any).bottomLeftRadius || 0,
            bottomRight: (node as any).bottomRightRadius || 0
          }
        };
      }

      return {
        id: `${node.id}-border-radius`,
        name: `${node.name}/border-radius`,
        type: 'border-radius',
        value: {
          type: 'border-radius',
          blur: 0,
          ...radiusValue
        },
        metadata: this.createNodeMetadata(node),
        figmaNodeId: node.id
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.addError(`Failed to extract border radius from node ${node.name}`, 'error', { error: errorMessage });
      return null;
    }
  }

  /**
   * Extract stroke tokens from node
   */
  private extractStrokeTokensFromNode(node: SceneNode): StrokeToken[] {
    const strokeTokens: StrokeToken[] = [];

    try {
      if (!('strokes' in node) || !node.strokes) {
        return strokeTokens;
      }

      node.strokes.forEach((stroke, index) => {
        if (stroke.type === 'SOLID') {
          const strokeToken: StrokeToken = {
            id: `${node.id}-stroke-${index}`,
            name: `${node.name}/stroke-${index}`,
            type: 'stroke',
            value: {
              color: {
                r: stroke.color.r,
                g: stroke.color.g,
                b: stroke.color.b,
                a: stroke.opacity !== undefined ? stroke.opacity : 1
              },
              weight: ('strokeWeight' in node) ? this.safeConvertToNumber((node as any).strokeWeight, 1) : 1,
              align: ('strokeAlign' in node) ? this.safeConvertToString((node as any).strokeAlign, 'inside').toLowerCase() as any : 'inside',
              cap: ('strokeCap' in node) ? this.safeConvertToString((node as any).strokeCap, 'none').toLowerCase() as any : 'none',
              join: ('strokeJoin' in node) ? this.safeConvertToString((node as any).strokeJoin, 'miter').toLowerCase() as any : 'miter',
              dashPattern: ('dashPattern' in node) ? this.safeConvertToArray((node as any).dashPattern, []) : [],
              visible: stroke.visible
            },
            metadata: this.createNodeMetadata(node),
            figmaNodeId: node.id
          };

          strokeTokens.push(strokeToken);
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.addError(`Failed to extract strokes from node ${node.name}`, 'error', { error: errorMessage });
    }

    return strokeTokens;
  }

  // =============================================================================
  // PRIVATE METHODS - UTILITY FUNCTIONS
  // =============================================================================

  /**
   * Create token metadata from style
   */
  private createTokenMetadata(_style: BaseStyle): TokenMetadata {
    return {
      createdAt: new Date(),
      modifiedAt: new Date(),
      version: '1.0.0',
      usage: []
    };
  }

  /**
   * Create token metadata from variable
   */
  private createVariableMetadata(_variable: Variable): TokenMetadata {
    return {
      createdAt: new Date(),
      modifiedAt: new Date(),
      version: '1.0.0',
      usage: []
    };
  }

  /**
   * Create token metadata from node
   */
  private createNodeMetadata(node: SceneNode): TokenMetadata {
    return {
      createdAt: new Date(),
      modifiedAt: new Date(),
      version: '1.0.0',
      usage: [{
        nodeId: node.id,
        nodeName: node.name,
        nodeType: node.type,
        pageId: node.parent?.type === 'PAGE' ? node.parent.id : '',
        pageName: node.parent?.type === 'PAGE' ? node.parent.name : ''
      }]
    };
  }

  /**
   * Map Figma effect type to token type
   */
  private mapEffectType(effectType: string): 'shadow' | 'blur' | 'border-radius' {
    switch (effectType) {
      case 'DROP_SHADOW':
      case 'INNER_SHADOW':
        return 'shadow';
      case 'LAYER_BLUR':
      case 'BACKGROUND_BLUR':
        return 'blur';
      default:
        return 'shadow';
    }
  }

  /**
   * Process variable value based on its type
   */
  private processVariableValue(variableType: VariableResolvedDataType, baseValue: any, variable: Variable): any {
    if (baseValue === null || baseValue === undefined) {
      this.addWarning(`Variable ${variable.name} has no value`);
      return null;
    }

    try {
      switch (variableType) {
        case 'COLOR':
          return this.processColorVariableValue(baseValue);
        case 'FLOAT':
          return this.processNumberVariableValue(baseValue);
        case 'STRING':
          return this.processStringVariableValue(baseValue);
        case 'BOOLEAN':
          return this.processBooleanVariableValue(baseValue);
        default:
          this.addWarning(`Unknown variable type ${variableType} for variable ${variable.name}`);
          return baseValue;
      }
    } catch (error) {
      this.addError(`Failed to process value for variable ${variable.name}`, 'error', {
        variableType,
        baseValue,
        error: error instanceof Error ? error.message : String(error)
      });
      return baseValue;
    }
  }

  /**
   * Process color variable value
   */
  private processColorVariableValue(value: any): any {
    if (typeof value === 'object' && 'r' in value && 'g' in value && 'b' in value) {
      const { r, g, b, a = 1 } = value;
      return {
        hex: this.rgbToHex(r, g, b),
        rgb: {
          r: Math.round(r * 255),
          g: Math.round(g * 255),
          b: Math.round(b * 255)
        },
        hsl: this.rgbToHsl(r, g, b),
        hsb: this.rgbToHsb(r, g, b),
        alpha: a
      };
    }
    return value;
  }

  /**
   * Process number/float variable value
   */
  private processNumberVariableValue(value: any): any {
    if (typeof value === 'number') {
      return {
        value: value,
        unit: 'px' // Default unit, could be enhanced to detect actual unit
      };
    }
    return value;
  }

  /**
   * Process string variable value
   */
  private processStringVariableValue(value: any): any {
    if (typeof value === 'string') {
      return {
        value: value,
        type: 'string'
      };
    }
    return value;
  }

  /**
   * Process boolean variable value
   */
  private processBooleanVariableValue(value: any): any {
    if (typeof value === 'boolean') {
      return {
        value: value,
        type: 'boolean'
      };
    }
    return value;
  }

  /**
   * Map variable type to token type
   */
  private mapVariableTypeToTokenType(variableType: VariableResolvedDataType): TokenType {
    switch (variableType) {
      case 'COLOR':
        return 'color';
      case 'FLOAT':
        return 'dimension';
      case 'STRING':
        return 'string';
      case 'BOOLEAN':
        return 'boolean';
      default:
        return 'dimension';
    }
  }

  /**
   * Get base value from variable
   */
  private getVariableBaseValue(variable: Variable): any {
    const modes = Object.keys(variable.valuesByMode);
    if (modes.length > 0) {
      return variable.valuesByMode[modes[0]];
    }
    return null;
  }

  /**
   * Check if variable is spacing-related
   */
  private isSpacingVariable(variable: Variable): boolean {
    const spacingKeywords = ['spacing', 'padding', 'margin', 'gap', 'space'];
    return spacingKeywords.some(keyword =>
      variable.name.toLowerCase().includes(keyword)
    );
  }

  /**
   * Convert spacing variable to token
   */
  private async convertSpacingVariableToToken(variable: Variable, collection: any): Promise<SpacingToken | null> {
    try {
      const defaultMode = collection.modes[0];
      const value = variable.valuesByMode[defaultMode.modeId];

      if (typeof value === 'number') {
        return {
          id: variable.id,
          name: variable.name,
          description: variable.description,
          type: 'spacing',
          value: { all: value },
          metadata: this.createVariableMetadata(variable),
          variableId: variable.id
        };
      }

      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.addError(`Failed to convert spacing variable ${variable.name}`, 'error', { error: errorMessage });
      return null;
    }
  }

  // =============================================================================
  // PRIVATE METHODS - COLOR UTILITIES
  // =============================================================================

  /**
   * Convert RGB to HEX
   */
  private rgbToHex(r: number, g: number, b: number): string {
    const toHex = (value: number) => {
      const hex = Math.round(value * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  /**
   * Convert RGB to HSL
   */
  private rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    const sum = max + min;
    const l = sum / 2;

    if (diff === 0) {
      return { h: 0, s: 0, l: Math.round(l * 100) };
    }

    const s = l > 0.5 ? diff / (2 - sum) : diff / sum;

    let h: number;
    switch (max) {
      case r:
        h = ((g - b) / diff) + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
      default:
        h = 0;
    }

    h /= 6;

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  /**
   * Convert RGB to HSB
   */
  private rgbToHsb(r: number, g: number, b: number): { h: number; s: number; b: number } {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    const brightness = max;
    const saturation = max === 0 ? 0 : diff / max;

    let hue: number;
    if (diff === 0) {
      hue = 0;
    } else {
      switch (max) {
        case r:
          hue = ((g - b) / diff) + (g < b ? 6 : 0);
          break;
        case g:
          hue = (b - r) / diff + 2;
          break;
        case b:
          hue = (r - g) / diff + 4;
          break;
        default:
          hue = 0;
      }
      hue /= 6;
    }

    return {
      h: Math.round(hue * 360),
      s: Math.round(saturation * 100),
      b: Math.round(brightness * 100)
    };
  }

  // =============================================================================
  // PRIVATE METHODS - TEXT UTILITIES
  // =============================================================================

  /**
   * Extract font style with defensive checks
   */
  private extractFontStyle(fontStyle?: string): 'italic' | 'normal' {
    if (!fontStyle) {
      return 'normal';
    }

    try {
      return fontStyle.toLowerCase().includes('italic') ? 'italic' : 'normal';
    } catch (error) {
      this.addWarning(`Failed to process font style: ${fontStyle}`);
      return 'normal';
    }
  }

  /**
   * Extract text align with defensive checks
   */
  private extractTextAlign(style: TextStyle): 'left' | 'center' | 'right' | 'justified' {
    try {
      const textAlign = (style as any).textAlignHorizontal;
      if (textAlign && typeof textAlign === 'string') {
        return this.convertTextAlign(textAlign);
      }
      return 'left'; // Default fallback
    } catch (error) {
      this.addWarning(`Failed to extract text align for style: ${style.name}`);
      return 'left';
    }
  }

  /**
   * Convert Figma line height to standard format (safe version)
   */
  private convertLineHeightSafe(lineHeight: LineHeight | null | undefined): number | string {
    if (!lineHeight) {
      return 'auto';
    }

    try {
      return this.convertLineHeight(lineHeight);
    } catch (error) {
      this.addWarning(`Failed to convert line height: ${JSON.stringify(lineHeight)}`);
      return 'auto';
    }
  }

  /**
   * Convert Figma line height to standard format
   */
  private convertLineHeight(lineHeight: LineHeight): number | string {
    if (lineHeight.unit === 'PIXELS') {
      return lineHeight.value;
    } else if (lineHeight.unit === 'PERCENT') {
      return `${lineHeight.value}%`;
    }
    return 'auto';
  }

  /**
   * Convert Figma letter spacing to standard format (safe version)
   */
  private convertLetterSpacingSafe(letterSpacing: LetterSpacing | null | undefined): number | string {
    if (!letterSpacing) {
      return 'normal';
    }

    try {
      return this.convertLetterSpacing(letterSpacing);
    } catch (error) {
      this.addWarning(`Failed to convert letter spacing: ${JSON.stringify(letterSpacing)}`);
      return 'normal';
    }
  }

  /**
   * Convert Figma letter spacing to standard format
   */
  private convertLetterSpacing(letterSpacing: LetterSpacing): number | string {
    if (letterSpacing.unit === 'PIXELS') {
      return letterSpacing.value;
    } else if (letterSpacing.unit === 'PERCENT') {
      return `${letterSpacing.value}%`;
    }
    return 'normal';
  }

  /**
   * Convert Figma text case to standard format (safe version)
   */
  private convertTextCaseSafe(textCase: TextCase | null | undefined): 'original' | 'upper' | 'lower' | 'title' {
    if (!textCase) {
      return 'original';
    }

    try {
      return this.convertTextCase(textCase);
    } catch (error) {
      this.addWarning(`Failed to convert text case: ${textCase}`);
      return 'original';
    }
  }

  /**
   * Convert Figma text case to standard format
   */
  private convertTextCase(textCase: TextCase): 'original' | 'upper' | 'lower' | 'title' {
    switch (textCase) {
      case 'ORIGINAL':
        return 'original';
      case 'UPPER':
        return 'upper';
      case 'LOWER':
        return 'lower';
      case 'TITLE':
        return 'title';
      default:
        return 'original';
    }
  }

  /**
   * Convert Figma text decoration to standard format (safe version)
   */
  private convertTextDecorationSafe(textDecoration: TextDecoration | null | undefined): 'none' | 'underline' | 'strikethrough' {
    if (!textDecoration) {
      return 'none';
    }

    try {
      return this.convertTextDecoration(textDecoration);
    } catch (error) {
      this.addWarning(`Failed to convert text decoration: ${textDecoration}`);
      return 'none';
    }
  }

  /**
   * Convert Figma text decoration to standard format
   */
  private convertTextDecoration(textDecoration: TextDecoration): 'none' | 'underline' | 'strikethrough' {
    switch (textDecoration) {
      case 'UNDERLINE':
        return 'underline';
      case 'STRIKETHROUGH':
        return 'strikethrough';
      default:
        return 'none';
    }
  }

  /**
   * Convert Figma text align to standard format
   */
  private convertTextAlign(textAlign: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED' | string): 'left' | 'center' | 'right' | 'justified' {
    if (!textAlign || typeof textAlign !== 'string') {
      return 'left';
    }

    try {
      const lowerAlign = textAlign.toLowerCase();
      if (['left', 'center', 'right', 'justified'].includes(lowerAlign)) {
        return lowerAlign as 'left' | 'center' | 'right' | 'justified';
      }
      return 'left';
    } catch (error) {
      this.addWarning(`Failed to convert text align: ${textAlign}`);
      return 'left';
    }
  }

  // =============================================================================
  // PRIVATE METHODS - UTILITY AND LOGGING
  // =============================================================================

  /**
   * Reset extraction state
   */
  private resetState(): void {
    this.errors = [];
    this.warnings = [];
    this.processedNodes = 0;
    this.totalNodes = 0;
    this.processedVariables.clear();
    this.variableRegistry.clear();
  }

  /**
   * Check if a color value is a variable reference
   */
  private isVariableReference(colorValue: any): boolean {
    // Check for Figma VariableAlias structure: { type: 'VARIABLE_ALIAS', id: string }
    return colorValue &&
           typeof colorValue === 'object' &&
           colorValue.type === 'VARIABLE_ALIAS' &&
           typeof colorValue.id === 'string';
  }

  /**
   * Get variable ID from a variable reference
   */
  private getVariableIdFromReference(colorValue: any): string | null {
    if (this.isVariableReference(colorValue)) {
      return colorValue.id;
    }
    return null;
  }

  /**
   * Register a variable in the registry
   */
  private registerVariable(variable: Variable): void {
    this.variableRegistry.set(variable.id, {
      id: variable.id,
      name: variable.name,
      resolvedType: variable.resolvedType
    });
  }

  /**
   * Get variable info from registry
   */
  private getVariableInfo(variableId: string): any {
    return this.variableRegistry.get(variableId);
  }

  /**
   * Check if variable has already been processed
   */
  private isVariableProcessed(variableId: string): boolean {
    return this.processedVariables.has(variableId);
  }

  /**
   * Mark variable as processed
   */
  private markVariableAsProcessed(variableId: string): void {
    this.processedVariables.add(variableId);
  }

  /**
   * Pre-populate variable registry for reference handling
   */
  private async populateVariableRegistry(): Promise<void> {
    try {
      this.log('Pre-populating variable registry...');
      const collections = figma.variables.getLocalVariableCollections();

      for (const collection of collections) {
        for (const variableId of collection.variableIds) {
          const variable = figma.variables.getVariableById(variableId);
          if (variable) {
            this.registerVariable(variable);
          }
        }
      }

      this.log(`Registered ${this.variableRegistry.size} variables for reference handling`);
    } catch (error) {
      this.addError('Failed to populate variable registry', 'error', {
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * Count total nodes in the document
   */
  private countNodes(node: BaseNode): number {
    let count = 1;
    if ('children' in node) {
      for (const child of node.children) {
        count += this.countNodes(child);
      }
    }
    return count;
  }

  /**
   * Add error to collection
   */
  private addError(message: string, severity: 'warning' | 'error' | 'critical', context?: any): void {
    this.errors.push({
      error: message,
      severity,
      context
    });

    if (severity === 'critical') {
      console.error(`[TokenExtractor] CRITICAL: ${message}`, context);
    } else if (severity === 'error') {
      console.error(`[TokenExtractor] ERROR: ${message}`, context);
    }
  }

  /**
   * Add warning to collection
   */
  private addWarning(message: string): void {
    this.warnings.push(message);
    console.warn(`[TokenExtractor] WARNING: ${message}`);
  }

  /**
   * Log information
   * Note: Disabled to reduce console clutter. Enable for debugging.
   */
  private log(message: string): void {
    // console.log(`[TokenExtractor] ${message}`);
  }

  /**
   * Safely convert a value to number, handling Symbol values
   */
  private safeConvertToNumber(value: any, defaultValue: number): number {
    if (value === null || value === undefined) {
      return defaultValue;
    }

    // Handle Symbol values which can't be converted to numbers
    if (typeof value === 'symbol') {
      this.addWarning(`Cannot convert Symbol value to number, using default: ${defaultValue}`);
      return defaultValue;
    }

    // Try to convert to number
    const numValue = Number(value);
    if (isNaN(numValue)) {
      this.addWarning(`Invalid number value: ${value}, using default: ${defaultValue}`);
      return defaultValue;
    }

    return numValue;
  }

  /**
   * Safely convert a value to string, handling Symbol values
   */
  private safeConvertToString(value: any, defaultValue: string): string {
    if (value === null || value === undefined) {
      return defaultValue;
    }

    // Handle Symbol values which can't be converted to strings
    if (typeof value === 'symbol') {
      this.addWarning(`Cannot convert Symbol value to string, using default: ${defaultValue}`);
      return defaultValue;
    }

    // Convert to string
    try {
      return String(value);
    } catch (error) {
      this.addWarning(`Failed to convert value to string: ${value}, using default: ${defaultValue}`);
      return defaultValue;
    }
  }

  /**
   * Safely convert a value to array, handling Symbol values
   */
  private safeConvertToArray(value: any, defaultValue: any[]): any[] {
    if (value === null || value === undefined) {
      return defaultValue;
    }

    // Handle Symbol values which can't be converted
    if (typeof value === 'symbol') {
      this.addWarning(`Cannot convert Symbol value to array, using default: ${JSON.stringify(defaultValue)}`);
      return defaultValue;
    }

    // Check if it's already an array
    if (Array.isArray(value)) {
      try {
        return [...value];
      } catch (error) {
        this.addWarning(`Failed to spread array value, using default: ${JSON.stringify(defaultValue)}`);
        return defaultValue;
      }
    }

    // Try to convert to array if it's array-like
    try {
      if (value && typeof value === 'object' && 'length' in value) {
        return Array.from(value);
      }
    } catch (error) {
      this.addWarning(`Failed to convert value to array: ${value}, using default: ${JSON.stringify(defaultValue)}`);
    }

    return defaultValue;
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default TokenExtractor;

export type {
  BaseToken,
  ColorToken,
  TypographyToken,
  SpacingToken,
  EffectToken,
  StrokeToken,
  VariableToken,
  ExtractedVariableCollection,
  ExtractionConfig,
  ExtractionResult,
  ExtractionError,
  TokenMetadata,
  TokenUsage,
  TokenType
};