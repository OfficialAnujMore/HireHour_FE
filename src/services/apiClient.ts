import axios, {AxiosRequestConfig, AxiosResponse, CancelTokenSource} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get API_BASE_URL from environment or use fallback
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.hirehour.com';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

// Cache interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

// Simple in-memory cache
const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Request cancellation tokens
const cancelTokens = new Map<string, CancelTokenSource>();

// Define a list of unprotected routes (or create a condition based on your needs)
const unprotectedRoutes = [
  '/public',
  '/auth/login',
  '/auth/register',
  'api/v1/user/loginUser',
];

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Timeout after 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cache utility functions
const generateCacheKey = (method: string, url: string, params?: any): string => {
  return `${method}:${url}:${JSON.stringify(params || {})}`;
};

const getFromCache = <T>(key: string): T | null => {
  const entry = cache.get(key);
  if (!entry) return null;
  
  const now = Date.now();
  if (now - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return null;
  }
  
  return entry.data;
};

const setCache = <T>(key: string, data: T, ttl: number = CACHE_TTL): void => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
};

const clearCache = (): void => {
  cache.clear();
};

// Request Interceptor
apiClient.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (
      !unprotectedRoutes.some(route => config.url?.includes(route)) &&
      token
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add cancellation token
    const cancelToken = axios.CancelToken.source();
    config.cancelToken = cancelToken.token;
    
    // Store cancel token for potential cancellation
    if (config.url) {
      const key = generateCacheKey(config.method || 'GET', config.url, config.params);
      cancelTokens.set(key, cancelToken);
    }
    
    // Log outgoing requests for debugging (only in development)
    if (__DEV__) {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        data: config.data,
        headers: config.headers,
      });
    }
    
    return config;
  },
  error => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  },
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Clean up cancel token
    if (response.config.url) {
      const key = generateCacheKey(
        response.config.method || 'GET', 
        response.config.url, 
        response.config.params
      );
      cancelTokens.delete(key);
    }
    return response;
  },
  error => {
    // Clean up cancel token on error
    if (error.config?.url) {
      const key = generateCacheKey(
        error.config.method || 'GET', 
        error.config.url, 
        error.config.params
      );
      cancelTokens.delete(key);
    }
    
    if (axios.isCancel(error)) {
      return Promise.reject(new Error('Request cancelled'));
    }
    
    // Enhanced error logging for debugging
    console.error('API Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data,
      baseURL: error.config?.baseURL,
    });
    
    return Promise.reject(error.response?.data || error.message);
  },
);

const apiRequest = async <T>(
  method: AxiosRequestConfig['method'],
  url: string,
  data?: Record<string, unknown>,
  config?: AxiosRequestConfig,
  useCache: boolean = false,
): Promise<ApiResponse<T>> => {
  try {
    // Check cache for GET requests
    if (useCache && method === 'GET') {
      const cacheKey = generateCacheKey(method, url, config?.params);
      const cachedData = getFromCache<ApiResponse<T>>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }
    
    const response = await apiClient.request<ApiResponse<T>>({
      method,
      url,
      data,
      ...config,
    });
    
    // Cache successful GET responses
    if (useCache && method === 'GET' && response.data) {
      const cacheKey = generateCacheKey(method, url, config?.params);
      setCache(cacheKey, response.data);
    }
    
    return response.data;
  } catch (error) {
    // Enhanced error handling for network issues
    if (error instanceof Error) {
      // Check for network-related errors
      if (error.message.includes('Network Error') || 
          error.message.includes('timeout') ||
          error.message.includes('ENOTFOUND') ||
          error.message.includes('ECONNREFUSED')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
    }
    throw error;
  }
};

export const get = async <T>(
  url: string,
  config?: AxiosRequestConfig,
  useCache: boolean = true,
): Promise<ApiResponse<T>> =>
  apiRequest<T>('GET', url, undefined, {
    ...config,
    params: {
      ...config?.params,
    },
  }, useCache);

export const post = async <T>(
  url: string,
  data: Record<string, unknown>,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> => apiRequest<T>('POST', url, data, config);

export const put = async <T>(
  url: string,
  data: Record<string, unknown>,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> => apiRequest<T>('PUT', url, data, config);

export const del = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> => apiRequest<T>('DELETE', url, undefined, config);

// Cancel a specific request
export const cancelRequest = (method: string, url: string, params?: any): boolean => {
  const key = generateCacheKey(method, url, params);
  const cancelToken = cancelTokens.get(key);
  if (cancelToken) {
    cancelToken.cancel('Request cancelled by user');
    cancelTokens.delete(key);
    return true;
  }
  return false;
};

// Cancel all pending requests
export const cancelAllRequests = (): void => {
  cancelTokens.forEach((cancelToken) => {
    cancelToken.cancel('All requests cancelled');
  });
  cancelTokens.clear();
};

// Clear cache
export const clearApiCache = (): void => {
  clearCache();
};

export default apiClient;
