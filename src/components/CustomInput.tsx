import React, { useCallback, useState } from 'react';
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
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../utils/globalConstants/color';

type CustomInputProps = TextInputProps & {
  label?: string;
  errorMessage?: string;
  value: string;
  onValueChange: (value: string) => void;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'decimal-pad'
    | 'ascii-capable';
  secureTextEntry?: boolean;
  disabled?: boolean;
  maxLength?: number;
};

const formatPhoneNumber = (value: string) => {
  const cleanedValue = value.replace(/\D/g, '');
  if (cleanedValue.length < 4) {
    return cleanedValue;
  }
  if (cleanedValue.length < 7) {
    return `(${cleanedValue.slice(0, 3)})-${cleanedValue.slice(3)}`;
  }
  return `(${cleanedValue.slice(0, 3)})-${cleanedValue.slice(
    3,
    6
  )}-${cleanedValue.slice(6, 10)}`;
};

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  errorMessage,
  value,
  onValueChange,
  keyboardType = 'default',
  secureTextEntry = false,
  disabled = false,
  maxLength,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const handleFocus = useCallback(() => {
    if (!disabled) setIsFocused(true);
  }, [disabled]);

  const handleBlur = useCallback(() => {
    if (!disabled) setIsFocused(false);
  }, [disabled]);

  const handleChangeText = useCallback(
    (text: string) => {
      if (!disabled) {
        let formattedText =
          keyboardType === 'phone-pad' ? formatPhoneNumber(text) : text;
        if (maxLength !== undefined) {
          formattedText = formattedText.slice(0, maxLength);
        }
        onValueChange(formattedText);
      }
    },
    [disabled, keyboardType, maxLength, onValueChange]
  );

  const togglePasswordVisibility = useCallback(() => {
    if (!disabled) setIsPasswordVisible((prev) => !prev);
  }, [disabled]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        {label && <CustomText label={label} />}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: errorMessage
                  ? COLORS.error
                  : isFocused
                  ? COLORS.black
                  : COLORS.gray,
                backgroundColor: disabled ? COLORS.lightGrey : COLORS.white,
              },
            ]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleChangeText}
            value={value}
            keyboardType={keyboardType}
            secureTextEntry={!isPasswordVisible && secureTextEntry}
            editable={!disabled}
            maxLength={maxLength}
            multiline={true} // Enables multi-line text wrapping
            // textAlignVertical="top" 
            {...textInputProps}
          />
          {secureTextEntry && !disabled && (
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.iconContainer}
            >
              <Icon
                name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.gray}
              />
            </TouchableOpacity>
          )}
        </View>
        {maxLength !== undefined && (
          <Text style={styles.charCount}>{`${value.length}/${maxLength}`}</Text>
        )}
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
  charCount: {
    alignSelf: 'flex-end',
    color: COLORS.gray,
    fontSize: FontSize.small,
    marginTop: 5,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 5,
  },
});

export default CustomInput;
