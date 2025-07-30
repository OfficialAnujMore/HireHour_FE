// API Constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_OTP: '/auth/verify-otp',
    LOGOUT: '/auth/logout',
  },
  USER: {
    UPDATE_PROFILE: '/user/update-profile',
    UPDATE_ROLE: '/user/update-role',
    UPSERT_FCM_TOKEN: '/user/upsert-fcm-token',
  },
  SERVICE: {
    GET_PROVIDERS: '/services/providers',
    CREATE: '/services/create',
    UPDATE: '/services/update',
    DELETE: '/services/delete',
    MY_SERVICES: '/services/my-services',
    UPCOMING_EVENTS: '/services/upcoming-events',
    BOOKED_SERVICES: '/services/booked-services',
    SLOT_APPROVAL: '/services/slot-approval',
  },
  CART: {
    ADD: '/cart/add',
    REMOVE: '/cart/remove',
    GET: '/cart/get',
    CLEAR: '/cart/clear',
  },
  TRANSACTION: {
    GET_ALL: '/transactions',
    GET_BY_ID: '/transactions/:id',
    CREATE: '/transactions/create',
  },
} as const;

// App Constants
export const APP_CONSTANTS = {
  APP_NAME: 'HireHour',
  VERSION: '1.0.0',
  BUILD_NUMBER: '1',
} as const;

// UI Constants
export const UI_CONSTANTS = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  REFRESH_INTERVAL: 30000, // 30 seconds
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  MAX_RETRY_ATTEMPTS: 3,
  REQUEST_TIMEOUT: 10000, // 10 seconds
} as const;

// Validation Constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 100,
  NAME_MAX_LENGTH: 50,
  PHONE_MAX_LENGTH: 20,
  DESCRIPTION_MAX_LENGTH: 500,
  TITLE_MAX_LENGTH: 100,
  PRICE_MIN: 0,
  PRICE_MAX: 999999,
} as const;

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;

// Schedule Constants
export const SCHEDULE = {
  MAX_SCHEDULE_DISPLAY: 3,
  MAX_SCHEDULES_PER_SERVICE: 10,
  MIN_BOOKING_NOTICE_HOURS: 24,
  MAX_BOOKING_DAYS_AHEAD: 365,
} as const;

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_IMAGES_PER_SERVICE: 5,
  IMAGE_QUALITY: 0.8,
} as const;

// Notification Constants
export const NOTIFICATION = {
  CHANNEL_ID: 'default-channel',
  CHANNEL_NAME: 'Default Channel',
  CHANNEL_DESCRIPTION: 'A default channel for notifications',
  SOUND_NAME: 'default',
  IMPORTANCE: 4,
  VIBRATE: true,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  AUTH_ERROR: 'Authentication failed. Please login again.',
  PERMISSION_ERROR: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  SERVICE_CREATED: 'Service created successfully!',
  SERVICE_UPDATED: 'Service updated successfully!',
  SERVICE_DELETED: 'Service deleted successfully!',
  CART_ITEM_ADDED: 'Item added to cart!',
  CART_ITEM_REMOVED: 'Item removed from cart!',
  BOOKING_SUCCESS: 'Booking successful!',
  PAYMENT_SUCCESS: 'Payment successful!',
} as const;

// User Roles
export const USER_ROLES = {
  USER: 'user',
  SERVICE_PROVIDER: 'service_provider',
  ADMIN: 'admin',
} as const;

// Service Categories
export const SERVICE_CATEGORIES = {
  PHOTOGRAPHY: 'Photography',
  GUITAR: 'Guitar',
  ART: 'Art',
  MUSIC: 'Music',
  SPORTS: 'Sports',
  DANCE: 'Dance',
  COOKING: 'Cooking',
  FITNESS: 'Fitness',
  EDUCATION: 'Education',
  OTHER: 'Other',
} as const;

// Legacy CATEGORY export for backward compatibility
export const CATEGORY = SERVICE_CATEGORIES;

// Field character limits
export const MAX_FIELD_CHAR_COUNT = {
  TITLE: 100,
  DESCRIPTION: 500,
  NAME: 50,
  EMAIL: 100,
  PHONE: 20,
  ADDRESS: 200,
  CITY: 50,
  STATE: 50,
  POSTAL_CODE: 10,
  COUNTRY: 50,
  serviceTitle: 100,
  serviceDescription: 500,
  postalCode: 10,
  URL: 200,
} as const;

// US States
export const US_STATES = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
} as const;

// Venue types
export const VENUE = {
  ONLINE: 'Online',
  IN_PERSON: 'In Person',
  HYBRID: 'Hybrid',
} as const;

// This constant is now defined in SCHEDULE object above
// export const MAX_SCHEDULE_DISPLAY = 3;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

// Transaction Types
export const TRANSACTION_TYPES = {
  BOOKING: 'booking',
  REFUND: 'refund',
  WITHDRAWAL: 'withdrawal',
} as const;

// Event Types
export const EVENT_TYPES = {
  UPCOMING: 'upcoming',
  PAST: 'past',
  BOOKED: 'booked',
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MM/DD/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'MM/DD/YYYY HH:mm',
  TIME: 'HH:mm',
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  CART_DATA: 'cartData',
  SETTINGS: 'settings',
  FCM_TOKEN: 'fcmToken',
} as const;

// Theme Colors - Use COLORS from globalConstants/color.js instead
// import { COLORS } from './globalConstants/color';

// Screen Names (for navigation)
export const SCREEN_NAMES = {
  SPLASH: 'Splash',
  LOGIN: 'Login',
  REGISTER: 'RegistrationScreen',
  VERIFY_OTP: 'VerifyOTP',
  HOME: 'Home',
  SERVICE_DETAILS: 'Service Details',
  CREATE_SERVICE: 'Create Service',
  CREATE_SCHEDULE: 'Create Schedule',
  CART: 'Cart',
  PROFILE: 'Profile',
  EDIT_PROFILE: 'Edit Profile',
  SETTINGS: 'Settings',
  TRANSACTION_HISTORY: 'Transaction History',
  UPCOMING_EVENTS: 'UpcomingEvents',
  BOOKED_EVENTS: 'BookedEvents',
  PAST_EVENTS: 'PastEvents',
  ENROLLMENT: 'Enrollment',
  MY_SERVICES: 'MyService',
  VIEW_SERVICE: 'ViewService',
  REVIEWS: 'Reviews',
  TABS: 'Tabs',
} as const;
