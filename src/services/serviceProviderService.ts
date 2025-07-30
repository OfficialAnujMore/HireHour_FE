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
  } catch (error: unknown) {
    return handleError(error, 'getServiceProviders');
  }
};

export const addService = async (
  data: Record<string, unknown>,
): Promise<ApiResponse<ServiceDetails> | ErrorResponse> => {
  try {
    return await post<ServiceDetails>(
      `${V1_SERVICE_BASE_ROUTE}${UPSERT_SERVICE}`,
      data,
    );
  } catch (error: unknown) {
    return handleError(error, 'addService');
  }
};

export const getUserServices = async (
  data: Record<string, unknown>,
): Promise<ApiResponse<ServiceDetails[]> | ErrorResponse> => {
  try {
    return await post<ServiceDetails[]>(
      `${V1_SERVICE_BASE_ROUTE}${GET_USER_SERVICES}`,
      data,
    );
  } catch (error: unknown) {
    return handleError(error, 'getUserServices');
  }
};

export const getMyBookedServices = async (data: {
  id: string;
  type: string;
}): Promise<ApiResponse<any[]> | ErrorResponse> => {
  try {
    return await post<any[]>(
      `${V1_SERVICE_BASE_ROUTE}${GET_BOOKED_SERVICES}`,
      data,
    );
  } catch (error: unknown) {
    return handleError(error, 'getMyBookedServices');
  }
};

export const handleSlotApproval = async (
  data: Record<string, unknown>,
): Promise<ApiResponse<ServiceDetails> | ErrorResponse> => {
  try {
    return await post<ServiceDetails>(
      `${V1_SERVICE_BASE_ROUTE}${HANDLE_SLOT_APPROVAL}`,
      data,
    );
  } catch (error: unknown) {
    return handleError(error, 'handleSlotApproval');
  }
};

export const bookService = async (
  data: Record<string, unknown>,
): Promise<ApiResponse<ServiceDetails> | ErrorResponse> => {
  try {
    return await post<ServiceDetails>(
      `${V1_SERVICE_BASE_ROUTE}${BOOK_SERVICE}`,
      data,
    );
  } catch (error: unknown) {
    return handleError(error, 'bookService');
  }
};

export const getUpcomingEvents = async (
  data: Record<string, unknown>,
): Promise<ApiResponse<ServiceDetails[]> | ErrorResponse> => {
  try {
    return await post<ServiceDetails[]>(
      `${V1_SERVICE_BASE_ROUTE}${UPCOMING_EVENTS}`,
      data,
    );
  } catch (error: unknown) {
    return handleError(error, 'getUpcomingEvents');
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
  } catch (error: unknown) {
    return handleError(error, 'deleteServiceById');
  }
};

export const holdSlot = async (
  data: Record<string, unknown>,
): Promise<ApiResponse<ServiceDetails[]> | ErrorResponse> => {
  try {
    return await post<ServiceDetails[]>(
      `${V1_SERVICE_BASE_ROUTE}${HOLD_SLOTS}`,
      {schedule: data},
    );
  } catch (error: unknown) {
    return handleError(error, 'holdSlot');
  }
};
