// src/store/snackbar/snackbarSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {SnackbarState} from 'interfaces';
import {ERROR} from '../utils/local/error';

const initialState: SnackbarState = {
  message: '',
  success: false, // Default value for success
  visible: false,
};

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    showSnackbar: (
      state,
      action: PayloadAction<{
        message: string | undefined;
        success?: boolean; // Make success optional
      }>,
    ) => {
      state.message = action.payload.message ?? ERROR.error;
      state.success = action.payload.success ?? false; // Default to false if success is not provided
      state.visible = true;
    },
    hideSnackbar: state => {
      state.visible = false;
    },
  },
});

export const {showSnackbar, hideSnackbar} = snackbarSlice.actions;

export default snackbarSlice.reducer;
