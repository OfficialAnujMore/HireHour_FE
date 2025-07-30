import { AppError, ApiError, NetworkError, ValidationError, AuthError } from '../services/types';
import { ERROR_MESSAGES } from './constants';

/**
 * Comprehensive error handling system
 * Provides centralized error management and user-friendly error messages
 */

// Error types enum
export enum ErrorType {
  NETWORK = 'network',
  API = 'api',
  VALIDATION = 'validation',
  AUTH = 'auth',
  UNKNOWN = 'unknown',
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Error context interface
export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp: number;
  userAgent?: string;
  platform?: string;
}

// Error handler configuration
export interface ErrorHandlerConfig {
  enableLogging: boolean;
  enableReporting: boolean;
  enableUserNotifications: boolean;
  logLevel: ErrorSeverity;
}

// Default configuration
const defaultConfig: ErrorHandlerConfig = {
  enableLogging: __DEV__,
  enableReporting: !__DEV__,
  enableUserNotifications: true,
  logLevel: ErrorSeverity.MEDIUM,
};

class ErrorHandler {
  private config: ErrorHandlerConfig;
  private errorQueue: Array<{ error: AppError; context: ErrorContext }> = [];

  constructor(config: Partial<ErrorHandlerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.setupGlobalErrorHandling();
  }

  /**
   * Setup global error handling
   */
  private setupGlobalErrorHandling(): void {
    // Handle unhandled promise rejections (Web only)
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('unhandledrejection', (event) => {
        this.handleError(new Error(event.reason), {
          component: 'Global',
          action: 'UnhandledPromiseRejection',
          timestamp: Date.now(),
        });
      });
    }

