import { ServiceDetails } from 'interfaces';
import {ApiResponse, get, post} from './apiClient';
import {
  ADD_SERVICE,
  BOOK_SERVICE,
  GET_SERVICE_PROVIDERS,
  GET_USER_SERVICES,
  UPCOMING_EVENTS,
  V1_SERVICE_BASE_ROUTE,
} from './routes';

export const getServiceProviders = async (
  userId: string | undefined,
  categories?: string[],
): Promise<ApiResponse<ServiceDetails[]>> => {
  try {
    // If categories exist, serialize the array into a JSON string before passing as query params
    const serializedCategories = categories
      ? JSON.stringify(categories)
      : undefined;

    // Return the response from the GET request with serialized categories as query params
    const response = await get<ServiceDetails[]>(
      `${V1_SERVICE_BASE_ROUTE}${GET_SERVICE_PROVIDERS}`,
      {
        params: {
          id: userId,
          category: serializedCategories, // Send serialized categories as a query param
        },
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const addService = async (data: any): Promise<ApiResponse<ServiceDetails[]>> => {
  try {
    const response = await post<ServiceDetails[]>(
      `${V1_SERVICE_BASE_ROUTE}${ADD_SERVICE}`,
      data,
    );
    console.log('addService response', response);
    
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserServices = async (
  data: any,
): Promise<ApiResponse<ServiceDetails[]>> => {
  try {
    const response = await post<ServiceDetails[]>(
      `${V1_SERVICE_BASE_ROUTE}${GET_USER_SERVICES}`,
      data,
    );
    return response;
  } catch (error: any) {
    console.log(error);

    const errorMessage =
      error?.message ?? 'An unexpected error occurred during registration.';
    throw errorMessage;
  }
};

export const bookService = async (data: any): Promise<ApiResponse<ServiceDetails>> => {
  try {
    console.log(data);

    // Return the response from the POST request
    const response = await post<ServiceDetails>(
      `${V1_SERVICE_BASE_ROUTE}${BOOK_SERVICE}`,
      data,
    );
    return response; // Return the response here
  } catch (error) {
    throw error; // It's important to throw the error so handleLogin can catch it
  }
};

export const getUpcomingEvents = async (
  data: any,
): Promise<ApiResponse<ServiceDetails>> => {
  try {
    console.log('getUpcomingEvents', data);

    // Return the response from the POST request
    const response = await post<ServiceDetails>(
      `${V1_SERVICE_BASE_ROUTE}${UPCOMING_EVENTS}`,
      data,
    );
    console.log('getUpcomingEvents response', response);
    return response; // Return the response here
  } catch (error) {
    console.log({error});
    
    throw error; // It's important to throw the error so handleLogin can catch it
  }
};
