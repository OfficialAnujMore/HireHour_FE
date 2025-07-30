import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface ServiceCreationState {
  title: string;
  description: string;
  pricing: string;
  category: string;
  servicePreview: any[];
  selectedDates: {[key: string]: {selected: boolean; isAvailable: boolean}};
}

const initialState: ServiceCreationState = {
  title: '',
  description: '',
  pricing: '',
  category: '',
  servicePreview: [],
  selectedDates: {},
};

const serviceCreationSlice = createSlice({
  name: 'serviceCreation',
  initialState,
  reducers: {
    updateServiceDetails: (state, action: PayloadAction<Partial<ServiceCreationState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    updateSelectedDates: (state, action: PayloadAction<{[key: string]: {selected: boolean; isAvailable: boolean}}>) => {
      state.selectedDates = action.payload;
    },
    clearServiceCreation: (state) => {
      return initialState;
    },
  },
});

export const {
  updateServiceDetails,
  updateSelectedDates,
  clearServiceCreation,
} = serviceCreationSlice.actions;

export default serviceCreationSlice.reducer; 