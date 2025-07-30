import { ErrorResponse} from 'interfaces';
import {ERROR} from './local/error';
import { formatDateUS as formatDateUSFixed } from './dateUtils';
import { getNetworkErrorMessage } from './networkUtils';

export const getGreeting = (): string => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return 'Good Morning';
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

export const handleError = (error: unknown, context: string): ErrorResponse => {
  // Log the error with context for debugging
  console.error(`An error occurred in ${context}:`, error);

  // Check if the error is an instance of Error (standard Error object)
  if (error instanceof Error) {
    // If it's a network error, use the network utility for better error messages
    if (error.message.includes('Network Error') || 
        error.message.includes('timeout') ||
        error.message.includes('ENOTFOUND') ||
        error.message.includes('ECONNREFUSED')) {
      return {success: false, message: getNetworkErrorMessage(error)};
    }

    // Return the message from the Error instance
    return {
      success: false,
      message: error.message,
    };
  }

  // Handle non-Error objects (e.g., API response errors)
  if (typeof error === 'object' && error !== null) {
    // If the error has a message property (this could be an API error response)
    if (
      'message' in error &&
      typeof (error as {message: string}).message === 'string'
    ) {
      return {
        success: false,
        message: (error as {message: string}).message,
      };
    }
  }

  // Default return for unexpected error formats
  return {
    success: false,
    message: ERROR.error,
  };
};

export const formatDateUS = (date: Date): string => {
  return formatDateUSFixed(date);
};