    // Handle global errors (Web only)
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('error', (event) => {
        this.handleError(event.error || new Error(event.message), {
          component: 'Global',
          action: 'GlobalError',
          timestamp: Date.now(),
        });
      });
    }

    // React Native specific error handling
    if (typeof global !== 'undefined' && (global as any).ErrorUtils) {
      const originalHandler = (global as any).ErrorUtils.setGlobalHandler;
      (global as any).ErrorUtils.setGlobalHandler = (error: Error, isFatal?: boolean) => {
        this.handleError(error, {
          component: 'Global',
          action: 'ReactNativeError',
          timestamp: Date.now(),
        });
        if (originalHandler) {
          originalHandler(error, isFatal);
        }
      };
    }
  }

  /**
   * Handle any type of error
   */
  public handleError(
    error: Error | AppError | unknown,
    context: Partial<ErrorContext> = {}
  ): AppError {
    const appError = this.normalizeError(error);
    const fullContext: ErrorContext = {
      timestamp: Date.now(),
      ...context,
    };

    // Log error if enabled
    if (this.config.enableLogging) {
      this.logError(appError, fullContext);
    }

    // Add to error queue for reporting
    this.errorQueue.push({ error: appError, context: fullContext });

    // Report error if enabled
    if (this.config.enableReporting) {
      this.reportError(appError, fullContext);
    }

    // Show user notification if enabled
    if (this.config.enableUserNotifications) {
      this.showUserNotification(appError);
    }

    return appError;
  }

  /**
   * Normalize different error types to AppError
   */
  private normalizeError(error: Error | AppError | unknown): AppError {
    if (this.isAppError(error)) {
      return error;
    }

    if (error instanceof Error) {
      return this.createApiError(error.message, error.stack);
    }

    if (typeof error === 'string') {
      return this.createApiError(error);
    }

    return this.createApiError('An unknown error occurred');
  }

  /**
   * Check if error is already an AppError
   */
  private isAppError(error: any): error is AppError {
    return error && typeof error === 'object' && 'type' in error;
  }

  /**
   * Create API error
   */
  public createApiError(message: string, details?: any): ApiError {
    return {
      type: 'api',
      code: 'API_ERROR',
      message,
      details,
    };
  }

  /**
   * Create network error
   */
  public createNetworkError(message: string = ERROR_MESSAGES.NETWORK_ERROR): NetworkError {
    return {
      type: 'network',
      message,
    };
  }

  /**
   * Create validation error
   */
  public createValidationError(field: string, message: string): ValidationError {
    return {
      type: 'validation',
      field,
      message,
    };
  }

  /**
   * Create auth error
   */
  public createAuthError(message: string, code?: string): AuthError {
    return {
      type: 'auth',
      message,
      code,
    };
  }

  /**
   * Log error to console
   */
  private logError(error: AppError, context: ErrorContext): void {
    const logMessage = {
      error: {
        type: error.type,
        message: error.message,
        ...(error as any).code && { code: (error as any).code },
        ...(error as any).field && { field: (error as any).field },
        ...(error as any).details && { details: (error as any).details },
      },
      context,
      timestamp: new Date().toISOString(),
    };

    if (__DEV__) {
      console.group('🚨 Error Handler');
      console.error('Error:', logMessage.error);
      console.log('Context:', logMessage.context);
      console.groupEnd();
    } else {
      console.error('Error:', JSON.stringify(logMessage));
    }
  }

  /**
   * Report error to external service (e.g., Sentry, Crashlytics)
   */
  private reportError(error: AppError, context: ErrorContext): void {
    // In production, you would send this to your error reporting service
    // Example: Sentry.captureException(error, { extra: context });
    
    // For now, we'll just store it in the queue
    if (this.errorQueue.length > 10) {
      this.errorQueue.shift(); // Remove oldest error
    }
  }

  /**
   * Show user-friendly error notification
   */
  private showUserNotification(error: AppError): void {
    // This would typically dispatch to your snackbar/toast system
    const userMessage = this.getUserFriendlyMessage(error);
    
    // Dispatch to Redux store for snackbar
    // store.dispatch(showSnackbar({ message: userMessage, success: false }));
    
    console.log('User notification:', userMessage);
  }

  /**
   * Get user-friendly error message
   */
  public getUserFriendlyMessage(error: AppError): string {
    switch (error.type) {
      case 'network':
        return ERROR_MESSAGES.NETWORK_ERROR;
      case 'auth':
        return ERROR_MESSAGES.AUTH_ERROR;
      case 'validation':
        return ERROR_MESSAGES.VALIDATION_ERROR;
      case 'api':
        return error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      default:
        return ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  }

  /**
   * Handle API errors specifically
   */
  public handleApiError(
    response: any,
    context: Partial<ErrorContext> = {}
  ): AppError {
    let error: AppError;

    if (!response) {
      error = this.createNetworkError();
    } else if (response.status === 401) {
      error = this.createAuthError('Authentication failed');
    } else if (response.status === 403) {
      error = this.createAuthError('Access denied');
    } else if (response.status === 404) {
      error = this.createApiError(ERROR_MESSAGES.NOT_FOUND);
    } else if (response.status >= 500) {
      error = this.createApiError(ERROR_MESSAGES.SERVER_ERROR);
    } else {
      error = this.createApiError(
        response.data?.message || ERROR_MESSAGES.UNKNOWN_ERROR,
        response.data
      );
    }

    return this.handleError(error, context);
  }

  /**
   * Handle validation errors
   */
  public handleValidationErrors(
    errors: Record<string, string>,
    context: Partial<ErrorContext> = {}
  ): ValidationError[] {
    const validationErrors: ValidationError[] = [];
    
    Object.entries(errors).forEach(([field, message]) => {
      const error = this.createValidationError(field, message);
      validationErrors.push(error);
      this.handleError(error, context);
    });

    return validationErrors;
  }

  /**
   * Get error queue for debugging
   */
  public getErrorQueue(): Array<{ error: AppError; context: ErrorContext }> {
    return [...this.errorQueue];
  }

  /**
   * Clear error queue
   */
  public clearErrorQueue(): void {
    this.errorQueue = [];
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<ErrorHandlerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  public getConfig(): ErrorHandlerConfig {
    return { ...this.config };
  }
}

// Create singleton instance
export const errorHandler = new ErrorHandler();

// Export convenience functions
export const handleError = (error: Error | AppError | unknown, context?: Partial<ErrorContext>) =>
  errorHandler.handleError(error, context);

export const handleApiError = (response: any, context?: Partial<ErrorContext>) =>
  errorHandler.handleApiError(response, context);

export const handleValidationErrors = (errors: Record<string, string>, context?: Partial<ErrorContext>) =>
  errorHandler.handleValidationErrors(errors, context);

export const createApiError = (message: string, details?: any) =>
  errorHandler.createApiError(message, details);

export const createNetworkError = (message?: string) =>
  errorHandler.createNetworkError(message);

export const createValidationError = (field: string, message: string) =>
  errorHandler.createValidationError(field, message);

export const createAuthError = (message: string, code?: string) =>
  errorHandler.createAuthError(message, code);

export const getErrorMessage = (response: any, defaultMessage: string = 'Something went wrong'): string => {
  // Check if response has a message property
  if (response?.message && typeof response.message === 'string' && response.message.trim()) {
    return response.message.trim();
  }
  
  // Check if response has an error property
  if (response?.error && typeof response.error === 'string' && response.error.trim()) {
    return response.error.trim();
  }
  
  // Check if response has a data property with error message
  if (response?.data?.message && typeof response.data.message === 'string' && response.data.message.trim()) {
    return response.data.message.trim();
  }
  
  // Check if response has a data property with error
  if (response?.data?.error && typeof response.data.error === 'string' && response.data.error.trim()) {
    return response.data.error.trim();
  }
  
  // Check if response is a string (direct error message)
  if (typeof response === 'string' && response.trim()) {
    return response.trim();
  }
  
  // Check if response has a details property with error message
  if (response?.details?.message && typeof response.details.message === 'string' && response.details.message.trim()) {
    return response.details.message.trim();
  }
  
  // Return default message if no error message found
  return defaultMessage;
};

export default errorHandler; 