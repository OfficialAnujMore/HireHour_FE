import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import {
  selectUser,
  selectIsAuthenticated,
  selectCartItems,
  selectCartItemCount,
  selectCartTotal,
  selectSnackbarVisible,
  selectSnackbarMessage,
  selectSnackbarSuccess,
  selectIsServiceProvider,
} from '../redux/selectors';
import { useCallback } from 'react';

// Auth hooks
export const useAuth = () => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isServiceProvider = useSelector(selectIsServiceProvider);

  return {
    user,
    isAuthenticated,
    isServiceProvider,
    isLoggedIn: !!isAuthenticated,
  };
};

// Cart hooks
export const useCart = () => {
  const items = useSelector(selectCartItems);
  const itemCount = useSelector(selectCartItemCount);
  const total = useSelector(selectCartTotal);

  return {
    items,
    itemCount,
    total,
    hasItems: itemCount > 0,
    isEmpty: itemCount === 0,
  };
};

// Snackbar hooks
export const useSnackbar = () => {
  const visible = useSelector(selectSnackbarVisible);
  const message = useSelector(selectSnackbarMessage);
  const success = useSelector(selectSnackbarSuccess);

  return {
    visible,
    message,
    success,
    isError: visible && !success,
    isSuccess: visible && success,
  };
};

// User profile hooks
export const useUserProfile = () => {
  const user = useSelector(selectUser);
  
  const fullName = useCallback(() => {
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`.trim();
  }, [user]);

  const initials = useCallback(() => {
    if (!user) return '';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  }, [user]);

  return {
    user,
    fullName: fullName(),
    initials: initials(),
    hasProfile: !!user?.profileImageURL,
    hasBanner: !!user?.bannerImageURL,
  };
};

// Service provider hooks
export const useServiceProvider = () => {
  const { isServiceProvider, user } = useAuth();
  
  return {
    isServiceProvider,
    canCreateServices: isServiceProvider,
    userId: user?.id,
  };
};

// Form validation hooks
export const useFormValidation = () => {
  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validatePassword = useCallback((password: string): boolean => {
    return password.length >= 6;
  }, []);

  const validatePhone = useCallback((phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }, []);

  const validateRequired = useCallback((value: string): boolean => {
    return value.trim().length > 0;
  }, []);

  return {
    validateEmail,
    validatePassword,
    validatePhone,
    validateRequired,
  };
};

// Date utility hooks
export const useDateUtils = () => {
  const isToday = useCallback((date: Date | string): boolean => {
    const today = new Date();
    const compareDate = new Date(date);
    return (
      today.getFullYear() === compareDate.getFullYear() &&
      today.getMonth() === compareDate.getMonth() &&
      today.getDate() === compareDate.getDate()
    );
  }, []);

  const isPast = useCallback((date: Date | string): boolean => {
    return new Date(date) < new Date();
  }, []);

  const isFuture = useCallback((date: Date | string): boolean => {
    return new Date(date) > new Date();
  }, []);

  const getDaysFromNow = useCallback((date: Date | string): number => {
    const today = new Date();
    const compareDate = new Date(date);
    const diffTime = compareDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, []);

  return {
    isToday,
    isPast,
    isFuture,
    getDaysFromNow,
  };
}; 