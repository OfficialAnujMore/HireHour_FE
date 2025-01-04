import React, { useState, useRef } from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Screen } from '../utils/dimension';
import CustomText from './CustomText';
import { COLOR } from '../utils/globalConstants/color';

type ValidationRule = {
  rule: (value: string) => boolean; 
  message: string;
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

  // Throttle function to limit the frequency of validation
  const throttle = (func: (...args: any[]) => void, delay: number) => {
    let lastCall = 0;
    return (...args: any[]) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  };

  // Handle focus animation
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Handle blur animation
  const handleBlur = () => {
    setIsFocused(false);
    throttledValidateInput(value);
  };

  // Validate input based on rules
  const validateInput = (input: string) => {
    for (const rule of validationRules) {
      if (!rule.rule(input)) {
        setError(rule.message);
        return;
      }
    }
    setError(null);
  };

  // Throttle the validation calls
  const throttledValidateInput = throttle(validateInput, 1000);

  // Handle input change
  const handleChangeText = (text: string) => {
    setValue(text);
    if (onValueChange) {
      onValueChange(text);
    }
    throttledValidateInput(text);
  };

  return (
    <View style={styles.container}>
      <CustomText label={label}/>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: error ? 'red' : isFocused ? '#6200ee' : '#ccc',
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
    backgroundColor:'red'
  },
  input: {
    height: Screen.height /20,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: COLOR.white,
  },
  errorText: {
    color: COLOR.red,
    fontSize: 12,
    marginTop: 5,
  },
});

export default CustomInput;
