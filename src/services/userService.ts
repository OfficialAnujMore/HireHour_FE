import { User } from 'interfaces/userInterface';
import { ApiResponse, get, post } from './apiClient';


export const loginUser = async (user: any): Promise<ApiResponse<User>> => {
  try {
    // Return the response from the POST request
    const response = await post<User>('api/v1/user/loginUser', user);
    return response;  // Return the response here
  } catch (error) {
    throw error; // It's important to throw the error so handleLogin can catch it
  }
};

export const registerUser = async (user: any): Promise<ApiResponse<User>> => {
  try {
    console.log('User payload:', user);

    // Send POST request
    const response = await post<User>('api/v1/user/registerUser', user);

    console.log('Registration successful:', response);
    return response; // Return response
  } catch (error: any) {
    console.log('Registration error:', error);

    // Create a custom error message if server response contains useful information
    const errorMessage =
      error?.message ??
      'An unexpected error occurred during registration.';
    throw errorMessage; // Throw a detailed error
  }
};

export const getServiceProviders = async (userId:string|undefined, categories?: string[]): Promise<ApiResponse<User[]>> => {
  try {

    // If categories exist, serialize the array into a JSON string before passing as query params
    const serializedCategories = categories ? JSON.stringify(categories) : undefined;

    // Return the response from the GET request with serialized categories as query params
    const response = await get<User[]>('api/v1/user/getServiceProviders', {
      params: {
        id:userId,
        category: serializedCategories,  // Send serialized categories as a query param
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const addService = async (data: any): Promise<ApiResponse<User[]>> => {
  try {
    const response = await post<User[]>('api/v1/user/addService', data
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export const updateUserRole = async (data: any): Promise<ApiResponse<User[]>> => {
  try {
    const response = await post<User[]>('api/v1/user/updateUserRole', data);
    return response
  } catch (error: any) {
    const errorMessage =
      error?.message ??
      'An unexpected error occurred during registration.';
    throw errorMessage;
  }
}

export const getUserServices = async (data: any): Promise<ApiResponse<User[]>> => {
  try {
    const response = await post<User[]>('api/v1/user/getUserServices', data);
    return response
  } catch (error: any) {
    console.log(error);
    
    const errorMessage =
      error?.message ??
      'An unexpected error occurred during registration.';
    throw errorMessage;
  }
}


export const bookService = async (data: any): Promise<ApiResponse<User>> => {
  try {
    console.log(data);
    
    // Return the response from the POST request
    const response = await post<User>('api/v1/user/bookService', data);
    return response;  // Return the response here
  } catch (error) {
    throw error; // It's important to throw the error so handleLogin can catch it
  }
};

export const getUpcomingEvents = async (data: any): Promise<ApiResponse<User>> => {
  try {
    console.log("getUpcomingEvents", data);
    
    // Return the response from the POST request
    const response = await post<User>('api/v1/user/upcomingEvents', data);
    return response;  // Return the response here
  } catch (error) {
    throw error; // It's important to throw the error so handleLogin can catch it
  }
};
