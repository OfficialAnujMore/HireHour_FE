import React from 'react';
import CustomInput from '../components/CustomInput'; // adjust the import path based on your project structure
import {Errors} from 'interfaces'; // adjust based on the location of your types

type RenderInputProps = {
  label: string;
  value: string;
  placeholder: string;
  field: string;
  errors: Errors;
  handleValueChange: (field: string, value: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
};

const renderInput = ({
  label,
  value,
  placeholder,
  field,
  errors,
  handleValueChange,
  keyboardType = 'default',
  secureTextEntry,
}: RenderInputProps) => (
  <CustomInput
    label={label}
    value={value}
    placeholder={placeholder}
    onValueChange={(newValue) => handleValueChange(field, newValue)}
    errorMessage={errors[field]}
    keyboardType={keyboardType}
    secureTextEntry={secureTextEntry}
  />
);

export default renderInput;
