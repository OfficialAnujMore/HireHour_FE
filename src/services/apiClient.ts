import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}


// Define a list of unprotected routes (or create a condition based on your needs)
const unprotectedRoutes = ['/public', '/auth/login', '/auth/register','api/v1/user/loginUser'];

const apiClient = axios.create({
  baseURL: 'http://10.67.48.210:3000/', // Replace with your API base URL
  timeout: 10000, // Timeout after 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token'); // Replace with token retrieval logic
    if (!unprotectedRoutes.some((route) => config.url?.includes(route)) && token) {
      // Only add token for protected routes
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    return Promise.reject(error.response?.data || error.message);
  }
);

const apiRequest = async <T>(
  method: AxiosRequestConfig['method'],
  url: string,
  data?: Record<string, unknown>,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  
  try {
    const response = await apiClient.request<ApiResponse<T>>({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const get = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => apiRequest<T>('GET', url, undefined, {
  ...config,
  params: {
    ...config?.params,
  }
});

export const post = async <T>(
  url: string,
  data: Record<string, unknown>,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => apiRequest<T>('POST', url, data, config);

export const put = async <T>(
  url: string,
  data: Record<string, unknown>,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => apiRequest<T>('PUT', url, data, config);

export const del = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => apiRequest<T>('DELETE', url, undefined, config);

export default apiClient;
