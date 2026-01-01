/**
 * Token Launch - Figma Plugin for Design Token Automation
 * Copyright (c) 2026 Silvia Travieso
 * Licensed under the MIT License
 *
 * Secure Storage for Figma Plugin
 *
 * Handles encrypted storage of sensitive data like GitHub tokens
 * within Figma's plugin environment using clientStorage.
 */

import { GitHubCredentials, GitHubConfig } from '../github/GitHubTypes';

// =============================================================================
// STORAGE KEYS
// =============================================================================

const STORAGE_KEYS = {
  GITHUB_CONFIG: 'github_config_v1',
  GITHUB_CREDENTIALS: 'github_credentials_v1',
  LAST_CONNECTION_TEST: 'github_last_test_v1',
  WORKFLOW_SETTINGS: 'workflow_settings_v1'  // NEW: Workflow trigger settings
} as const;

// =============================================================================
// WORKFLOW SETTINGS TYPE
// =============================================================================

export interface WorkflowSettings {
  workflowTriggerEnabled: boolean;
  workflowFileName: string;
}

// =============================================================================
// ENCRYPTION HELPERS
// =============================================================================

/**
 * Simple encryption for storing sensitive data
 * Note: This provides basic obfuscation within Figma's sandbox.
 * For production use, consider more robust encryption.
 */
class SimpleEncryption {
  private static key = 'figma-github-plugin-2024';

