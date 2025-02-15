import {ErrorResponse, User} from 'interfaces';
import {ApiResponse, post} from './apiClient';
import {handleError} from '../utils/globalFunctions'; // Assuming handleError is imported
import {UPDATE_ROLE, V1_USER_BASE_ROUTE} from './routes';

export const updateUserRole = async (
  data: any,
): Promise<ApiResponse<User[]> | ErrorResponse> => {
  try {
    const response = await post<User[]>(
      `${V1_USER_BASE_ROUTE}${UPDATE_ROLE}`,
      data,
    );
    return response;
  } catch (error) {
    return handleError(error); // Return the error handled by handleError function
  }
};
