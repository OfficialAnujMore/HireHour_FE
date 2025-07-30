import {ErrorResponse, User} from 'interfaces';
import {ApiResponse, post} from './apiClient';
import {handleError} from '../utils/globalFunctions';
import {UPDATE_ROLE, UPSERT_FCM_TOKEN, V1_USER_BASE_ROUTE} from './routes';

export const updateUserRole = async (
  data: Record<string, unknown>,
): Promise<ApiResponse<User> | ErrorResponse> => {
  try {
    const response = await post<User>(
      `${V1_USER_BASE_ROUTE}${UPDATE_ROLE}`,
      data,
    );
    return response;
  } catch (error: unknown) {
    return handleError(error, 'updateUserRole');
  }
};

export const upsertFCMToken = async (
  data: Record<string, unknown>,
): Promise<ApiResponse<User> | ErrorResponse> => {
  try {    
    const response = await post<User>(
      `${V1_USER_BASE_ROUTE}${UPSERT_FCM_TOKEN}`,
      data,
    );
    
    return response;
  } catch (error: unknown) {
    return handleError(error, 'upsertFCMToken');
  }
};

