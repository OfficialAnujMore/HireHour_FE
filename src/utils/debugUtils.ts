import { logNetworkDiagnostics } from './apiHealthCheck';

export interface DebugInfo {
  timestamp: number;
  error: string;
  context: string;
  networkDiagnostics?: any;
  userAgent: string;
  platform: string;
}

/**
 * Enhanced error logging with network diagnostics
 */
export const logErrorWithDiagnostics = async (
  error: any,
  context: string
): Promise<DebugInfo> => {
  const debugInfo: DebugInfo = {
    timestamp: Date.now(),
    error: error?.message || String(error),
    context,
    userAgent: 'React Native App',
    platform: 'React Native',
  };

  try {
    // Get network diagnostics if it's a network-related error
    if (error?.message?.includes('Network') || 
        error?.message?.includes('timeout') ||
        error?.message?.includes('ENOTFOUND') ||
        error?.message?.includes('ECONNREFUSED')) {
      debugInfo.networkDiagnostics = await logNetworkDiagnostics();
    }
  } catch (diagnosticError) {
    console.error('Failed to get network diagnostics:', diagnosticError);
  }

  console.error('Debug Info:', JSON.stringify(debugInfo, null, 2));
  return debugInfo;
};

/**
 * Specific debug function for verifyUsernameAndEmail errors
 */
export const debugVerifyUsernameAndEmail = async (error: any) => {
  console.log('=== verifyUsernameAndEmail Debug ===');
  
  const debugInfo = await logErrorWithDiagnostics(error, 'verifyUsernameAndEmail');
  
  // Additional specific checks for this endpoint
  console.log('API Base URL:', process.env.API_BASE_URL || 'https://api.hirehour.com');
  console.log('Full URL would be:', `${process.env.API_BASE_URL || 'https://api.hirehour.com'}/api/v1/auth/verifyUsernameAndEmail`);
  
  return debugInfo;
};

/**
 * Test API connectivity with detailed logging
 */
export const testApiConnectivity = async () => {
  console.log('=== API Connectivity Test ===');
  
  try {
    const diagnostics = await logNetworkDiagnostics();
    console.log('Connectivity test completed successfully');
    return diagnostics;
  } catch (error) {
    console.error('Connectivity test failed:', error);
    throw error;
  }
}; 