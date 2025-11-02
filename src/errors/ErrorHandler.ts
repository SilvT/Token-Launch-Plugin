/**
 * Error Handler
 *
 * Central error handling utility that classifies errors,
 * shows user-friendly dialogs, and provides logging.
 */

import { classifyError, ErrorMetadata } from './ErrorTypes';
import { ErrorDialog, ErrorDialogResult } from '../ui/ErrorDialog';

// =============================================================================
// ERROR HANDLER OPTIONS
// =============================================================================

export interface HandleErrorOptions {
  error: unknown;
  context?: string;
  showDialog?: boolean;
  showTechnicalDetails?: boolean;
  onRetry?: () => void | Promise<void>;
  onFallback?: () => void | Promise<void>;
  logToConsole?: boolean;
}

export interface ErrorHandlerResult {
  metadata: ErrorMetadata;
  dialogResult?: ErrorDialogResult;
}

// =============================================================================
// ERROR HANDLER CLASS
// =============================================================================

export class ErrorHandler {
  /**
   * Handle an error with full classification and user feedback
   */
  static async handle(options: HandleErrorOptions): Promise<ErrorHandlerResult> {
    const {
      error,
      context,
      showDialog = true,
      showTechnicalDetails = false,
      onRetry,
      onFallback,
      logToConsole = true
    } = options;

    // Classify the error
    const metadata = classifyError(error, context);

    // Log to console if requested
    if (logToConsole) {
      this.logError(metadata, error);
    }

    // Show dialog if requested
    let dialogResult: ErrorDialogResult | undefined;
    if (showDialog) {
      dialogResult = await this.showErrorDialog(metadata, {
        showTechnicalDetails,
        onRetry,
        onFallback
      });
    }

    return {
      metadata,
      dialogResult
    };
  }

  /**
   * Handle error with automatic retry logic
   */
  static async handleWithRetry(
    operation: () => Promise<any>,
    options: {
      maxRetries?: number;
      context?: string;
      showDialog?: boolean;
      onFallback?: () => void | Promise<void>;
    } = {}
  ): Promise<{ success: boolean; result?: any; error?: ErrorMetadata }> {
    const { maxRetries = 3, context, showDialog = true, onFallback } = options;

    let lastError: unknown;
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        const result = await operation();
        return { success: true, result };
      } catch (error) {
        lastError = error;
        attempts++;

        // Classify error to check if retryable
        const metadata = classifyError(error, context);

        // If not retryable or last attempt, handle the error
        if (!metadata.retryable || attempts >= maxRetries) {
          const handlerResult = await this.handle({
            error,
            context: `${context} (Attempt ${attempts}/${maxRetries})`,
            showDialog,
            onFallback
          });

          return {
            success: false,
            error: handlerResult.metadata
          };
        }

        // Wait before retry (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, attempts - 1), 5000);
        await new Promise((resolve) => setTimeout(resolve, delay));

        console.log(`⚠️ Retrying operation (attempt ${attempts + 1}/${maxRetries})...`);
      }
    }

    // This shouldn't be reached, but handle it just in case
    const metadata = classifyError(lastError, context);
    return { success: false, error: metadata };
  }

  /**
   * Show quick notification for errors (no dialog)
   */
  static notify(error: unknown, context?: string): void {
    const metadata = classifyError(error, context);

    figma.notify(`${metadata.title}: ${metadata.userMessage}`, {
      error: true,
      timeout: 6000
    });

    this.logError(metadata, error);
  }

  /**
   * Show error dialog
   */
  private static async showErrorDialog(
    metadata: ErrorMetadata,
    options: {
      showTechnicalDetails?: boolean;
      onRetry?: () => void | Promise<void>;
      onFallback?: () => void | Promise<void>;
    }
  ): Promise<ErrorDialogResult> {
    const dialog = new ErrorDialog({
      error: metadata,
      showTechnicalDetails: options.showTechnicalDetails,
      onRetry: options.onRetry,
      onFallback: options.onFallback
    });

    return await dialog.show();
  }

  /**
   * Log error to console with formatting
   * Note: Using console.log instead of console.group as Figma plugin environment doesn't support it
   */
  private static logError(metadata: ErrorMetadata, originalError: unknown): void {
    const severityEmoji = this.getSeverityEmoji(metadata.severity);

    console.error(`\n${severityEmoji} ${metadata.title} [${metadata.code}]`);
    console.error('Category:', metadata.category);
    console.error('Severity:', metadata.severity);
    console.error('User Message:', metadata.userMessage);
    console.error('Technical Message:', metadata.technicalMessage);

    if (metadata.solutions.length > 0) {
      console.error('\nSolutions:');
      metadata.solutions.forEach((solution) => {
        console.error(`  ${solution.step}. ${solution.action}`);
        if (solution.details) {
          console.error(`     ${solution.details}`);
        }
      });
    }

    console.error('\nOriginal Error:', originalError);
    console.error('---\n');
  }

  /**
   * Get emoji for severity
   */
  private static getSeverityEmoji(severity: string): string {
    switch (severity) {
      case 'critical':
        return '🚨';
      case 'high':
        return '⚠️';
      case 'medium':
        return '⚡';
      case 'low':
        return 'ℹ️';
      default:
        return '❓';
    }
  }

  /**
   * Create a structured error log for debugging
   */
  static createErrorLog(error: unknown, context?: string): string {
    const metadata = classifyError(error, context);
    const timestamp = new Date().toISOString();

    const log = {
      timestamp,
      errorCode: metadata.code,
      category: metadata.category,
      severity: metadata.severity,
      title: metadata.title,
      userMessage: metadata.userMessage,
      technicalMessage: metadata.technicalMessage,
      context,
      originalError: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : String(error),
      solutions: metadata.solutions,
      retryable: metadata.retryable,
      fallbackAvailable: metadata.fallbackAvailable
    };

    return JSON.stringify(log, null, 2);
  }
}
