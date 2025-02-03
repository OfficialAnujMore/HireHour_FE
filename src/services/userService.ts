import {User} from 'interfaces/userInterface';
import {ApiResponse, get, post} from './apiClient';
import {UPCOMING_EVENTS, UPDATE_ROLE, V1_USER_BASE_ROUTE} from './routes';

export const updateUserRole = async (
  data: any,
): Promise<ApiResponse<User[]>> => {
  try {
    console.log(data);

    const response = await post<User[]>(
      `${V1_USER_BASE_ROUTE}${UPDATE_ROLE}`,
      data,
    );
    return response;
  } catch (error: any) {
    const errorMessage =
      error?.message ?? 'An unexpected error occurred during registration.';
    throw errorMessage;
  }
};


