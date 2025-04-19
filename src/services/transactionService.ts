import {ErrorResponse} from 'interfaces';
import {ApiResponse, post} from './apiClient';
import {handleError} from '../utils/globalFunctions';
import {GET_USER_TRANSACTION, V1_TRANSACTION_BASE_ROUTE} from './routes';

export const getTransactions = async (
  userId: string,
): Promise<ApiResponse<any[]> | ErrorResponse> => {
  try {
    
    return await post<any>(
      `${V1_TRANSACTION_BASE_ROUTE}${GET_USER_TRANSACTION}`,
      {userId: userId},
    );
  } catch (error) {
    return handleError(error, 'getTransactions'); // Return the error handled by handleError function
  }
};
