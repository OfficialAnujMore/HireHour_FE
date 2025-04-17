// store.ts
import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistStore} from 'redux-persist';
import snackbarReducer from './snackbarSlice';
import cartReducer from './cartSlice';
import {authReducer} from './authSlice'; // Import the authReducer

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  snackbar: snackbarReducer,
  cart: cartReducer,
});

// Configure Store
export const store = configureStore({
  reducer: rootReducer,
});

export const persistor = persistStore(store);

// Type Definitions
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
