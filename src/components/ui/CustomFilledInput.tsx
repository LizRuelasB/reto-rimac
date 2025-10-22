import React, { useState, ChangeEvent, FocusEvent, SelectHTMLAttributes, InputHTMLAttributes } from 'react';
import arrow from '../../assets/images/icons/icon-arrow.svg';

interface SelectOption {
  value: string | number;
  label: string;
}

interface CustomBaseProps {
  label: string;
  borderRadius?: string;
  borderRight?: string;
  name?: string;
  id?: string;
  value: string | number;
}

interface SharedProps extends CustomBaseProps {
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

interface SelectProps extends SharedProps {
  options: SelectOption[];
  type?: never;
}

interface TextFieldProps extends SharedProps {
  type?: string;
  options?: never;
}
type CustomInputProps = SelectProps | TextFieldProps;



const getContainerStyles = (props: CustomBaseProps, isFocused: boolean) => ({
  backgroundColor: 'transparent',
  borderRadius: props.borderRadius || '8px',
  border: '1px solid #5E6488',
  borderRight: props.borderRight || '1px solid #5E6488',
  width: '100%',
  position: 'relative' as 'relative',
  display: 'flex',
  alignItems: 'center',
  boxShadow: 'none',
  outline: 'none',
  borderColor: isFocused ? '#5E6488' : '#5E6488',
});

const getLabelStyles = (isShrunk: boolean, isFocused: boolean) => ({
  position: 'absolute' as 'absolute',
  top: isShrunk ? '4px' : '50%',
  left: '12px',
  transform: isShrunk ? 'translateY(0)' : 'translateY(-50%)',
  pointerEvents: 'none' as 'none',
  transition: 'all 0.2s ease-out',
  color: isShrunk ? '#5E6488' : '#03050F',
  fontSize: isShrunk ? '12px' : '16px',
  padding: isShrunk ? '0 4px' : '0',
  zIndex: 1,
  
});

const getInputSelectStyles: React.CSSProperties = {
  padding: '16px',
  width: '100%',
  border: 'none',
  backgroundColor: 'transparent',
  outline: 'none',
  boxSizing: 'border-box',
  fontSize: '16px',
  fontFamily: 'BRSonoma-Regular',
  WebkitAppearance: 'none', 
  MozAppearance: 'none',
  appearance: 'none',
  height: '56px'
};


export function CustomFilledInput(props: CustomInputProps) {
  const { label, value, borderRadius, borderRight, options, name, id, type = 'text', onChange, onFocus, onBlur } = props;
  
  const [isFocused, setIsFocused] = useState(false);
  const isSelect = Array.isArray(options);
  const isShrunk = isFocused || (value !== null && value !== undefined && value.toString().length > 0);

  const handleFocus = (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const commonElementProps = {
    value: value,
    onChange: onChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    id: id || name,
    name: name,
    style: getInputSelectStyles,
  };
  
  return (
    <div style={getContainerStyles({
      borderRadius,
      borderRight,
      label: '',
      value: ''
    }, isFocused)}>
      <label 
        htmlFor={id || name}
        style={getLabelStyles(isShrunk, isFocused)}
      >
        {label}
      </label>

      {isSelect ? (
        <select
          {...(commonElementProps as SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...(commonElementProps as InputHTMLAttributes<HTMLInputElement>)}
          type={type}
        />
      )}
      {isSelect && (
        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none'}}>
          <img src={arrow} alt="arrow" />
        </div>
      )}
    </div>
  );
}