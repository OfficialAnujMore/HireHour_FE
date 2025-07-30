import { ApiResponse } from './apiClient';
import {
  User,
  ServiceDetails,
  CartItem,
  Transaction,
  LoginRequest,
  RegisterRequest,
  ServiceRequest,
  ErrorResponse,
} from '../interfaces/interface';

// API Response Types
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

export interface ServiceListResponse {
  services: ServiceDetails[];
  total: number;
  page: number;
  limit: number;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
}

export interface FCMTokenResponse {
  success: boolean;
  message: string;
}

// API Request Types
export interface GetServicesParams {
  userId?: string;
  categories?: string[];
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetUpcomingEventsParams {
  userId: string;
  type?: 'upcoming' | 'past' | 'all';
}

export interface GetTransactionsParams {
  userId: string;
  page?: number;
  limit?: number;
  status?: string;
}

export interface UpsertFCMTokenParams {
  userId: string;
  fcmToken: string;
}

export interface AddToCartParams {
  serviceId: string;
  userId: string;
  scheduleId: string;
}

export interface RemoveFromCartParams {
  serviceId: string;
  userId: string;
}

export interface UpdateSlotApprovalParams {
  scheduleId: string;
  isApproved: boolean;
  serviceProviderId: string;
}

// Service Function Types
export type AuthService = {
  login: (data: LoginRequest) => Promise<ApiResponse<LoginResponse> | ErrorResponse>;
  register: (data: RegisterRequest) => Promise<ApiResponse<RegisterResponse> | ErrorResponse>;
  verifyOTP: (otp: string, email: string) => Promise<ApiResponse<LoginResponse> | ErrorResponse>;
  logout: () => Promise<ApiResponse<void> | ErrorResponse>;
};

export type UserService = {
  updateProfile: (userId: string, data: Partial<User>) => Promise<ApiResponse<User> | ErrorResponse>;
  updateRole: (userId: string, role: string) => Promise<ApiResponse<User> | ErrorResponse>;
  upsertFCMToken: (params: UpsertFCMTokenParams) => Promise<ApiResponse<User> | ErrorResponse>;
};

export type ServiceProviderService = {
  getServiceProviders: (userId?: string, categories?: string[]) => Promise<ApiResponse<ServiceDetails[]> | ErrorResponse>;
  createService: (data: ServiceRequest) => Promise<ApiResponse<ServiceDetails> | ErrorResponse>;
  updateService: (serviceId: string, data: Partial<ServiceRequest>) => Promise<ApiResponse<ServiceDetails> | ErrorResponse>;
  deleteService: (serviceId: string) => Promise<ApiResponse<void> | ErrorResponse>;
  getMyServices: (userId: string) => Promise<ApiResponse<ServiceDetails[]> | ErrorResponse>;
  getUpcomingEvents: (params: GetUpcomingEventsParams) => Promise<ApiResponse<ServiceDetails[]> | ErrorResponse>;
  getMyBookedServices: (userId: string, type: string) => Promise<ApiResponse<any[]> | ErrorResponse>;
  handleSlotApproval: (params: UpdateSlotApprovalParams) => Promise<ApiResponse<void> | ErrorResponse>;
};

export type CartService = {
  addToCart: (params: AddToCartParams) => Promise<ApiResponse<CartResponse> | ErrorResponse>;
  removeFromCart: (params: RemoveFromCartParams) => Promise<ApiResponse<CartResponse> | ErrorResponse>;
  getCart: (userId: string) => Promise<ApiResponse<CartResponse> | ErrorResponse>;
  clearCart: (userId: string) => Promise<ApiResponse<void> | ErrorResponse>;
};

export type TransactionService = {
  getTransactions: (params: GetTransactionsParams) => Promise<ApiResponse<TransactionListResponse> | ErrorResponse>;
  getTransactionById: (transactionId: string) => Promise<ApiResponse<Transaction> | ErrorResponse>;
  createTransaction: (data: any) => Promise<ApiResponse<Transaction> | ErrorResponse>;
};

// Error Types
export interface ApiError {
  type: 'api';
  code: string;
  message: string;
  details?: any;
}

export interface NetworkError {
  type: 'network';
  message: string;
}

export interface ValidationError {
  type: 'validation';
  field: string;
  message: string;
}

export interface AuthError {
  type: 'auth';
  message: string;
  code?: string;
}

export type AppError = ApiError | NetworkError | ValidationError | AuthError;

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error: AppError | null;
  data: any | null;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// Form States
export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
}

// Filter States
export interface FilterState {
  search: string;
  category: string;
  dateRange: {
    start: string;
    end: string;
  };
  priceRange: {
    min: number;
    max: number;
  };
  status: string;
} 