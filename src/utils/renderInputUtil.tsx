import React from 'react';
import CustomInput from '../components/CustomInput';
import {Errors} from 'interfaces';

type RenderInputProps = {
  label?: string; // TODO: Update lable to be mandatory label
  value: string;
  placeholder: string;
  handleValueChange?: (field: string, value: string) => void;
  field?: string;
  errors?: Errors;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
  maxLength?: number;
  disabled?: boolean;
  prefix?: string;
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
  maxLength,
  disabled = false,
  prefix,
}: RenderInputProps) => (
  <CustomInput
    label={label}
    value={prefix ? `${prefix}${value}` : value}
    placeholder={placeholder}
    onValueChange={(newValue: string) => {
      // Remove prefix from the value before passing to handler
      const cleanValue = prefix ? newValue.replace(prefix, '') : newValue;
      handleValueChange?.(field || '', cleanValue);
    }}
    errorMessage={errors?.[field || ''] ?? ''}
    keyboardType={keyboardType}
    secureTextEntry={secureTextEntry}
    maxLength={maxLength}
    disabled={disabled}
  />
);

export default renderInput;
