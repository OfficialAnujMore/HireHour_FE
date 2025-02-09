// src/store/snackbar/snackbarSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SnackbarState } from 'interfaces';

const initialState: SnackbarState = {
  message: '',
  visible: false,
};

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    showSnackbar: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
      state.visible = true;
    },
    hideSnackbar: (state) => {
      state.visible = false;
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;
