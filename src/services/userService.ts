import { ApiResponse, get, post } from './apiClient';

interface User {
  email: string;
  password: string;
}


export const loginUser = async (user:any): Promise<ApiResponse<User>> => {
  try {
    console.log(user);
    
    const response = await post<User>('api/v1/user/loginUser', user);
    console.log('Added User:', response.data);
    return response;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};
