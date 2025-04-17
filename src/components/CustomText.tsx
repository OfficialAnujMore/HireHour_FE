import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextStyle,
  StyleProp,
} from 'react-native';
import {FontSize, Screen, Spacing} from '../utils/dimension';
import {COLORS} from '../utils/globalConstants/color';

type CustomTextProps = {
  label: React.ReactNode;
  style?: StyleProp<TextStyle>;
  action?: () => void; // Optional action handler
  numberOfLines?: number
};

const CustomText: React.FC<CustomTextProps> = ({
  label,
  style,
  action,
  numberOfLines = 1,
}) => (
  <View style={styles.container}>
    {action ? (
      <TouchableOpacity onPress={action} style={styles.touchable}>
        <Text
          style={[styles.textStyle, styles.clickableText, style]}
          numberOfLines={numberOfLines} // Add numberOfLines for ellipsis
          ellipsizeMode="tail" // Ensures ellipsis at the end of the text
        >
          {label}
        </Text>
      </TouchableOpacity>
    ) : (
      <Text
        style={[styles.textStyle, style]}
        numberOfLines={numberOfLines} // Add numberOfLines for ellipsis
        ellipsizeMode="tail" // Ensures ellipsis at the end of the text
      >
        {label}
      </Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.small / 2,
    alignItems: 'flex-start', // Align the text at the start of the container
  },
  touchable: {
    alignItems: 'center', // Keeps the clickable text centered
  },
  textStyle: {
    fontSize: FontSize.medium,
    padding: 0,
    margin: 0,
    textAlign: 'left', // Align text to the left
    overflow: 'hidden', // Hide overflow text
  },
  clickableText: {
    textDecorationLine: 'underline',
    color: COLORS.gray,
  },
});

export default CustomText;
