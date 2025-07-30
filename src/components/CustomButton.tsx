import React, {useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  GestureResponderEvent,
} from 'react-native';
import {FontSize, Spacing} from '../utils/dimension';
import {COLORS} from '../utils/globalConstants/color';
import Icon from 'react-native-vector-icons/Ionicons';
import {useLoader} from '../hooks/useLoader';
import {hasOngoingRequests} from '../utils/apiWithLoader';

type CustomButtonProps = {
  label?: string;
  onPress: (event: GestureResponderEvent) => void | Promise<void>;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  animationType?: 'scale' | 'opacity';
  icon?: string;
  showLoader?: boolean;
  loaderMessage?: string;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onPress,
  style,
  textStyle,
  disabled = false,
  animationType = 'scale',
  icon,
  showLoader = false,
  loaderMessage,
}) => {
  const {startLoading, stopLoading, isLoading} = useLoader();
  
  // Disable button if loader is active or if there are ongoing requests
  const isDisabled = disabled || isLoading || hasOngoingRequests();
  const animationValue = useRef(new Animated.Value(1)).current;

  const handleAnimation = (toValue: number) => {
    Animated.timing(animationValue, {
      toValue,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressIn = () =>
    handleAnimation(animationType === 'scale' ? 0.95 : 0.5);
  const handlePressOut = () => handleAnimation(1);

  const handlePress = async (event: GestureResponderEvent) => {
    // Prevent multiple clicks when loader is active
    if (isDisabled) return;
    
    if (showLoader) {
      startLoading(loaderMessage || 'Processing...');
    }
    
    try {
      await onPress(event);
    } finally {
      if (showLoader) {
        stopLoading();
      }
    }
  };

  const animatedStyle =
    animationType === 'scale'
      ? {transform: [{scale: animationValue}]}
      : {opacity: animationValue};

  return (
    <TouchableOpacity
      style={[
        style,
        styles.button,
        isDisabled ? styles.disabledButton : styles.activeButton,
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.7}
      disabled={isDisabled}>
      {icon && (
        <Icon name={icon} size={FontSize.extraLarge} color={COLORS.white} />
      )}
      {label && (
        <Text
          style={[
            styles.label,
            textStyle,
            isDisabled ? styles.disabledLabel : styles.activeLabel,
          ]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.medium - 4,
    borderRadius: Spacing.small,
    borderWidth: 0.5,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginVertical: Spacing.medium,
    backgroundColor: COLORS.primary,
  },
  activeButton: {
    backgroundColor: COLORS.primary,
  },
  disabledButton: {
    backgroundColor: COLORS.gray,
  },
  label: {
    fontSize: FontSize.medium,
    fontWeight: 600,
  },
  activeLabel: {
    color: COLORS.white,
  },
  disabledLabel: {
    color: COLORS.white,
  },
});

export default CustomButton;
