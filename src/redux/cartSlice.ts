import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { CartItem, CartState } from 'interfaces/reduxInterface';

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

    // Remove item from the cart based on serviceId
    removeFromCart: (state, action: PayloadAction<string>) => {
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

export const {addToCart, removeFromCart, clearCart} = cartSlice.actions;

export default cartSlice.reducer;
