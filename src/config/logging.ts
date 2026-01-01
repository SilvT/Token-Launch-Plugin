/**
 * Token Launch - Figma Plugin for Design Token Automation
 * Copyright (c) 2026 Silvia Travieso
 * Licensed under the MIT License
 *
 * Logging Configuration
 *
 * Control console output verbosity to improve performance
 */

export enum LogLevel {
  NONE = 0,      // No logs
  MINIMAL = 1,   // Only critical user-facing milestones
  NORMAL = 2,    // Key operations and milestones
  VERBOSE = 3,   // Detailed performance breakdown
  DEBUG = 4      // Everything including step-by-step details
}

// Set this to control logging verbosity
// MINIMAL is recommended for production use
export const CURRENT_LOG_LEVEL = LogLevel.MINIMAL;

export function shouldLog(level: LogLevel): boolean {
  return level <= CURRENT_LOG_LEVEL;
}

// Global flag to enable/disable GitHub debug logging
// Set to false to silence all GitHub module debug output
export const ENABLE_DEBUG_LOGGING = false;

// Convenience functions
export const log = {
  critical: (message: string) => {
    if (shouldLog(LogLevel.MINIMAL)) {
      console.log(message);
    }
  },

  normal: (message: string) => {
    if (shouldLog(LogLevel.NORMAL)) {
      console.log(message);
    }
  },

  verbose: (message: string) => {
    if (shouldLog(LogLevel.VERBOSE)) {
      console.log(message);
    }
  },

  debug: (message: string) => {
    if (shouldLog(LogLevel.DEBUG)) {
      console.log(message);
    }
  },

  // GitHub-specific debug logging (controlled by ENABLE_DEBUG_LOGGING flag)
  githubDebug: (message: string) => {
    if (ENABLE_DEBUG_LOGGING) {
      console.log(message);
    }
  }
};
