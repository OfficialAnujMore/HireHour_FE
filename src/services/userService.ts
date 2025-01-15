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
    
    // Return the response from the POST request
    const response = await post<User>('api/v1/user/registerUser', user);

    return response;  // Return the response here
  } catch (error) {
    throw error; // It's important to throw the error so handleLogin can catch it
  }
};

export const getServiceProviders = async (categories?: string[]): Promise<ApiResponse<User[]>> => {
  try {

    // If categories exist, serialize the array into a JSON string before passing as query params
    const serializedCategories = categories ? JSON.stringify(categories) : undefined;

    // Return the response from the GET request with serialized categories as query params
    const response = await get<User[]>('api/v1/user/getServiceProviders', {
      params: {
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
    const response = await post<User[]>('api/v1/user/addService',data
    );
    return response;
  } catch (error) {
    throw error;
  }
}

