// Note: @react-native-community/netinfo needs to be installed
// For now, we'll create a mock implementation
// import NetInfo from '@react-native-community/netinfo';

// Mock NetInfo implementation for now
const NetInfo = {
  fetch: async () => ({
    isConnected: true,
    isInternetReachable: true,
    type: 'wifi',
  }),
};

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string;
}

/**
 * Check if the device has network connectivity
 */
export const checkNetworkConnectivity = async (): Promise<NetworkStatus> => {
  try {
    const state = await NetInfo.fetch();
    return {
      isConnected: state.isConnected ?? false,
      isInternetReachable: state.isInternetReachable,
      type: state.type,
    };
  } catch (error) {
    console.error('Error checking network connectivity:', error);
    return {
      isConnected: false,
      isInternetReachable: false,
      type: 'unknown',
    };
  }
};

/**
 * Check if the device is connected to the internet
 */
export const isConnectedToInternet = async (): Promise<boolean> => {
  const status = await checkNetworkConnectivity();
  return status.isConnected && (status.isInternetReachable ?? false);
};

/**
 * Get a user-friendly network error message
 */
export const getNetworkErrorMessage = (error: any): string => {
  if (!error) return 'Network error. Please check your connection.';
  
  const errorMessage = error.message || error.toString();
  
  if (errorMessage.includes('Network Error') || 
      errorMessage.includes('timeout') ||
      errorMessage.includes('ENOTFOUND') ||
      errorMessage.includes('ECONNREFUSED')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
    return 'Authentication failed. Please log in again.';
  }
  
  if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
    return 'Access denied. You do not have permission to perform this action.';
  }
  
  if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
    return 'The requested resource was not found.';
  }
  
  if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
    return 'Server error. Please try again later.';
  }
  
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Retry a function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Check if it's a network error before retrying
      const errorMessage = (error as any)?.message || String(error);
      if (!errorMessage.includes('Network Error') && 
          !errorMessage.includes('timeout') &&
          !errorMessage.includes('ENOTFOUND') &&
          !errorMessage.includes('ECONNREFUSED')) {
        throw error; // Don't retry non-network errors
      }
      
      // Wait before retrying with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}; 