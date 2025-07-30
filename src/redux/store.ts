// store.ts
import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistStore} from 'redux-persist';
import snackbarReducer from './snackbarSlice';
import cartReducer from './cartSlice';
import {authReducer} from './authSlice';
import loaderReducer from './loaderSlice';
import serviceCreationReducer from './serviceCreationSlice';

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  snackbar: snackbarReducer,
  cart: cartReducer,
  loader: loaderReducer,
  serviceCreation: serviceCreationReducer,
});

// Configure Store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register', 'rehydrate'],
      },
    }),
});

export const persistor = persistStore(store);

// Type Definitions
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
