import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import {COLORS} from '../utils/globalConstants/color'; // Adjust the path if needed
import {Screen, Spacing} from '../utils/dimension'; // Adjust the path if needed

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({value, onValueChange}) => {
  const [animatedValue] = useState(new Animated.Value(value ? 20 : 0)); // Initial position based on value

  // Animate the thumb position when the value changes
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 20 : 0,
      duration: 300, // Duration of the animation (in milliseconds)
      useNativeDriver: true,
    }).start();
  }, [value]);

  return (
    <TouchableOpacity
      style={[
        styles.switchContainer,
        {backgroundColor: value ? COLORS.primary : COLORS.lightGrey},
      ]}
      onPress={() => onValueChange(!value)} // Toggle the value on press
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            transform: [{translateX: animatedValue}], // Animate the thumb based on the value
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: Screen.width * 0.15,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center', // Align the thumb horizontally inside the switch container
    flexDirection: 'row',
    backgroundColor: COLORS.lightGrey,
    padding: Spacing.small + 2,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10, // To make the thumb round
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.grey, // Border color of the thumb
  },
});

export default CustomSwitch;
