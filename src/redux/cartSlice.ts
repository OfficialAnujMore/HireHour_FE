import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface ServicePreview {
  id: string;
  imageUri: string;
  servicesId: string;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface Schedule {
  id: string;
  day: string;
  month: string;
  date: string;
  fullDate: string;
  servicesId: string;
  timeSlots: TimeSlot[];
}

interface CartItem {
  userId: string;
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  isServiceProvider: boolean;
  avatarUri: string;
  serviceId: string;
  title: string;
  description: string;
  chargesPerHour: string;
  ratings: string;
  category: string;
  deletedAt: string | null;
  isDisabled: boolean;
  createdAt: string;
  updatedAt: string;
  servicePreview: ServicePreview[];
  schedule: Schedule[];
}

interface CartState {
  items: CartItem[];
  selectedTimeslots: String[];
}

const initialState: CartState = {
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
