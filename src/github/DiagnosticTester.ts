/**
 * Diagnostic Tester
 *
 * Comprehensive test suite to validate arrow function fixes
 * and diagnose any remaining issues with method binding.
 */

import { GitHubAuth } from './GitHubAuth';
import { GitOperations } from './GitOperations';
import { BuildEnvironmentDetector } from './BuildEnvironmentDetector';
import { MethodValidator } from './MethodValidator';

export interface DiagnosticResult {
  success: boolean;
  tests: {
    name: string;
    passed: boolean;
    error?: string;
    details?: any;
  }[];
  summary: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    recommendations: string[];
  };
}

export class DiagnosticTester {
  /**
   * Run complete diagnostic test suite
   */
  static async runFullDiagnostic(): Promise<DiagnosticResult> {
    console.log('🔬 === STARTING FULL DIAGNOSTIC TEST SUITE ===');

    const tests: DiagnosticResult['tests'] = [];

    // Test 1: Environment Analysis
    tests.push(await this.testEnvironment());

    // Test 2: GitHubAuth Initialization
    tests.push(await this.testGitHubAuthInit());

    // Test 3: Client Creation
    tests.push(await this.testClientCreation());

    // Test 4: Arrow Function Methods
    tests.push(await this.testArrowFunctionMethods());

    // Test 5: Bound Client Creation
    tests.push(await this.testBoundClientCreation());

    // Test 6: Method Validation
    tests.push(await this.testMethodValidation());

    // Test 7: GitOperations Initialization
    tests.push(await this.testGitOperationsInit());

    // Calculate summary
    const passedTests = tests.filter(t => t.passed).length;
    const failedTests = tests.length - passedTests;
    const success = failedTests === 0;

    // Determine risk level
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    const criticalFailures = tests.filter(t => !t.passed &&
      (t.name.includes('Arrow Function') || t.name.includes('Method Validation'))).length;

    if (criticalFailures > 0) riskLevel = 'HIGH';
    else if (failedTests > 2) riskLevel = 'MEDIUM';

    // Generate recommendations
    const recommendations = this.generateRecommendations(tests, riskLevel);

    const result: DiagnosticResult = {
      success,
      tests,
      summary: {
        totalTests: tests.length,
        passedTests,
        failedTests,
        riskLevel,
        recommendations
      }
    };

    this.logSummary(result);

    return result;
  }

