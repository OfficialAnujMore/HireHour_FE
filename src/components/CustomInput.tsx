import React, { useState } from 'react';
import { TextInput, Text, View, StyleSheet, TextInputProps } from 'react-native';
import { FontSize, Screen, Spacing } from '../utils/dimension';
import CustomText from './CustomText';
import { COLOR } from '../utils/globalConstants/color';

type CustomInputProps = TextInputProps & {
  label?: string; 
  errorMessage?: string;  // Accept external error message
  onValueChange?: (value: string) => void; 
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'decimal-pad' | 'ascii-capable'; 
  secureTextEntry?: boolean; 
};

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  errorMessage, // Accept error message from parent
  onValueChange,
  keyboardType = 'default',
  secureTextEntry = false,
  ...textInputProps
}) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChangeText = (text: string) => {
    setValue(text);
    if (onValueChange) {
      onValueChange(text);
    }
  };

  return (
    <View style={styles.container}>
      <CustomText label={label} />
      <TextInput
        style={[
          styles.input,
          {
            borderColor: errorMessage ? COLOR.red : isFocused ? COLOR.black : COLOR.grey,
          },
        ]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChangeText={handleChangeText}
        value={value}
        {...textInputProps}
      />
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
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