  static encrypt(text: string): string {
    try {
      // Simple XOR encryption - just store as hex to avoid encoding issues
      const encrypted = text
        .split('')
        .map((char, i) =>
          char.charCodeAt(0) ^ this.key.charCodeAt(i % this.key.length)
        )
        .map(code => code.toString(16).padStart(2, '0'))
        .join('');

      return encrypted;
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  static decrypt(encryptedText: string): string {
    try {
      // Decrypt from hex string
      const pairs = encryptedText.match(/.{1,2}/g) || [];
      const decrypted = pairs
        .map(hex => parseInt(hex, 16))
        .map((code, i) =>
          String.fromCharCode(code ^ this.key.charCodeAt(i % this.key.length))
        )
        .join('');

      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }
}

// =============================================================================
// SECURE STORAGE CLASS
// =============================================================================

export class SecureStorage {
  /**
   * Store GitHub credentials securely
   */
  static async storeCredentials(credentials: GitHubCredentials): Promise<void> {
    try {
      const encrypted = SimpleEncryption.encrypt(JSON.stringify(credentials));
      await figma.clientStorage.setAsync(STORAGE_KEYS.GITHUB_CREDENTIALS, encrypted);
    } catch (error) {
      console.error('Failed to store credentials:', error);
      throw new Error('Failed to store GitHub credentials securely');
    }
  }

  /**
   * Retrieve GitHub credentials
   */
  static async getCredentials(): Promise<GitHubCredentials | null> {
    try {
      const encrypted = await figma.clientStorage.getAsync(STORAGE_KEYS.GITHUB_CREDENTIALS);

      if (!encrypted) {
        return null;
      }

      const decrypted = SimpleEncryption.decrypt(encrypted);
      return JSON.parse(decrypted) as GitHubCredentials;
    } catch (error) {
      console.error('Failed to retrieve credentials:', error);

      // If parsing failed due to corruption, clear the corrupted storage
      if (error instanceof SyntaxError && error.message.includes('unexpected')) {
        console.warn('⚠️ Detected corrupted credentials storage, clearing...');
        try {
          await figma.clientStorage.deleteAsync(STORAGE_KEYS.GITHUB_CREDENTIALS);
          console.log('✅ Corrupted credentials storage cleared');
        } catch (clearError) {
          console.error('❌ Failed to clear corrupted storage:', clearError);
        }
      }

      return null;
    }
  }

  /**
   * Store GitHub configuration
   */
  static async storeConfig(config: GitHubConfig): Promise<void> {
    try {
      // Store config without credentials (they're stored separately)
      // Trim whitespace from repository owner and name to prevent API errors
      const configWithoutCredentials = {
        ...config,
        credentials: undefined,
        repository: config.repository ? {
          owner: config.repository.owner?.trim() || '',
          name: config.repository.name?.trim() || ''
        } : undefined
      };

      await figma.clientStorage.setAsync(
        STORAGE_KEYS.GITHUB_CONFIG,
        JSON.stringify(configWithoutCredentials)
      );
    } catch (error) {
      console.error('Failed to store config:', error);
      throw new Error('Failed to store GitHub configuration');
    }
  }

  /**
   * Retrieve GitHub configuration
   */
  static async getConfig(): Promise<Partial<GitHubConfig> | null> {
    try {
      const configString = await figma.clientStorage.getAsync(STORAGE_KEYS.GITHUB_CONFIG);

      if (!configString) {
        return null;
      }

      return JSON.parse(configString) as Partial<GitHubConfig>;
    } catch (error) {
      console.error('Failed to retrieve config:', error);

      // If parsing failed due to corruption, clear the corrupted storage
      if (error instanceof SyntaxError && error.message.includes('unexpected')) {
        console.warn('⚠️ Detected corrupted config storage, clearing...');
        try {
          await figma.clientStorage.deleteAsync(STORAGE_KEYS.GITHUB_CONFIG);
          console.log('✅ Corrupted config storage cleared');
        } catch (clearError) {
          console.error('❌ Failed to clear corrupted storage:', clearError);
        }
      }

      return null;
    }
  }

  /**
   * Get complete configuration with credentials
   */
  static async getCompleteConfig(): Promise<GitHubConfig | null> {
    try {
      const [config, credentials] = await Promise.all([
        this.getConfig(),
        this.getCredentials()
      ]);

      if (!config || !credentials) {
        return null;
      }

      return {
        ...config,
        credentials
      } as GitHubConfig;
    } catch (error) {
      console.error('Failed to retrieve complete config:', error);
      return null;
    }
  }

  /**
   * Store last connection test result
   */
  static async storeLastConnectionTest(result: any): Promise<void> {
    try {
      await figma.clientStorage.setAsync(
        STORAGE_KEYS.LAST_CONNECTION_TEST,
        JSON.stringify({
          ...result,
          timestamp: Date.now()
        })
      );
    } catch (error) {
      console.error('Failed to store connection test result:', error);
    }
  }

  /**
   * Get last connection test result
   */
  static async getLastConnectionTest(): Promise<any | null> {
    try {
      const resultString = await figma.clientStorage.getAsync(STORAGE_KEYS.LAST_CONNECTION_TEST);

      if (!resultString) {
        return null;
      }

      const result = JSON.parse(resultString);

      // Return null if result is older than 1 hour
      if (Date.now() - result.timestamp > 60 * 60 * 1000) {
        return null;
      }

      return result;
    } catch (error) {
      console.error('Failed to retrieve connection test result:', error);
      return null;
    }
  }

  /**
   * Clear all GitHub-related storage
   */
  static async clearAll(): Promise<void> {
    try {
      await Promise.all(
        Object.values(STORAGE_KEYS).map(key =>
          figma.clientStorage.deleteAsync(key)
        )
      );
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw new Error('Failed to clear GitHub configuration');
    }
  }

  /**
   * Check if GitHub is configured
   */
  static async isConfigured(): Promise<boolean> {
    try {
      const config = await this.getCompleteConfig();
      return !!(config?.credentials?.token && config?.repository?.owner && config?.repository?.name);
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate stored credentials format
   */
  static async validateStoredCredentials(): Promise<boolean> {
    try {
      const credentials = await this.getCredentials();
      return !!(credentials?.token && typeof credentials.token === 'string' && credentials.token.trim().length > 0);
    } catch (error) {
      return false;
    }
  }

  // =============================================================================
  // WORKFLOW SETTINGS STORAGE
  // =============================================================================

  /**
   * Store workflow trigger settings
   */
  static async storeWorkflowSettings(settings: WorkflowSettings): Promise<void> {
    try {
      await figma.clientStorage.setAsync(
        STORAGE_KEYS.WORKFLOW_SETTINGS,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error('Failed to store workflow settings:', error);
      throw new Error('Failed to store workflow settings');
    }
  }

  /**
   * Retrieve workflow trigger settings
   */
  static async getWorkflowSettings(): Promise<WorkflowSettings | null> {
    try {
      const settingsString = await figma.clientStorage.getAsync(STORAGE_KEYS.WORKFLOW_SETTINGS);

      if (!settingsString) {
        // Return default settings if none exist
        return {
          workflowTriggerEnabled: false,
          workflowFileName: 'transform-tokens.yml'
        };
      }

      return JSON.parse(settingsString) as WorkflowSettings;
    } catch (error) {
      console.error('Failed to retrieve workflow settings:', error);

      // Return defaults on error
      return {
        workflowTriggerEnabled: false,
        workflowFileName: 'transform-tokens.yml'
      };
    }
  }
}