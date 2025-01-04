import React, { useState } from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { FontSize, Screen, Spacing } from '../utils/dimension';
import CustomText from './CustomText';
import { COLOR } from '../utils/globalConstants/color';

type ValidationRule = {
  pattern: RegExp; // Use regex patterns for validation
  message: string; // Error message for invalid input
};

type CustomInputProps = TextInputProps & {
  label?: string; 
  validationRules?: ValidationRule[]; 
  onValueChange?: (value: string) => void; 
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'decimal-pad' | 'ascii-capable'; 
  secureTextEntry?: boolean; 
};

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  validationRules = [],
  onValueChange,
  keyboardType = 'default',
  secureTextEntry = false,
  ...textInputProps
}) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Validate input based on regex patterns
  const validateInput = (input: string) => {
    for (const rule of validationRules) {
      if (!rule.pattern.test(input)) {
        setError(rule.message);
        return;
      }
    }
    setError(null);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    validateInput(value);
  };

  const handleChangeText = (text: string) => {
    setValue(text);
    if (onValueChange) {
      onValueChange(text);
    }
    validateInput(text);
  };

  return (
    <View style={styles.container}>
      <CustomText label={label} />
      <TextInput
        style={[
          styles.input,
          {
            borderColor: error ? COLOR.red : isFocused ? '#6200ee' : '#ccc',
          },
        ]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChangeText={handleChangeText}
        value={value}
        {...textInputProps}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.small,
  },
  input: {
    height: Screen.height / 15,
    borderWidth: 1,
    borderRadius: Spacing.small,
    paddingHorizontal: Spacing.small,
    fontSize: FontSize.medium,
  },
  errorText: {
    color: COLOR.red,
    fontSize: 12,
    marginTop: 5,
  },
});

export default CustomInput;
