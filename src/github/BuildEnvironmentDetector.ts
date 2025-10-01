/**
 * Build Environment Detector
 *
 * Detects build characteristics that might affect method binding
 * and provides diagnostic information for troubleshooting.
 */

export interface BuildEnvironmentInfo {
  isMinified: boolean;
  isProduction: boolean;
  figmaEnvironment: {
    available: boolean;
    version?: string;
    features: string[];
  };
  jsEngine: {
    name: string;
    features: string[];
  };
  buildArtifacts: {
    hasSourceMaps: boolean;
    estimatedBundleSize: number;
    minificationLevel: 'none' | 'basic' | 'aggressive';
  };
}

export class BuildEnvironmentDetector {
  /**
   * Analyze the current runtime environment
   */
  static analyze(): BuildEnvironmentInfo {
    console.log('🔍 Analyzing build environment...');

    const isMinified = this.detectMinification();
    const figmaEnvironment = this.analyzeFigmaEnvironment();
    const jsEngine = this.analyzeJSEngine();
    const buildArtifacts = this.analyzeBuildArtifacts();

    const info: BuildEnvironmentInfo = {
      isMinified,
      isProduction: isMinified && !figmaEnvironment.features.includes('development'),
      figmaEnvironment,
      jsEngine,
      buildArtifacts
    };

    console.log('📊 Build Environment Analysis:', info);

    // Log warnings for problematic configurations
    this.logWarnings(info);

    return info;
  }

  /**
   * Detect if code has been minified
   */
  private static detectMinification(): boolean {
    // Check function names and source code characteristics
    const testFunction = function normalFunctionName() { return true; };
    const hasNormalName = testFunction.name === 'normalFunctionName';

    // Check if Error stack traces are minified
    let hasMinifiedStack = false;
    try {
      throw new Error('test');
    } catch (e) {
      const stack = (e as Error).stack || '';
      hasMinifiedStack = stack.includes('main.js:') && stack.includes('e.') || stack.includes('t.');
    }

    // Check if global variables are minified
    const globalVarNames = Object.keys(globalThis || window || {});
    const hasShortGlobalNames = globalVarNames.some(name => name.length === 1);

    const isMinified = !hasNormalName || hasMinifiedStack || hasShortGlobalNames;

    console.log(`🔧 Minification detection:`, {
      hasNormalName,
      hasMinifiedStack,
      hasShortGlobalNames,
      isMinified
    });

    return isMinified;
  }

