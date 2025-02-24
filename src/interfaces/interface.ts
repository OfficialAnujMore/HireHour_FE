import {GestureResponderEvent} from 'react-native/types';
export interface OTPStatus {
  otpStatus: boolean;
}
export interface RegisterUser {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber: string;
  password: string;
}
export type RootStackParamList = {
  RegisterUser: RegisterUser;
};

export interface CustomCardsProps {
  item: {
    avatarUri?: string;
    title: string;
    description: string;
    category: string;
    pricing: string;
    ratings: number;
  };
  handlePress: () => {};
}

export interface CarouselItem {
  uri: string;
}

export interface CustomCarouselProps {
  data: CarouselItem[];
}

export interface CustomTabBarButtonProps {
  onPress?: (event: GestureResponderEvent) => void;
}

export interface ServicePreview {
  id: string;
  uri: string;
  servicesId: string;
}

export interface Schedule {
  id: string;
  date: string;
  isAvailable: boolean;
  servicesId?: string;
  bookedUserId?: string;
}

export interface CartItem {
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
  pricing: string;
  ratings: string;
  category: string;
  deletedAt: string | null;
  isDisabled: boolean;
  createdAt: string;
  updatedAt: string;
  servicePreview: ServicePreview[];
  schedule: Schedule[];
}
export interface CartState {
  items: CartItem[];
  selectedTimeslots: String[];
}

export interface SnackbarState {
  message: string;
  success?: boolean;
  visible: boolean;
}
// Auth State Interface
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  countryCode: string;
  phoneNumber: string;
  isServiceProvider: string;
  profileImageURL: string;
  bannerImageURL: string;
  token: string;
  refreshToken: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceDetails {
  title: string;
  description: string;
  pricing: string;
  userId: string;
  category: string;
  servicePreview: ServicePreview[];
  selectedDates: Schedule;
}

export interface AuthUser {
  email: string;
  password: string;
}

export interface Errors {
  email: string;
  password: string;
}

export interface MenuItemProps {
  label: string;
  icon: string;
  callback?: () => void;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  data?: any;
}
