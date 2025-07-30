import {GestureResponderEvent} from 'react-native/types';

// Navigation Types
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
  'Service Details': {serviceId: string};
  'Edit Profile': undefined;
  'Create Service': undefined;
  'Create Schedule': undefined;
  'Transaction History': undefined;
  Cart: undefined;
  Settings: undefined;
  Enrollment: undefined;
  MyService: undefined;
  ViewService: ServiceDetails;
  BookedEvents: {type: 'Booked'};
  UpcomingEvents: {type: 'Upcoming'};
  PastEvents: {type: 'Past'};
  Reviews: undefined;
  Login: undefined;
  RegistrationScreen: undefined;
  VerifyOTP: RegisterUser;
  Tabs: {screen?: string};
  Home: undefined;
  ServiceDetails: {serviceId: string};
  EditProfile: undefined;
  ServiceReviews: undefined;
};

// Component Props
export interface CustomCardsProps {
  serviceId: string;
  avatarUri?: string;
  title: string;
  description: string;
  category: string;
  pricing: string;
  ratings: number;
  name: string;
  servicePreview: ServicePreview[];
  schedule: Schedule[];
  date?: string;
  month?: string;
  time?: string;
  handlePress?: () => void;
  handleRemoveService?: (serviceId: string) => void;
  handleRemoveScheduledDate?: (serviceId: string, scheduleId: string) => void;
  setApprovedSlot?: () => void;
  actionedSlots?: Set<string>;
  item?: CustomCardsProps;
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

// Data Models
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
  isApproved?: boolean;
  holdExpiresAt?: string | null;
}

export interface ScheduleItem extends Schedule {
  bookedUser?: User;
  services?: ServiceDetails;
}

// User and Auth
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
  avatarUri?: string;
  name?: string;
  profileImage?: string | null;
  token: string;
  fcmToken: string;
  refreshToken: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  email: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

// Service Related
export interface ServiceDetails {
  id?: string;
  title: string;
  description: string;
  pricing: string;
  userId: string;
  category: string;
  servicePreview: ServicePreview[];
  selectedDates: Schedule;
  services?: ServiceDetails[];
  date?: string;
  ratings?: number;
}

// Cart Related
export interface CartItem {
  id: string;
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
  ratings: number;
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
  selectedTimeslots: string[];
}

// UI State
export interface SnackbarState {
  message: string;
  success?: boolean;
  visible: boolean;
}

export interface Errors {
  email: string;
  password: string;
  [key: string]: string;
}

export interface MenuItemProps {
  label: string;
  icon: string;
  callback?: () => void;
}

// API Response
export interface ErrorResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Transaction Related
export interface TransactionItem {
  id: string;
  transactionId: string;
  serviceId: string;
  serviceTitle: string;
  servicePrice: string;
  serviceProviderId: string;
  venue: string;
  meetingUrl: string;
  address: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  paymentId: string;
  transactionType: string;
  paymentStatus: string;
  totalAmount: string;
  tax: string;
  serviceId: string;
  createdAt: string;
  updatedAt: string;
  transactionItems: TransactionItem[];
}

// Event Related
export interface EventItem {
  services: ServiceDetails & {user: User};
  date: string;
}

// Form Validation
export interface ValidationErrors {
  [key: string]: string;
}

// API Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber: string;
  password: string;
}

export interface ServiceRequest {
  title: string;
  description: string;
  pricing: string;
  userId: string;
  category: string;
  servicePreview: ServicePreview[];
  selectedDates: Record<string, {selected: boolean; isAvailable: boolean}>;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiState<T> {
  data: T | null;
  loading: LoadingState;
  error: string | null;
}
