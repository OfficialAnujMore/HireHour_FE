import { ErrorResponse} from 'interfaces';
import {ERROR} from './local/error';

export const getGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return 'Good Morning';
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Hello';
  }
};
export const handleError = (error: unknown, context: string): ErrorResponse => {
  // Log the error with context for debugging
  console.log(
    `An API error has occurred in => ${context} \n ${JSON.stringify(error)}`,
  );

  // Check if the error is an instance of Error (standard Error object)
  if (error instanceof Error) {
    // If it's a network error
    if (error.message.includes('Network Error')) {
      return {success: false, message: ERROR.networkError};
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
