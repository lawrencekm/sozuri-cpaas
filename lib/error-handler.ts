import logger from './logger';
import { toast } from 'react-hot-toast';

// Error types for better categorization
export enum ErrorType {
  API = 'API_ERROR',
  AUTHENTICATION = 'AUTH_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  NETWORK = 'NETWORK_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR'
}

// Error severity levels
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

interface ErrorHandlerOptions {
  showToast?: boolean;
  toastMessage?: string;
  context?: Record<string, any>;
  severity?: ErrorSeverity;
  reportToMonitoring?: boolean;
}

/**
 * Centralized error handler for consistent error handling across the application
 */
export const handleError = (
  error: any, 
  errorType: ErrorType = ErrorType.UNKNOWN,
  options: ErrorHandlerOptions = {}
) => {
  const {
    showToast = true,
    toastMessage,
    context = {},
    severity = ErrorSeverity.ERROR,
    reportToMonitoring = true
  } = options;

  // 1. Log the error with context
  logger.error({
    message: `${errorType}: ${error?.message || 'Unknown error'}`,
    error: error?.response?.data || error,
    status: error?.response?.status,
    context,
    severity
  });

  // 2. Show user-friendly toast notification if enabled
  if (showToast) {
    const message = toastMessage || getDefaultErrorMessage(error, errorType);
    toast.error(message);
  }

  // 3. Report to monitoring service if enabled
  if (reportToMonitoring) {
    // Integrate with your monitoring service (Sentry, LogRocket, etc.)
    // Example for Sentry:
    // Sentry.captureException(error, { 
    //   tags: { errorType },
    //   extra: { ...context }
    // });
  }

  return error;
};

/**
 * Get a user-friendly error message based on error type and details
 */
function getDefaultErrorMessage(error: any, errorType: ErrorType): string {
  // Handle API errors with status codes
  if (errorType === ErrorType.API && error?.response?.status) {
    const status = error.response.status;
    
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Your session has expired. Please sign in again.';
      case 403:
        return 'You don\'t have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
      case 502:
      case 503:
      case 504:
        return 'Server error. Please try again later or contact support.';
    }
  }

  // Handle specific error types
  switch (errorType) {
    case ErrorType.AUTHENTICATION:
      return 'Authentication error. Please sign in again.';
    case ErrorType.VALIDATION:
      return 'Please check your input and try again.';
    case ErrorType.NETWORK:
      return 'Network error. Please check your connection and try again.';
    default:
      return 'An unexpected error occurred. Please try again or contact support.';
  }
}

/**
 * Higher-order function to wrap async functions with error handling
 */
export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  errorType: ErrorType = ErrorType.UNKNOWN,
  options: ErrorHandlerOptions = {}
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, errorType, options);
      throw error; // Re-throw to allow caller to handle if needed
    }
  };
};
