import {ErrorResponse, ServiceDetails} from 'interfaces';
import {ApiResponse, del, get, post} from './apiClient';
import {handleError} from '../utils/globalFunctions';
import {
  UPSERT_SERVICE,
  BOOK_SERVICE,
  GET_SERVICE_PROVIDERS,
  GET_USER_SERVICES,
  UPCOMING_EVENTS,
  V1_SERVICE_BASE_ROUTE,
  DELETE_SERVICE,
} from './routes';

export const getServiceProviders = async (
  userId: string | undefined,
  categories?: string[],
): Promise<ApiResponse<ServiceDetails[]> | ErrorResponse> => {
  try {
    const serializedCategories = categories
      ? JSON.stringify(categories)
      : undefined;

    return await get<ServiceDetails[]>(
      `${V1_SERVICE_BASE_ROUTE}${GET_SERVICE_PROVIDERS}`,
      {
        params: {id: userId, category: serializedCategories},
      },
    );
  } catch (error) {
    return handleError(error, 'getServiceProviders'); // Return the error handled by handleError function
  }
};

export const addService = async (
  data: unknown,
): Promise<ApiResponse<ServiceDetails> | ErrorResponse> => {
  try {
    return await post<ServiceDetails>(
      `${V1_SERVICE_BASE_ROUTE}${UPSERT_SERVICE}`,
      data,
    );
  } catch (error) {
    return handleError(error, 'addService'); // Return the error handled by handleError function
  }
};

export const getUserServices = async (
  data: unknown,
): Promise<ApiResponse<ServiceDetails> | ErrorResponse> => {
  try {
    return await post<ServiceDetails>(
      `${V1_SERVICE_BASE_ROUTE}${GET_USER_SERVICES}`,
      data,
    );
  } catch (error) {
    return handleError(error, 'getUserServices'); // Return the error handled by handleError function
  }
};

export const bookService = async (
  data: unknown,
): Promise<ApiResponse<ServiceDetails> | ErrorResponse> => {
  try {
    return await post<ServiceDetails>(
      `${V1_SERVICE_BASE_ROUTE}${BOOK_SERVICE}`,
      data,
    );
  } catch (error) {
    return handleError(error, 'bookService'); // Return the error handled by handleError function
  }
};

export const getUpcomingEvents = async (
  data: unknown,
): Promise<ApiResponse<ServiceDetails[]> | ErrorResponse> => {
  try {
    return await post<ServiceDetails[]>(
      `${V1_SERVICE_BASE_ROUTE}${UPCOMING_EVENTS}`,
      data,
    );
  } catch (error) {
    return handleError(error, 'getUpcomingEvents'); // Return the error handled by handleError function
  }
};

export const deleteServiceById = async (
  serviceId: string,
): Promise<ApiResponse<ServiceDetails[]> | ErrorResponse> => {
  try {
    return await del<ServiceDetails[]>(
      `${V1_SERVICE_BASE_ROUTE}${DELETE_SERVICE}`,
      {
        params: {serviceId: serviceId},
      },
    );
  } catch (error) {
    return handleError(error, 'deleteServiceById'); // Corrected error message
  }
};

