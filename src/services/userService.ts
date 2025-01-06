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
