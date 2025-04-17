// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, User } from 'interfaces';


// Initial State
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

// Create Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.user.token;

      AsyncStorage.setItem('token', action.payload.user.token);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      AsyncStorage.removeItem('token');
    },
  },
});

// Export Actions
export const { login, logout } = authSlice.actions;

// Persist Config
const persistConfig = {
  key: 'auth',
  storage: AsyncStorage,
};

// Persisted Reducer
export const authReducer = persistReducer(persistConfig, authSlice.reducer);
