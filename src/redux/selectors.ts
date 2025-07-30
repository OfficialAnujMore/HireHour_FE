import {createSelector} from '@reduxjs/toolkit';
import {RootState} from './store';

// Base selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectCart = (state: RootState) => state.cart;
export const selectSnackbar = (state: RootState) => state.snackbar;

// Auth selectors
export const selectUser = createSelector([selectAuth], auth => auth.user);

export const selectIsAuthenticated = createSelector(
  [selectAuth],
  auth => auth.isAuthenticated,
);

export const selectToken = createSelector([selectAuth], auth => auth.token);

export const selectIsServiceProvider = createSelector(
  [selectUser],
  user => user?.isServiceProvider === 'true',
);

// Cart selectors
export const selectCartItems = createSelector([selectCart], cart => cart.items);

export const selectCartItemCount = createSelector(
  [selectCartItems],
  items => items.length,
);

export const selectCartTotal = createSelector([selectCartItems], items =>
  items.reduce((total, item) => total + parseFloat(item.pricing), 0),
);

export const selectSelectedTimeslots = createSelector(
  [selectCart],
  cart => cart.selectedTimeslots,
);

// Snackbar selectors
export const selectSnackbarMessage = createSelector(
  [selectSnackbar],
  snackbar => snackbar.message,
);

export const selectSnackbarVisible = createSelector(
  [selectSnackbar],
  snackbar => snackbar.visible,
);

export const selectSnackbarSuccess = createSelector(
  [selectSnackbar],
  snackbar => snackbar.success,
);

// Combined selectors
export const selectUserProfile = createSelector([selectUser], user => ({
  id: user?.id,
  firstName: user?.firstName,
  lastName: user?.lastName,
  email: user?.email,
  username: user?.username,
  phoneNumber: user?.phoneNumber,
  isServiceProvider: user?.isServiceProvider === 'true',
  profileImageURL: user?.profileImageURL,
  bannerImageURL: user?.bannerImageURL,
}));

export const selectCartSummary = createSelector(
  [selectCartItems, selectCartTotal],
  (items, total) => ({
    itemCount: items.length,
    total: total.toFixed(2),
    hasItems: items.length > 0,
  }),
);
