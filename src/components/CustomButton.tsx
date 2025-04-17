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

  const handlePressIn = () =>
    handleAnimation(animationType === 'scale' ? 0.95 : 0.5);
  const handlePressOut = () => handleAnimation(1);

  const animatedStyle =
    animationType === 'scale'
      ? {transform: [{scale: animationValue}]}
      : {opacity: animationValue};

  return (
    <TouchableOpacity
      style={[
        style,
        styles.button,
        disabled ? styles.disabledButton : styles.activeButton,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.7}
      disabled={disabled}>
      <Text
        style={[
          styles.label,
          textStyle,
          disabled ? styles.disabledLabel : styles.activeLabel,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.medium - 4,
    borderRadius: Spacing.small,
    borderWidth: 0.5,
    borderColor:COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginVertical:Spacing.medium,
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
