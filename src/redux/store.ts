// store.ts
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';

// Auth State Interface
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: { id: string; name: string } | null;
}

// Initial State
const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
};

// Create Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; user: { id: string; name: string } }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
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
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
