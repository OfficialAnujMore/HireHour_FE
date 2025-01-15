import React, { useRef } from 'react';
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
import { COLORS } from '../utils/globalConstants/color';

type CustomButtonProps = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  animationType?: 'scale' | 'opacity';
};

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onPress,
  style,
  textStyle,
  disabled = false,
  animationType = 'scale',
}) => {
  const animationValue = useRef(new Animated.Value(1)).current;

  const handleAnimation = (toValue: number) => {
    Animated.timing(animationValue, {
      toValue,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressIn = () => handleAnimation(animationType === 'scale' ? 0.95 : 0.5);
  const handlePressOut = () => handleAnimation(1);

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
            textStyle,
            disabled ? styles.disabledLabel : styles.activeLabel,
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
    marginVertical: Spacing.medium,
  },
  button: {
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.small,
    borderRadius: Spacing.small,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.grey,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  activeButton: {
    backgroundColor: COLORS.white,
  },
  disabledButton: {
    backgroundColor: COLORS.grey,
  },
  label: {
    fontSize: FontSize.medium,
    fontWeight: 'bold',
  },
  activeLabel: {
    color: COLORS.black,
  },
  disabledLabel: {
    color: COLORS.black,
  },
});

export default CustomButton;
