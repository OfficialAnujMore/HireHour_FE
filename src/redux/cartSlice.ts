import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CartItem, CartState} from 'interfaces';

export const initialState: CartState = {
  items: [],
  selectedTimeslots: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add or update the cart item based on serviceId
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItemIndex = state.items.findIndex(
        item => item.serviceId === action.payload.serviceId,
      );

      if (existingItemIndex !== -1) {
        // Update existing item
        state.items[existingItemIndex] = action.payload;
      } else {
        // Add new item to cart
        state.items.push(action.payload);
      }
      console.log(state.items);
    },

    // Remove a specific schedule from the cart based on serviceId and scheduleId
    removeScheduleFromCart: (
      state,
      action: PayloadAction<{serviceId: string; scheduleId: string}>,
    ) => {
      const service = state.items.find(
        item => item.serviceId === action.payload.serviceId,
      );
      if (service) {
        service.schedule = service.schedule.filter(
          schedule => schedule.id !== action.payload.scheduleId,
        );
      }
    },

    // Remove the entire service from the cart based on serviceId
    removeServiceFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        item => item.serviceId !== action.payload,
      );
      console.log(state.items);
      
    },

    // Clear all items in the cart
    clearCart: state => {
      state.items = [];
      state.selectedTimeslots = [];
    },
  },
});

export const {
  addToCart,
  removeScheduleFromCart,
  removeServiceFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
