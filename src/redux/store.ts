// store.ts
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import { User } from 'interfaces/userInterface';
import snackbarReducer from './snackbarSlice';
// Auth State Interface
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null; // Add token field
}

// Initial State
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null, // Initially set to null
};

// Create Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.user.token; // Store token in state
    },
    
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

// Persist Config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, authSlice.reducer);

// Configure Store
export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    snackbar: snackbarReducer,
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
