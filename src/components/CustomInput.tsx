import React, { useState, useRef } from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  Animated,
  TextInputProps,
} from 'react-native';

type ValidationRule = {
  rule: (value: string) => boolean; // Validation function
  message: string; // Error message
};

type CustomInputProps = TextInputProps & {
  label?: string; // Label for the input field
  validationRules?: ValidationRule[]; // Array of validation rules
  onValueChange?: (value: string) => void; // Callback when input value changes
};

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  validationRules = [],
  onValueChange,
  ...textInputProps
}) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const animatedLabelPosition = useRef(new Animated.Value(0)).current;

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
    Animated.timing(animatedLabelPosition, {
      toValue: -30,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // Handle blur animation
  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(animatedLabelPosition, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
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
  const throttledValidateInput = throttle(validateInput, 500);

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
      {label && (
        <Animated.Text
          style={[
            styles.label,
            {
              transform: [{ translateY: animatedLabelPosition }],
              color: isFocused ? '#6200ee' : '#aaa',
            },
          ]}
        >
          {label}
        </Animated.Text>
      )}
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
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  label: {
    position: 'absolute',
    left: 12,
    top: 15,
    fontSize: 14,
    backgroundColor: '#fff',
    paddingHorizontal: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default CustomInput;
