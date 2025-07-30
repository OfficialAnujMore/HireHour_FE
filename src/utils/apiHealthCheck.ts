import { get } from '../services/apiClient';

export interface ApiHealthStatus {
  isHealthy: boolean;
  responseTime: number;
  error?: string;
  timestamp: number;
}

/**
 * Check if the API is reachable and responding
 */
export const checkApiHealth = async (): Promise<ApiHealthStatus> => {
  const startTime = Date.now();
  
  try {
    // Try to make a simple GET request to test connectivity
    // You can replace this with a simple health check endpoint if available
    await get('/health', {}, false); // Don't use cache for health checks
    
    const responseTime = Date.now() - startTime;
    
    return {
      isHealthy: true,
      responseTime,
      timestamp: Date.now(),
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      isHealthy: false,
      responseTime,
      error: errorMessage,
      timestamp: Date.now(),
    };
  }
};

/**
 * Get detailed network diagnostic information
 */
export const getNetworkDiagnostics = async () => {
  const healthStatus = await checkApiHealth();
  
  return {
    apiHealth: healthStatus,
    userAgent: 'React Native App',
    timestamp: Date.now(),
    // Add more diagnostic info as needed
  };
};

/**
 * Log network diagnostics for debugging
 */
export const logNetworkDiagnostics = async () => {
  const diagnostics = await getNetworkDiagnostics();
  console.log('Network Diagnostics:', JSON.stringify(diagnostics, null, 2));
  return diagnostics;
}; 