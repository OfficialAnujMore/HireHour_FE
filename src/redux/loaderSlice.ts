import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface LoaderState {
  isLoading: boolean;
  message: string;
  requestCount: number;
}

const initialState: LoaderState = {
  isLoading: false,
  message: 'Loading...',
  requestCount: 0,
};

const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    showLoader: (state, action: PayloadAction<string>) => {
      state.requestCount += 1;
      state.isLoading = true;
      state.message = action.payload || 'Loading...';
    },
    hideLoader: (state) => {
      state.requestCount = Math.max(0, state.requestCount - 1);
      if (state.requestCount === 0) {
        state.isLoading = false;
      }
    },
    resetLoader: (state) => {
      state.isLoading = false;
      state.requestCount = 0;
      state.message = 'Loading...';
    },
  },
});

export const {showLoader, hideLoader, resetLoader} = loaderSlice.actions;
export default loaderSlice.reducer; 