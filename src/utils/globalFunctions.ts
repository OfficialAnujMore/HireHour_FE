import {ErrorResponse} from 'interfaces';

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

export const handleError = (error: unknown): ErrorResponse => {
  console.error('API Error:', error); // Always log for debugging

  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as {response: unknown}).response === 'object' &&
    (error as {response: {data?: {message?: string}}}).response?.data?.message
  ) {
    return {
      success: false,
      message: (error as {response: {data: {message: string}}}).response.data
        .message,
    };
  }

  if (error instanceof Error && error.message.includes('Network Error')) {
    return {success: false, message: 'Network error. Please try again later.'};
  }

  return {
    success: false,
    message: 'An unexpected error occurred. Please try again.',
  };
};