  /**
   * Test 1: Environment Analysis
   */
  private static async testEnvironment(): Promise<DiagnosticResult['tests'][0]> {
    try {
      console.log('🔍 Test 1: Environment Analysis');

      const envInfo = BuildEnvironmentDetector.analyze();

      const criticalIssues = [];
      if (!envInfo.figmaEnvironment.available) {
        criticalIssues.push('Figma API not available');
      }
      if (!envInfo.jsEngine.features.includes('arrow-functions')) {
        criticalIssues.push('Arrow functions not supported');
      }
      if (envInfo.buildArtifacts.minificationLevel === 'aggressive') {
        criticalIssues.push('Aggressive minification detected');
      }

      return {
        name: 'Environment Analysis',
        passed: criticalIssues.length === 0,
        error: criticalIssues.length > 0 ? criticalIssues.join(', ') : undefined,
        details: envInfo
      };

    } catch (error) {
      return {
        name: 'Environment Analysis',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Test 2: GitHubAuth Initialization
   */
  private static async testGitHubAuthInit(): Promise<DiagnosticResult['tests'][0]> {
    try {
      console.log('🔍 Test 2: GitHubAuth Initialization');

      const auth = GitHubAuth.getInstance();
      await auth.initialize();

      const hasClient = auth.hasClient();
      const state = auth.getState();

      return {
        name: 'GitHubAuth Initialization',
        passed: hasClient && state.isConfigured,
        error: !hasClient ? 'No client available' : !state.isConfigured ? 'Not configured' : undefined,
        details: { hasClient, state: state.isConfigured }
      };

    } catch (error) {
      return {
        name: 'GitHubAuth Initialization',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Test 3: Client Creation
   */
  private static async testClientCreation(): Promise<DiagnosticResult['tests'][0]> {
    try {
      console.log('🔍 Test 3: Client Creation');

      const auth = GitHubAuth.getInstance();

      if (!auth.hasClient()) {
        return {
          name: 'Client Creation',
          passed: false,
          error: 'No client available from auth'
        };
      }

      const client = auth.getClient();
      const clientId = client.getClientId();

      return {
        name: 'Client Creation',
        passed: !!client && !!clientId,
        details: { hasClient: !!client, clientId }
      };

    } catch (error) {
      return {
        name: 'Client Creation',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Test 4: Arrow Function Methods
   */
  private static async testArrowFunctionMethods(): Promise<DiagnosticResult['tests'][0]> {
    try {
      console.log('🔍 Test 4: Arrow Function Methods');

      const auth = GitHubAuth.getInstance();

      if (!auth.hasClient()) {
        return {
          name: 'Arrow Function Methods',
          passed: false,
          error: 'No client available'
        };
      }

      const client = auth.getClient();
      const arrowMethods = ['fileExists', 'createFile', 'updateFile', 'getFile', 'getRepository', 'testConnection', 'getUser'];

      const methodResults: Record<string, any> = {};
      let allMethodsValid = true;

      for (const methodName of arrowMethods) {
        const method = (client as any)[methodName];
        const isFunction = typeof method === 'function';

        if (isFunction) {
          try {
            const methodSource = method.toString();
            const isArrowFunction = methodSource.includes('=>');
            const hasProperBinding = methodSource.includes('this.');

            methodResults[methodName] = {
              isFunction,
              isArrowFunction,
              hasProperBinding,
              status: isArrowFunction && hasProperBinding ? 'GOOD' : 'WARNING'
            };

            if (!isArrowFunction || !hasProperBinding) {
              allMethodsValid = false;
            }

          } catch (sourceError) {
            methodResults[methodName] = {
              isFunction,
              status: 'ERROR',
              error: 'Cannot inspect source'
            };
            allMethodsValid = false;
          }
        } else {
          methodResults[methodName] = {
            isFunction: false,
            status: 'FAILED'
          };
          allMethodsValid = false;
        }
      }

      return {
        name: 'Arrow Function Methods',
        passed: allMethodsValid,
        error: !allMethodsValid ? 'Some methods have binding issues' : undefined,
        details: methodResults
      };

    } catch (error) {
      return {
        name: 'Arrow Function Methods',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Test 5: Bound Client Creation
   */
  private static async testBoundClientCreation(): Promise<DiagnosticResult['tests'][0]> {
    try {
      console.log('🔍 Test 5: Bound Client Creation');

      const auth = GitHubAuth.getInstance();

      if (!auth.hasClient()) {
        return {
          name: 'Bound Client Creation',
          passed: false,
          error: 'No original client available'
        };
      }

      const boundClient = auth.createBoundClient();
      const requiredMethods = ['fileExists', 'createFile', 'updateFile', 'getFile'];

      const methodCheck = requiredMethods.every(method =>
        typeof boundClient[method as keyof typeof boundClient] === 'function'
      );

      return {
        name: 'Bound Client Creation',
        passed: !!boundClient && methodCheck,
        error: !boundClient ? 'Bound client creation failed' : !methodCheck ? 'Missing methods' : undefined,
        details: {
          boundClientCreated: !!boundClient,
          methodsValid: methodCheck,
          availableMethods: Object.keys(boundClient || {})
        }
      };

    } catch (error) {
      return {
        name: 'Bound Client Creation',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Test 6: Method Validation
   */
  private static async testMethodValidation(): Promise<DiagnosticResult['tests'][0]> {
    try {
      console.log('🔍 Test 6: Method Validation');

      const auth = GitHubAuth.getInstance();
      const boundClient = auth.createBoundClient();

      const validation = MethodValidator.validateMethods(
        boundClient,
        ['fileExists', 'createFile', 'updateFile', 'getFile'],
        'boundClient'
      );

      return {
        name: 'Method Validation',
        passed: validation.isValid,
        error: !validation.isValid ?
          `Missing: [${validation.missingMethods.join(', ')}], Invalid: [${validation.invalidMethods.join(', ')}]` :
          undefined,
        details: validation
      };

    } catch (error) {
      return {
        name: 'Method Validation',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Test 7: GitOperations Initialization
   */
  private static async testGitOperationsInit(): Promise<DiagnosticResult['tests'][0]> {
    try {
      console.log('🔍 Test 7: GitOperations Initialization');

      const gitOps = new GitOperations();
      await gitOps.initialize();

      const isReady = gitOps.isReady();

      return {
        name: 'GitOperations Initialization',
        passed: isReady,
        error: !isReady ? 'GitOperations not ready' : undefined,
        details: { isReady }
      };

    } catch (error) {
      return {
        name: 'GitOperations Initialization',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Generate recommendations based on test results
   */
  private static generateRecommendations(tests: DiagnosticResult['tests'], riskLevel: string): string[] {
    const recommendations: string[] = [];

    const failedTests = tests.filter(t => !t.passed);

    if (riskLevel === 'HIGH') {
      recommendations.push('🚨 HIGH RISK: Use npm run build:dev for testing');
      recommendations.push('Consider using static method fallback (GitHubClientStatic.ts)');
    }

    if (failedTests.some(t => t.name === 'Arrow Function Methods')) {
      recommendations.push('Arrow function implementation has issues - check method binding');
      recommendations.push('Verify build configuration preserves method names');
    }

    if (failedTests.some(t => t.name === 'Environment Analysis')) {
      recommendations.push('Environment issues detected - check Figma API availability');
      recommendations.push('Verify plugin manifest configuration');
    }

    if (failedTests.some(t => t.name === 'Method Validation')) {
      recommendations.push('Method validation failed - use MethodValidator for debugging');
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ All tests passed - arrow function solution should work');
      recommendations.push('Monitor console logs during actual GitHub operations');
    }

    return recommendations;
  }

  /**
   * Log comprehensive summary
   */
  private static logSummary(result: DiagnosticResult): void {
    console.log('\n🔬 === DIAGNOSTIC TEST RESULTS ===');
    console.log(`📊 Overall: ${result.success ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`📈 Tests: ${result.summary.passedTests}/${result.summary.totalTests} passed`);
    console.log(`🎯 Risk Level: ${result.summary.riskLevel}`);

    console.log('\n📋 Test Details:');
    result.tests.forEach(test => {
      console.log(`  ${test.passed ? '✅' : '❌'} ${test.name}${test.error ? ` - ${test.error}` : ''}`);
    });

    console.log('\n💡 Recommendations:');
    result.summary.recommendations.forEach(rec => {
      console.log(`  - ${rec}`);
    });

    console.log('\n🔬 === END DIAGNOSTIC RESULTS ===\n');
  }

  /**
   * Quick test - just the essential checks
   */
  static async quickTest(): Promise<boolean> {
    console.log('⚡ Running quick diagnostic test...');

    try {
      // Environment check
      BuildEnvironmentDetector.quickDiagnostic();

      // Basic auth check
      const auth = GitHubAuth.getInstance();
      await auth.initialize();

      if (!auth.hasClient()) {
        console.log('❌ Quick test failed: No GitHub client');
        return false;
      }

      // Method validation
      const boundClient = auth.createBoundClient();

      const validation = MethodValidator.validateMethods(
        boundClient,
        ['fileExists', 'createFile'],
        'boundClient-quick'
      );

      if (!validation.isValid) {
        console.log('❌ Quick test failed: Method validation failed');
        return false;
      }

      console.log('✅ Quick test passed - basic setup looks good');
      return true;

    } catch (error) {
      console.error('❌ Quick test failed with error:', error);
      return false;
    }
  }
}