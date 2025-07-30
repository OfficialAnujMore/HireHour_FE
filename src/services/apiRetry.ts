import { cancelAllRequests } from './apiClient';
import { ApiResponse } from './apiClient';
import { AppError } from './types';
import { errorHandler } from '../utils/errorHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';
import axios from 'axios';

/**
 * API Retry and Token Refresh System
 * Handles automatic retries, token refresh, and request queuing
 */

// Retry configuration
export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier: number;
  maxRetryDelay: number;
}

// Default retry configuration
const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  backoffMultiplier: 2,
  maxRetryDelay: 10000,
};

// Request queue for token refresh
interface QueuedRequest {
  method: string;
  url: string;
  data?: Record<string, unknown>;
  config?: Record<string, unknown>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
}

class ApiRetryManager {
  private retryConfig: RetryConfig;
  private isRefreshingToken: boolean = false;
  private requestQueue: QueuedRequest[] = [];
  private refreshPromise: Promise<string | null> | null = null;

  constructor(config: Partial<RetryConfig> = {}) {
    this.retryConfig = { ...defaultRetryConfig, ...config };
  }

  /**
   * Execute API request with retry logic
   */
  public async executeWithRetry<T>(
    method: string,
    url: string,
    data?: Record<string, unknown>,
    config?: Record<string, unknown>,
    retryCount: number = 0
  ): Promise<ApiResponse<T>> {
    try {
      const response = await axios.request<ApiResponse<T>>({
        method,
        url,
        data,
        ...config,
      });
      return response.data;
    } catch (error: unknown) {
      const shouldRetry = this.shouldRetry(error as any, retryCount);
      
      if (shouldRetry) {
        return this.retryRequest<T>(method, url, data, config, retryCount);
      }
      
      throw error;
    }
  }

  /**
   * Determine if request should be retried
   */
  private shouldRetry(error: any, retryCount: number): boolean {
    // Don't retry if max retries reached
    if (retryCount >= this.retryConfig.maxRetries) {
      return false;
    }

    // Retry on network errors
    if (!error.response) {
      return true;
    }

    // Retry on specific HTTP status codes
    const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
    if (retryableStatusCodes.includes(error.response?.status)) {
      return true;
    }

    // Don't retry on client errors (4xx) except 408 and 429
    if (error.response?.status >= 400 && error.response?.status < 500) {
      return false;
    }

    return false;
  }

  /**
   * Retry request with exponential backoff
   */
  private async retryRequest<T>(
    method: string,
    url: string,
    data: Record<string, unknown> | undefined,
    config: Record<string, unknown> | undefined,
    retryCount: number
  ): Promise<ApiResponse<T>> {
    const delay = this.calculateRetryDelay(retryCount);
    
    // Wait before retrying
    await this.delay(delay);
    
    // Retry the request
    return this.executeWithRetry<T>(method, url, data, config, retryCount + 1);
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  private calculateRetryDelay(retryCount: number): number {
    const delay = this.retryConfig.retryDelay * Math.pow(this.retryConfig.backoffMultiplier, retryCount);
    return Math.min(delay, this.retryConfig.maxRetryDelay);
  }

  /**
   * Delay utility function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Execute request with token refresh handling
   */
  public async executeWithTokenRefresh<T>(
    method: string,
    url: string,
    data?: Record<string, unknown>,
    config?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    try {
      return await this.executeWithRetry<T>(method, url, data, config);
    } catch (error: unknown) {
      // Check if error is due to expired token
      if (this.isTokenExpiredError(error as any)) {
        return this.handleTokenExpired<T>(method, url, data, config);
      }
      
      throw error;
    }
  }

  /**
   * Check if error is due to expired token
   */
  private isTokenExpiredError(error: any): boolean {
    return error.response?.status === 401 && 
           error.response?.data?.message?.toLowerCase().includes('token');
  }

  /**
   * Handle token expired error
   */
  private async handleTokenExpired<T>(
    method: string,
    url: string,
    data?: Record<string, unknown>,
    config?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    // If already refreshing token, queue the request
    if (this.isRefreshingToken) {
      return this.queueRequest<T>(method, url, data, config);
    }

    // Start token refresh
    this.isRefreshingToken = true;
    
    try {
      const newToken = await this.refreshToken();
      
      if (newToken) {
        // Update the request config with new token
        const updatedConfig = {
          ...(config as Record<string, unknown>),
          headers: {
            ...(config?.headers as Record<string, unknown>),
            Authorization: `Bearer ${newToken}`,
          },
        };
        
        // Retry the original request with new token
        return await this.executeWithRetry<T>(method, url, data, updatedConfig);
      } else {
        // Token refresh failed, redirect to login
        this.handleTokenRefreshFailed();
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      this.handleTokenRefreshFailed();
      throw error;
    } finally {
      this.isRefreshingToken = false;
      this.processRequestQueue();
    }
  }

  /**
   * Queue request for later execution
   */
  private queueRequest<T>(
    method: string,
    url: string,
    data?: Record<string, unknown>,
    config?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        method,
        url,
        data,
        config,
        resolve,
        reject,
      });
    });
  }

  /**
   * Process queued requests
   */
  private async processRequestQueue(): Promise<void> {
    const queue = [...this.requestQueue];
    this.requestQueue = [];

    for (const request of queue) {
      try {
        const response = await this.executeWithRetry(
          request.method,
          request.url,
          request.data,
          request.config
        );
        request.resolve(response);
      } catch (error) {
        request.reject(error);
      }
    }
  }

  /**
   * Refresh authentication token
   */
  private async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      if (!refreshToken) {
        return null;
      }

      // Call token refresh API
      const response = await axios.request<ApiResponse<{ token: string; refreshToken: string }>>({
        method: 'POST',
        url: '/auth/refresh-token',
        data: { refreshToken },
      });

      if (response.data.success && response.data.data) {
        // Store new tokens
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.data.token);
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.data.refreshToken);
        
        return response.data.data.token;
      }

      return null;
    } catch (error: unknown) {
      errorHandler.handleError(error, {
        component: 'ApiRetryManager',
        action: 'refreshToken',
      });
      return null;
    }
  }

  /**
   * Handle token refresh failure
   */
  private handleTokenRefreshFailed(): void {
    // Clear stored tokens
    AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);

    // Cancel all pending requests
    cancelAllRequests();

    // Clear request queue
    this.requestQueue = [];

    // Dispatch logout action (you'll need to import your Redux store)
    // store.dispatch(logout());
    
    console.log('Token refresh failed - user logged out');
  }

  /**
   * Update retry configuration
   */
  public updateRetryConfig(config: Partial<RetryConfig>): void {
    this.retryConfig = { ...this.retryConfig, ...config };
  }

  /**
   * Get current retry configuration
   */
  public getRetryConfig(): RetryConfig {
    return { ...this.retryConfig };
  }

  /**
   * Get queue status
   */
  public getQueueStatus(): { isRefreshing: boolean; queueLength: number } {
    return {
      isRefreshing: this.isRefreshingToken,
      queueLength: this.requestQueue.length,
    };
  }
}

// Create singleton instance
export const apiRetryManager = new ApiRetryManager();

// Export convenience functions
export const executeWithRetry = <T>(
  method: string,
  url: string,
  data?: Record<string, unknown>,
  config?: Record<string, unknown>
) => apiRetryManager.executeWithRetry<T>(method, url, data, config);

export const executeWithTokenRefresh = <T>(
  method: string,
  url: string,
  data?: Record<string, unknown>,
  config?: Record<string, unknown>
) => apiRetryManager.executeWithTokenRefresh<T>(method, url, data, config);

export default apiRetryManager; 