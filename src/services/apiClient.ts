import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Config from 'react-native-config';
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}
console.log('Base URL:', Config.API_BASE_URL);

const apiClient = axios.create({
  baseURL: Config.API_BASE_URL, // Replace with your API base URL
  timeout: 10000, // Timeout after 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = 'YOUR_AUTH_TOKEN'; // Replace with token retrieval logic
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error('Response Error:', error.response?.data || error.message);
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
  ): Promise<ApiResponse<T>> => apiRequest<T>('GET', url, undefined, config);
  
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
