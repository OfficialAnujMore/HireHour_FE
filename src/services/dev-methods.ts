import { get, post } from './apiClient';

interface User {
  id: number;
  name: string;
  email: string;
}

// GET Example
const fetchAllUsers = async (): Promise<void> => {
  try {
    const response = await get<User[]>('/users');
    console.log('Users:', response.data);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// POST Example
const addNewUser = async (): Promise<void> => {
  const newUser = { name: 'Alice', email: 'alice@example.com' };
  try {
    const response = await post<User>('/users', newUser);
    console.log('Added User:', response.data);
  } catch (error) {
    console.error('Error adding user:', error);
  }
};
