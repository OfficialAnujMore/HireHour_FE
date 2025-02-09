import {OTPStatus, User} from '../interfaces/userInterface';
import {ApiResponse, get, post} from './apiClient';
import {
  LOGIN_USER,
  REGISTER_USER,
  V1_AUTH_BASE_ROUTE,
  VERIFY_EMAIL_AND_USERNAME,
  VERIFY_OTP,
} from './routes';

export const loginUser = async (user: any): Promise<ApiResponse<User>> => {
  try {
    // Return the response from the POST request
    const response = await post<User>(
      `${V1_AUTH_BASE_ROUTE}${LOGIN_USER}`,
      user,
    );
    return response; // Return the response here
  } catch (error) {
    throw error; // It's important to throw the error so handleLogin can catch it
  }
};

export const registerUser = async (user: any): Promise<ApiResponse<User>> => {
  try {
    // Send POST request
    const response = await post<User>(
      `${V1_AUTH_BASE_ROUTE}${REGISTER_USER}`,
      user,
    );

    return response; // Return response
  } catch (error: any) {
    const errorMessage =
      error?.message ?? 'An unexpected error occurred during registration.';
    throw errorMessage; // Throw a detailed error
  }
};

export const verifyUsernameAndEmail = async (data: {
  email: string;
  password: string;
  username: string;
}): Promise<ApiResponse<User>> => {
  try {
    

    // Send POST request
    const response = await post<User>(
      `${V1_AUTH_BASE_ROUTE}${VERIFY_EMAIL_AND_USERNAME}`,
      data,
    );

    return response;
  } catch (error: any) {
    // Create a custom error message if server response contains useful information
    const errorMessage =
      error?.message ?? 'An unexpected error occurred during registration.';
    throw errorMessage; // Throw a detailed error
  }
};

export const verifyOTP = async (data: {
  key: string;
  otp: string;
}): Promise<ApiResponse<OTPStatus>> => {
  try {
    // Send POST request
    const response = await post<OTPStatus>(
      `${V1_AUTH_BASE_ROUTE}${VERIFY_OTP}`,
      data,
    );

    return response;
  } catch (error: any) {
    // Create a custom error message if server response contains useful information
    const errorMessage =
      error?.message ?? 'An unexpected error occurred during verification.';
    throw errorMessage; // Throw a detailed error
  }
};
