import { ChangeEvent, FocusEvent } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface CustomBaseProps {
  label: string;
  borderRadius?: string;
  borderRight?: string;
  name?: string;
  id?: string;
  value: string | number;
  isInvalid?: boolean;
  helperText?: string;
}

export interface SharedProps extends CustomBaseProps {
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export interface SelectProps extends SharedProps {
  options: SelectOption[];
  type?: never;
}

export interface TextFieldProps extends SharedProps {
  type?: string;
  options?: never;
}

export type CustomInputProps = SelectProps | TextFieldProps;
