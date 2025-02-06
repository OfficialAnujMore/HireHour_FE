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

import {GestureResponderEvent} from 'react-native/types';

export interface CustomCardsProps {
  item: {
    avatarUri?: string;
    title: string;
    description: string;
    category: string;
    chargesPerHour: string;
    ratings: number;
  };
  handlePress: () => {};
}

export interface CarouselItem {
  imageUri: string;
}

export interface CustomCarouselProps {
  data: CarouselItem[];
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface DateInfo {
  id: string;
  day: string;
  month: string;
  date: string;
  fullDate: string;
  timeSlots: TimeSlot[];
}

export interface CustomScheduleProps {
  dateInfo: DateInfo[];
  selectedTimeIds: string[]; // Changed to an array
  onValueChange: (value: string[]) => void; // Updated to accept an array
}

export interface CustomTabBarButtonProps {
  onPress?: (event: GestureResponderEvent) => void;
}

export interface ServicePreview {
  id: string;
  imageUri: string;
  servicesId: string;
}

export interface Schedule {
  id: string;
  day: string;
  month: string;
  date: string;
  fullDate: string;
  servicesId: string;
  timeSlots: TimeSlot[];
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
export interface CartState {
  items: CartItem[];
  selectedTimeslots: String[];
}

export interface SnackbarState {
  message: string;
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
  id: string;
  title: string;
  description: string;
  location: string;
  status: string;
  offer: string | null;
  rating: number;
  time: string;
  distance: string;
  image: string;
  previewImages: [];
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

