/**
 * Lightweight utility functions to replace heavy dependencies
 * Reduces bundle size by using native JavaScript
 */

// Array utilities (replaces lodash array functions)
export const arrayUtils = {
  // Check if array is empty
  isEmpty: (arr: any[]): boolean => arr.length === 0,
  
  // Get first element
  first: <T>(arr: T[]): T | undefined => arr[0],
  
  // Get last element
  last: <T>(arr: T[]): T | undefined => arr[arr.length - 1],
  
  // Remove duplicates
  uniq: <T>(arr: T[]): T[] => [...new Set(arr)],
  
  // Find element by property
  find: <T>(arr: T[], predicate: (item: T) => boolean): T | undefined => 
    arr.find(predicate),
  
  // Filter array
  filter: <T>(arr: T[], predicate: (item: T) => boolean): T[] => 
    arr.filter(predicate),
  
  // Map array
  map: <T, U>(arr: T[], transform: (item: T) => U): U[] => 
    arr.map(transform),
  
  // Reduce array
  reduce: <T, U>(arr: T[], reducer: (acc: U, item: T) => U, initial: U): U => 
    arr.reduce(reducer, initial),
  
  // Chunk array into smaller arrays
  chunk: <T>(arr: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  },
  
  // Flatten nested arrays
  flatten: <T>(arr: T[][]): T[] => arr.flat(),
  
  // Sort array by property
  sortBy: <T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
    return [...arr].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (order === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
  },
};

// Object utilities (replaces lodash object functions)
export const objectUtils = {
  // Check if object is empty
  isEmpty: (obj: Record<string, any>): boolean => 
    Object.keys(obj).length === 0,
  
  // Get object keys
  keys: (obj: Record<string, any>): string[] => Object.keys(obj),
  
  // Get object values
  values: <T>(obj: Record<string, T>): T[] => Object.values(obj),
  
  // Get object entries
  entries: <T>(obj: Record<string, T>): [string, T][] => Object.entries(obj),
  
  // Pick specific properties
  pick: <T extends Record<string, any>, K extends keyof T>(
    obj: T, 
    keys: K[]
  ): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },
  
  // Omit specific properties
  omit: <T extends Record<string, any>, K extends keyof T>(
    obj: T, 
    keys: K[]
  ): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach(key => {
      delete result[key];
    });
    return result;
  },
  
  // Deep clone object
  cloneDeep: <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as T;
    if (obj instanceof Array) return obj.map(item => objectUtils.cloneDeep(item)) as T;
    if (typeof obj === 'object') {
      const clonedObj = {} as any;
      const objAny = obj as any;
      for (const key in objAny) {
        if (Object.prototype.hasOwnProperty.call(objAny, key)) {
          clonedObj[key] = objectUtils.cloneDeep(objAny[key]);
        }
      }
      return clonedObj as T;
    }
    return obj;
  },
  
  // Merge objects
  merge: <T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T => {
    const result = { ...target } as any;
    sources.forEach(source => {
      Object.keys(source).forEach(key => {
        const targetVal = result[key];
        const sourceVal = (source as any)[key];
        if (targetVal && typeof targetVal === 'object' && typeof sourceVal === 'object') {
          result[key] = objectUtils.merge(targetVal, sourceVal);
        } else {
          result[key] = sourceVal;
        }
      });
    });
    return result as T;
  },
};

// String utilities (replaces lodash string functions)
export const stringUtils = {
  // Capitalize first letter
  capitalize: (str: string): string => 
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(),
  
  // Convert to camelCase
  camelCase: (str: string): string => 
    str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : ''),
  
  // Convert to kebab-case
  kebabCase: (str: string): string => 
    str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
  
  // Convert to snake_case
  snakeCase: (str: string): string => 
    str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase(),
  
  // Truncate string
  truncate: (str: string, length: number, suffix: string = '...'): string => 
    str.length > length ? str.substring(0, length) + suffix : str,
  
  // Check if string is empty
  isEmpty: (str: string): boolean => str.trim().length === 0,
  
  // Generate random string
  random: (length: number = 8): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },
};

// Number utilities
export const numberUtils = {
  // Clamp number between min and max
  clamp: (num: number, min: number, max: number): number => 
    Math.min(Math.max(num, min), max),
  
  // Round to decimal places
  round: (num: number, decimals: number = 0): number => 
    Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals),
  
  // Format currency
  formatCurrency: (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  },
  
  // Generate random number
  random: (min: number, max: number): number => 
    Math.floor(Math.random() * (max - min + 1)) + min,
  
  // Check if number is between range
  isBetween: (num: number, min: number, max: number): boolean => 
    num >= min && num <= max,
};

// Date utilities (replaces moment.js)
export const dateUtils = {
  // Get current timestamp
  now: (): number => Date.now(),
  
  // Format date
  format: (date: Date | string, format: string = 'MM/DD/YYYY'): string => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  },
  
  // Add days to date
  addDays: (date: Date | string, days: number): Date => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  },
  
  // Add months to date
  addMonths: (date: Date | string, months: number): Date => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  },
  
  // Add years to date
  addYears: (date: Date | string, years: number): Date => {
    const d = new Date(date);
    d.setFullYear(d.getFullYear() + years);
    return d;
  },
  
  // Get difference between dates in days
  diffInDays: (date1: Date | string, date2: Date | string): number => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },
  
  // Check if date is today
  isToday: (date: Date | string): boolean => {
    const today = new Date();
    const d = new Date(date);
    return (
      today.getFullYear() === d.getFullYear() &&
      today.getMonth() === d.getMonth() &&
      today.getDate() === d.getDate()
    );
  },
  
  // Check if date is in the past
  isPast: (date: Date | string): boolean => new Date(date) < new Date(),
  
  // Check if date is in the future
  isFuture: (date: Date | string): boolean => new Date(date) > new Date(),
  
  // Get relative time (e.g., "2 hours ago")
  fromNow: (date: Date | string): string => {
    const now = new Date();
    const d = new Date(date);
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return dateUtils.format(d, 'MM/DD/YYYY');
  },
};

// Validation utilities
export const validationUtils = {
  // Email validation
  isEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  // Phone validation
  isPhone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  },
  
  // URL validation
  isUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  
  // Password strength validation
  isStrongPassword: (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  },
  
  // Required field validation
  isRequired: (value: any): boolean => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined;
  },
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}; 