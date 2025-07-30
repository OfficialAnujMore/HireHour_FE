import {store} from '../redux/store';
import {showLoader, hideLoader} from '../redux/loaderSlice';

// Track ongoing requests to prevent duplicates
const ongoingRequests = new Set<string>();

// Utility function to wrap API calls with automatic loading
export const apiWithLoader = async <T>(
  apiCall: () => Promise<T>,
  message?: string,
  requestId?: string,
): Promise<T> => {
  const id = requestId || Math.random().toString(36).substr(2, 9);
  
  // Prevent duplicate requests
  if (ongoingRequests.has(id)) {
    throw new Error('Request already in progress');
  }
  
  try {
    ongoingRequests.add(id);
    store.dispatch(showLoader(message || 'Loading...'));
    const result = await apiCall();
    return result;
  } finally {
    ongoingRequests.delete(id);
    store.dispatch(hideLoader());
  }
};

// Higher-order function to create API functions with automatic loading
export const createApiWithLoader = <T extends any[], R>(
  apiFunction: (...args: T) => Promise<R>,
  defaultMessage?: string,
) => {
  return async (...args: T): Promise<R> => {
    const requestId = `${apiFunction.name}_${JSON.stringify(args)}`;
    return apiWithLoader(() => apiFunction(...args), defaultMessage, requestId);
  };
};

// Utility to check if any requests are ongoing
export const hasOngoingRequests = (): boolean => {
  return ongoingRequests.size > 0;
};

// Utility to clear all ongoing requests (useful for cleanup)
export const clearOngoingRequests = (): void => {
  ongoingRequests.clear();
}; 