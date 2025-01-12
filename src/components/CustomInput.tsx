import React, { useState } from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TextInputProps,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import { FontSize, Screen, Spacing } from '../utils/dimension';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the Icon component
import { COLORS } from '../utils/globalConstants/color';

type CustomInputProps = TextInputProps & {
  label?: string;
  errorMessage?: string; // Accept external error message
  onValueChange?: (value: string) => void;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'decimal-pad' | 'ascii-capable';
  secureTextEntry?: boolean;
  disabled?: boolean; // Add disabled prop
};

const formatPhoneNumber = (value: string) => {
  // Remove any non-digit characters
  const cleanedValue = value.replace(/\D/g, '');

  // Format the phone number as +1 XXX-XXX-XXXX or XXX-XXX-XXXX
  if (cleanedValue.length < 4) {
    return cleanedValue;
  }
  if (cleanedValue.length < 7) {
    return `(${cleanedValue.slice(0, 3)})-${cleanedValue.slice(3)}`;
  }
  return `(${cleanedValue.slice(0, 3)})-${cleanedValue.slice(3, 6)}-${cleanedValue.slice(6, 10)}`;
};

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  errorMessage, // Accept error message from parent
  onValueChange,
  keyboardType = 'default',
  secureTextEntry = false,
  disabled = false, // Default to false, allowing the field to be editable
  ...textInputProps
}) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry); // Toggle for password visibility

  const handleFocus = () => {
    if (!disabled) {
      setIsFocused(true);
    }
  };

  const handleBlur = () => {
    if (!disabled) {
      setIsFocused(false);
    }
  };

  const handleChangeText = (text: string) => {
    if (!disabled) {
      // Format phone number before updating the state
      const formattedText = keyboardType === 'phone-pad' ? formatPhoneNumber(text) : text;
      setValue(formattedText);
      if (onValueChange) {
        onValueChange(formattedText);
      }
    }
  };

  const togglePasswordVisibility = () => {
    if (!disabled) {
      setIsPasswordVisible(!isPasswordVisible);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss(); // Dismiss the keyboard when touching outside
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <CustomText label={label} />
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: errorMessage
                  ? COLORS.red
                  : isFocused
                  ? COLORS.black
                  : COLORS.grey,
                backgroundColor: disabled ? COLORS.lightGrey : COLORS.white, // Optional: Gray background when disabled
              },
            ]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleChangeText}
            value={value}
            keyboardType={keyboardType}
            secureTextEntry={!isPasswordVisible && secureTextEntry} // Toggle visibility for password
            editable={!disabled} // Disable editing when disabled prop is true
            {...textInputProps}
          />
          {secureTextEntry && !disabled && (
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
              <Icon
                name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.grey}
              />
            </TouchableOpacity>
          )}
        </View>
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.small,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    height: Screen.height / 15,
    borderWidth: 1,
    borderRadius: Spacing.small,
    paddingHorizontal: Spacing.small,
    fontSize: FontSize.medium,
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
    marginTop: 5,
  },
});

export default CustomInput;
