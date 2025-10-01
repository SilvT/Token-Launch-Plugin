/**
 * Hard-Coded GitHub Configuration for Testing
 *
 * IMPORTANT: This is for testing only. Remove before production!
 * Contains actual credentials hard-coded for development testing.
 */

import { GitHubConfig, GitHubCredentials } from './GitHubTypes';

// =============================================================================
// HARD-CODED CONFIGURATION (TESTING ONLY)
// =============================================================================

/**
 * Hard-coded GitHub credentials for testing
 * WARNING: Remove this before production deployment!
 */
export const HARD_CODED_CREDENTIALS: GitHubCredentials = {
  token: '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',
  username: 'SilvT' // Optional, will be fetched from API
};

/**
 * Hard-coded repository configuration for testing
 */
export const HARD_CODED_CONFIG: GitHubConfig = {
  credentials: HARD_CODED_CREDENTIALS,
  repository: {
    owner: 'SilvT',
    name: 'ds-distributor',
    branch: 'main'
  },
  paths: {
    rawTokens: 'tokens/raw/figma-tokens.json',
    processedTokens: 'tokens/processed/'
  },
  commitMessage: 'feat: update design tokens from Figma - {{timestamp}}'
};

/**
 * Enable hard-coded configuration mode
 * Set to false to use normal authentication flow
 */
export const USE_HARD_CODED_CONFIG = false;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get configuration for testing mode
 */
export function getTestConfig(): GitHubConfig {
  return HARD_CODED_CONFIG;
}

/**
 * Check if hard-coded mode is enabled
 */
export function isHardCodedMode(): boolean {
  return USE_HARD_CODED_CONFIG;
}

/**
 * Get test credentials
 */
export function getTestCredentials(): GitHubCredentials {
  return HARD_CODED_CREDENTIALS;
}

/**
 * Generate test filename with timestamp
 */
export function generateTestFileName(): string {
  const timestamp = new Date().toISOString()
    .replace(/:/g, '-')
    .replace(/\..+/, '')
    .replace('T', '-');

  return `figma-tokens-${timestamp}.json`;
}

/**
 * Get full file path for test
 */
export function getTestFilePath(): string {
  const filename = generateTestFileName();
  return `tokens/raw/${filename}`;
}

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Validate hard-coded token format
 */
export function validateHardCodedToken(): boolean {
  const token = HARD_CODED_CREDENTIALS.token;

  // GitHub Personal Access Token validation
  if (!token.startsWith('ghp_')) {
    console.error('❌ Invalid token format - should start with ghp_');
    return false;
  }

  if (token.length !== 40) {
    console.error('❌ Invalid token length - should be 40 characters');
    return false;
  }

  console.log('✅ Hard-coded token format is valid');
  return true;
}

/**
 * Log configuration for debugging
 */
export function logTestConfiguration(): void {
  console.log('🔧 Hard-coded GitHub Configuration:');
  console.log(`📁 Repository: ${HARD_CODED_CONFIG.repository.owner}/${HARD_CODED_CONFIG.repository.name}`);
  console.log(`🌿 Branch: ${HARD_CODED_CONFIG.repository.branch}`);
  console.log(`📂 Raw tokens path: ${HARD_CODED_CONFIG.paths.rawTokens}`);
  console.log(`🔑 Token: ${HARD_CODED_CREDENTIALS.token.substring(0, 10)}...`);
  console.log(`👤 Username: ${HARD_CODED_CREDENTIALS.username}`);
}