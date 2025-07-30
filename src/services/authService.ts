import { handleError } from '../utils/globalFunctions';
import {ErrorResponse, OTPStatus, User} from '../interfaces';
import {ApiResponse, get, post} from './apiClient';
import {
  LOGIN_USER,
  REGISTER_USER,
  V1_AUTH_BASE_ROUTE,
  VERIFY_EMAIL_AND_USERNAME,
  VERIFY_OTP,
} from './routes';
import { debugVerifyUsernameAndEmail } from '../utils/debugUtils';
import { retryWithBackoff } from '../utils/networkUtils';

export const loginUser = async (
  user: any,
): Promise<ApiResponse<User> | ErrorResponse> => {
  try {
    return await post<User>(`${V1_AUTH_BASE_ROUTE}${LOGIN_USER}`, user);
  } catch (error: unknown) {
    return handleError(error, 'loginUser');
  }
};

export const registerUser = async (
  user: any,
): Promise<ApiResponse<User> | ErrorResponse> => {
  try {
    return await post<User>(`${V1_AUTH_BASE_ROUTE}${REGISTER_USER}`, user);
  } catch (error: unknown) {
    return handleError(error, 'registerUser');
  }
};

export const verifyUsernameAndEmail = async (data: {
  email: string;
  password: string;
  username: string;
}): Promise<ApiResponse<User> | ErrorResponse> => {
  try {
    // Use retry mechanism for network resilience
    return await retryWithBackoff(async () => {
      return await post<User>(
        `${V1_AUTH_BASE_ROUTE}${VERIFY_EMAIL_AND_USERNAME}`,
        data,
      );
    }, 2, 1000); // 2 retries with 1 second base delay
  } catch (error: unknown) {
    // Enhanced debugging for this specific endpoint
    if (__DEV__) {
      await debugVerifyUsernameAndEmail(error);
    }
    return handleError(error, 'verifyUsernameAndEmail');
  }
};

export const verifyOTP = async (data: {
  key: string;
  otp: string;
}): Promise<ApiResponse<OTPStatus> | ErrorResponse> => {
  try {
    return await post<OTPStatus>(`${V1_AUTH_BASE_ROUTE}${VERIFY_OTP}`, data);
  } catch (error: unknown) {
    return handleError(error, 'verifyOTP');
  }
};