  /**
   * Analyze Figma plugin environment
   */
  private static analyzeFigmaEnvironment(): BuildEnvironmentInfo['figmaEnvironment'] {
    const features: string[] = [];

    try {
      // Check if figma object is available with a more reliable test
      if (typeof figma === 'undefined' || !figma) {
        return {
          available: false,
          features: ['no-figma-object']
        };
      }

      // Test if figma object is actually functional (sometimes it exists but isn't ready)
      try {
        // Try accessing a basic property that should always be available
        const hasBasicAccess = typeof figma.showUI === 'function';
        if (!hasBasicAccess) {
          return {
            available: false,
            features: ['figma-object-not-functional']
          };
        }
      } catch (accessError) {
        return {
          available: false,
          features: ['figma-access-error']
        };
      }

      // Check Figma API features
      try {
        if (figma.root) features.push('document-access');
      } catch (e) {}

      try {
        if (figma.variables) features.push('variables-api');
      } catch (e) {}

      try {
        if (typeof figma.getLocalPaintStyles === 'function') features.push('styles-api');
      } catch (e) {}

      try {
        if (figma.ui) features.push('ui-api');
      } catch (e) {}

      // Check if development mode (safely handle process being undefined)
      try {
        if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
          features.push('development');
        }
      } catch (e) {
        // process is not available in Figma environment, skip
      }

      // Check plugin manifest data
      if (figma.pluginId) features.push('plugin-id-available');

      return {
        available: true,
        version: figma.apiVersion || 'unknown',
        features
      };

    } catch (error) {
      console.warn('Figma environment analysis failed:', error);
      return {
        available: false,
        features: ['analysis-failed']
      };
    }
  }

  /**
   * Analyze JavaScript engine capabilities
   */
  private static analyzeJSEngine(): BuildEnvironmentInfo['jsEngine'] {
    const features: string[] = [];

    // Check ES6+ features using safe detection methods
    try {
      // Arrow functions - test if they exist
      const arrowTest = () => true;
      if (arrowTest.toString().includes('=>')) {
        features.push('arrow-functions');
      }
    } catch {}

    try {
      // Async/await - check if async function constructor exists
      if (typeof (async function(){}).constructor === 'function') {
        features.push('async-await');
      }
    } catch {}

    try {
      // Proxies
      new Proxy({}, {});
      features.push('proxies');
    } catch {}

    try {
      // Classes - test if class syntax is supported
      const classTest = function() {};
      classTest.toString = function() { return 'class TestClass {}'; };
      if (typeof class TestClass {} === 'function') {
        features.push('classes');
      }
    } catch {}

    try {
      // Template literals - check if template strings work
      const templateTest = `template`;
      if (templateTest === 'template') {
        features.push('template-literals');
      }
    } catch {}

    // Detect engine
    let name = 'unknown';
    if (typeof navigator !== 'undefined') {
      const userAgent = navigator.userAgent;
      if (userAgent.includes('Chrome')) name = 'V8 (Chrome)';
      else if (userAgent.includes('Firefox')) name = 'SpiderMonkey (Firefox)';
      else if (userAgent.includes('Safari')) name = 'JavaScriptCore (Safari)';
    }

    return { name, features };
  }

  /**
   * Analyze build artifacts
   */
  private static analyzeBuildArtifacts(): BuildEnvironmentInfo['buildArtifacts'] {
    // Check for source maps
    const hasSourceMaps = !!(
      (Error as any).captureStackTrace ||
      (new Error().stack?.includes('.map'))
    );

    // Estimate bundle size (rough approximation)
    let estimatedBundleSize = 0;
    try {
      // Count global properties as proxy for bundle size
      const globalProps = Object.keys(globalThis || window || {});
      estimatedBundleSize = globalProps.length * 100; // rough estimate
    } catch {}

    // Detect minification level
    let minificationLevel: 'none' | 'basic' | 'aggressive' = 'none';
    const testClass = class TestMinificationClass {
      normalMethodName() { return 'test'; }
    };

    const instance = new testClass();
    const methodName = instance.normalMethodName.name;

    if (methodName !== 'normalMethodName') {
      minificationLevel = methodName.length <= 2 ? 'aggressive' : 'basic';
    }

    return {
      hasSourceMaps,
      estimatedBundleSize,
      minificationLevel
    };
  }

  /**
   * Log warnings for problematic configurations
   */
  private static logWarnings(info: BuildEnvironmentInfo): void {
    console.log('⚠️ Build Environment Warnings:');

    if (info.buildArtifacts.minificationLevel === 'aggressive') {
      console.warn('  🚨 AGGRESSIVE MINIFICATION DETECTED - High risk of method binding issues');
      console.warn('     Consider using build:dev script or updating minification settings');
    }

    if (info.isMinified && !info.figmaEnvironment.features.includes('development')) {
      console.warn('  ⚠️ Production minified build - Method binding issues possible');
    }

    if (!info.jsEngine.features.includes('arrow-functions')) {
      console.error('  ❌ CRITICAL: Arrow functions not supported - Solution 1 will not work');
      console.warn('     Must use static method approach (Solution 3)');
    }

    if (!info.jsEngine.features.includes('proxies')) {
      console.warn('  ⚠️ Proxies not supported - Enhanced validation limited');
    }

    if (!info.figmaEnvironment.available) {
      console.error('  ❌ CRITICAL: Figma API not available');
      console.warn('     Check plugin manifest and environment');
    }

    if (info.buildArtifacts.estimatedBundleSize > 10000) {
      console.warn('  ⚠️ Large bundle size detected - May affect performance');
    }

    console.log('✅ Environment analysis complete');
  }

  /**
   * Quick diagnostic for debugging
   */
  static quickDiagnostic(): BuildEnvironmentInfo {
    console.log('🚀 === QUICK DIAGNOSTIC START ===');

    const info = this.analyze();

    console.log(`📊 Summary:`);
    console.log(`   - Minified: ${info.isMinified}`);
    console.log(`   - Production: ${info.isProduction}`);
    console.log(`   - Figma Available: ${info.figmaEnvironment.available}`);
    console.log(`   - Minification Level: ${info.buildArtifacts.minificationLevel}`);
    console.log(`   - JS Engine: ${info.jsEngine.name}`);

    // Risk assessment
    let riskLevel = 'LOW';
    if (info.buildArtifacts.minificationLevel === 'aggressive') riskLevel = 'HIGH';
    else if (info.isMinified) riskLevel = 'MEDIUM';

    console.log(`🎯 Risk Level for Method Binding Issues: ${riskLevel}`);

    if (riskLevel === 'HIGH') {
      console.log(`💡 Recommendations:`);
      console.log(`   1. Use npm run build:dev for testing`);
      console.log(`   2. Check figma-plugin.config.js settings`);
      console.log(`   3. Consider static method fallback`);
    }

    console.log('🚀 === QUICK DIAGNOSTIC END ===');

    return info;
  }
}