import React, {useState, useCallback, useMemo} from 'react';
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
import {FontSize, Screen, Spacing} from '../utils/dimension';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../utils/globalConstants/color';

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
  if (cleanedValue.length < 4) return cleanedValue;
  if (cleanedValue.length < 7)
    return `(${cleanedValue.slice(0, 3)})-${cleanedValue.slice(3)}`;
  return `(${cleanedValue.slice(0, 3)})-${cleanedValue.slice(
    3,
    6,
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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = useCallback(() => {
    if (!disabled) setIsFocused(true);
  }, [disabled]);

  const handleBlur = useCallback(() => {
    if (!disabled) setIsFocused(false);
  }, [disabled]);

  const handleChangeText = useMemo(
    () => (text: string) => {
      if (disabled) return;

      let formattedText =
        keyboardType === 'phone-pad' ? formatPhoneNumber(text) : text;
      if (maxLength) formattedText = formattedText.slice(0, maxLength);
      onValueChange(formattedText);
    },
    [disabled, keyboardType, maxLength, onValueChange],
  );

  const dismissKeyboard = () => Keyboard.dismiss();

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
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
            value={value || ''}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry && !isPasswordVisible} // Fix for toggling secureTextEntry
            editable={!disabled}
            maxLength={maxLength}
            multiline={true}
            {...textInputProps}
          />
          {secureTextEntry && !disabled && (
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(prev => !prev)}
              style={styles.iconContainer}>
              <Icon
                name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.gray}
              />
            </TouchableOpacity>
          )}
        </View>
        <View
          style={[
            styles.bottomContainer,
            errorMessage
              ? {justifyContent: 'space-between'}
              : {justifyContent: 'flex-end'},
          ]}>
          {errorMessage && (
            <CustomText label={errorMessage} style={styles.errorText} />
          )}
          {maxLength && (
            <CustomText
              label={`${value.length}/${maxLength}`}
              style={styles.charCount}
            />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginBottom: Spacing.small,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  charCount: {
    color: COLORS.gray,
    fontSize: FontSize.small,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
  },
});

export default CustomInput;
