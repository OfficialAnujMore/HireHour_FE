import { Dimensions } from 'react-native';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Define scale factors (optional, for scaling purposes)
const scale = width / 375; // 375 is the width of iPhone 6 (baseline)
const verticalScale = height / 667; // 667 is the height of iPhone 6 (baseline)
const moderateScale = (size: number) => size * scale;

// Export screen dimensions and scale functions
export const Screen = {
  width,
  height,
  scale,
  verticalScale,
  moderateScale,
};

// Common dimensions like padding and margin can also be added here
export const Spacing = {
  small: moderateScale(8),  // Scales with screen width
  medium: moderateScale(16),
  large: moderateScale(24),
  extraLarge: moderateScale(32),
};

// Font size scaling (optional)
export const FontSize = {
  small: moderateScale(12),
  medium: moderateScale(16),
  large: moderateScale(20),
  extraLarge: moderateScale(24),
};

// You can add other values like button sizes, container paddings, etc.
export const Button = {
  height: moderateScale(50),
  width: moderateScale(250),
};
