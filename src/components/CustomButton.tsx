import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  GestureResponderEvent,
} from 'react-native';
import { FontSize, Spacing } from '../utils/dimension';
import { COLOR } from '../utils/globalConstants/color';

type CustomButtonProps = {
  label: string; // Button label
  onPress: (event: GestureResponderEvent) => void; // Callback for button press
  style?: ViewStyle; // Custom styles for the button container
  textStyle?: TextStyle; // Custom styles for the button label
  disabled?: boolean; // Disable the button
  animationType?: 'scale' | 'opacity'; // Type of animation on press
};

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onPress,
  style,
  textStyle,
  disabled = false,
  animationType = 'scale',
}) => {
  const [animationValue] = useState(new Animated.Value(1)); // Animation state

  // Handle button press animation
  const handlePressIn = () => {
    Animated.timing(animationValue, {
      toValue: animationType === 'scale' ? 0.95 : 0.5,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  // Combine animation styles
  const animatedStyle =
    animationType === 'scale'
      ? { transform: [{ scale: animationValue }] }
      : { opacity: animationValue };

  return (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      <TouchableOpacity
        style={[
          styles.button,
          disabled ? styles.disabledButton : styles.activeButton,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Text
          style={[
            styles.label,
            disabled ? styles.disabledLabel : styles.activeLabel,
            textStyle,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginVertical: Spacing.medium,
  },
  button: {
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.small,
    borderRadius: Spacing.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: COLOR.black,
  },
  disabledButton: {
    backgroundColor: COLOR.grey,
  },
  label: {
    fontSize: FontSize.medium,
    fontWeight: 'bold',
  },
  activeLabel: {
    color: COLOR.white,
  },
  disabledLabel: {
    color: COLOR.white,
  },
});

export default CustomButton;
