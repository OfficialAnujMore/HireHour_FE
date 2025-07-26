import React from 'react';
import CustomInput from '../components/CustomInput'; // adjust the import path based on your project structure
import {Errors} from 'interfaces'; // adjust based on the location of your types

type RenderInputProps = {
  value: string;
  placeholder: string;
  handleValueChange?: (field: string, value: string) => void;
  field?: string;
  errors?: Errors;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
  maxLength?: number;
  disabled?: boolean;
};

const renderInput = ({
  value,
  placeholder,
  field,
  errors,
  handleValueChange,
  keyboardType = 'default',
  secureTextEntry,
  maxLength,
  disabled = false,
}: RenderInputProps) => (
  <CustomInput
    label={placeholder}
    value={value}
    placeholder={placeholder}
    onValueChange={newValue => handleValueChange(field, newValue)}
    errorMessage={errors[field]??''}
    keyboardType={keyboardType}
    secureTextEntry={secureTextEntry}
    maxLength={maxLength}
    disabled={disabled}
  />
);

export default renderInput;
