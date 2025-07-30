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
        const existingItem = state.items[existingItemIndex];

        // Maintain and update schedules
        if (existingItem.schedule && action.payload.schedule) {
          // Merge schedules by adding new ones without removing old ones
          action.payload.schedule.forEach(newSchedule => {
            const existingScheduleIndex = existingItem.schedule.findIndex(
              schedule => schedule.id === newSchedule.id, // assuming each schedule has a unique 'id'
            );

            // existingScheduleIndex, newSchedule
            if (existingScheduleIndex === -1) {
              // Add new schedule only if it doesn't exist already
              existingItem.schedule.push(newSchedule);
            } else {
              // Update the existing schedule if it matches the ID
              existingItem.schedule[existingScheduleIndex] = newSchedule;
            }
          });
        } else if (action.payload.schedule) {
          // If no schedules exist, directly assign the new schedule
          existingItem.schedule = action.payload.schedule;
        }
      } else {
        // Add new item to cart
        state.items.push(action.payload);
      }
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
