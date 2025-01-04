import { User } from 'interfaces/userInterface';
import { ApiResponse, get, post } from './apiClient';


export const loginUser = async (user: any): Promise<ApiResponse<User>> => {
  try {
    console.log(user);

    // Return the response from the POST request
    const response = await post<User>('api/v1/user/loginUser', user);
    console.log('Added User:', response.data);
    return response;  // Return the response here
  } catch (error) {
    console.error('Error adding user:', error);
    throw error; // It's important to throw the error so handleLogin can catch it
  }
};
