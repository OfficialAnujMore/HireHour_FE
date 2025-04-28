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
  GET_BOOKED_SERVICES,
  HANDLE_SLOT_APPROVAL,
  HOLD_SLOTS,
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

export const getMyBookedServices = async (data: {
  id: string;
  isAvailable: boolean;
}): Promise<ApiResponse<ServiceDetails> | ErrorResponse> => {
  try {
    return await post<ServiceDetails>(
      `${V1_SERVICE_BASE_ROUTE}${GET_BOOKED_SERVICES}`,
      data,
    );
  } catch (error) {
    return handleError(error, 'getMyBookedServices'); // Return the error handled by handleError function
  }
};


export const handleSlotApproval = async (data: any): Promise<ApiResponse<ServiceDetails> | ErrorResponse> => {
  try {
    return await post<ServiceDetails>(
      `${V1_SERVICE_BASE_ROUTE}${HANDLE_SLOT_APPROVAL}`,
      data,
    );
  } catch (error) {
    return handleError(error, 'handleSlotApproval'); // Return the error handled by handleError function
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
  fcmToken: string | undefined,
): Promise<ApiResponse<ServiceDetails[]> | ErrorResponse> => {
  try {
    return await del<ServiceDetails[]>(
      `${V1_SERVICE_BASE_ROUTE}${DELETE_SERVICE}`,
      {
        params: {serviceId: serviceId, fcmToken: fcmToken},
      },
    );
  } catch (error) {
    return handleError(error, 'deleteServiceById'); // Corrected error message
  }
};


export const holdSlot = async (
  data: unknown,
): Promise<ApiResponse<ServiceDetails[]> | ErrorResponse> => {
  try {
    return await post<ServiceDetails[]>(
      `${V1_SERVICE_BASE_ROUTE}${HOLD_SLOTS}`,
      {schedule: data},
    );
  } catch (error) {
    return handleError(error, 'getUpcomingEvents'); // Return the error handled by handleError function
  }
};
