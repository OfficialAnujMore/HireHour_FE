import {ErrorResponse} from 'interfaces';
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
  console.error(` An api error has occured in => ${context} \n ${error}`);

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
    return {success: false, message: ERROR.networkError};
  }

  return {
    success: false,
    message: ERROR.error,
  };
};
