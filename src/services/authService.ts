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


export const loginUser = async (
  user: any,
): Promise<ApiResponse<User> | ErrorResponse> => {
  try {
    return await post<User>(`${V1_AUTH_BASE_ROUTE}${LOGIN_USER}`, user);
  } catch (error) {
    return handleError(error,'loginUser');
  }
};

export const registerUser = async (
  user: any,
): Promise<ApiResponse<User> | ErrorResponse> => {
  try {
    return await post<User>(`${V1_AUTH_BASE_ROUTE}${REGISTER_USER}`, user);
  } catch (error) {
    return handleError(error, 'registerUser');
  }
};

export const verifyUsernameAndEmail = async (data: {
  email: string;
  password: string;
  username: string;
}): Promise<ApiResponse<User> | ErrorResponse> => {
  try {
    return await post<User>(
      `${V1_AUTH_BASE_ROUTE}${VERIFY_EMAIL_AND_USERNAME}`,
      data,
    );
  } catch (error) {
    return handleError(error, 'verifyUsernameAndEmail');
  }
};

export const verifyOTP = async (data: {
  key: string;
  otp: string;
}): Promise<ApiResponse<OTPStatus> | ErrorResponse> => {
  try {
    return await post<OTPStatus>(`${V1_AUTH_BASE_ROUTE}${VERIFY_OTP}`, data);
  } catch (error) {
    return handleError(error, 'verifyOTP');
  }
};
