import React, { useState, ChangeEvent, FocusEvent, SelectHTMLAttributes, InputHTMLAttributes } from 'react';
import arrow from '../../../assets/icons/icon-arrow.svg'; 
import './CustomFilledInput.scss'
import { CustomInputProps } from './types';



const getContainerClasses = (isFocused: boolean, isInvalid: boolean, borderRight?: string) => {
  const baseClass = 'custom-filled-input__container';
  const classes = [baseClass];
  
  if (isFocused) classes.push(`${baseClass}--focused`);
  if (isInvalid) classes.push(`${baseClass}--invalid`);
  if (borderRight) classes.push(`${baseClass}--no-right-border`);
  
  return classes.join(' ');
};

const getLabelClasses = (isShrunk: boolean, isFocused: boolean, isInvalid: boolean) => {
  const baseClass = 'custom-filled-input__label';
  const classes = [baseClass];
  
  if (isShrunk) classes.push(`${baseClass}--shrunk`);
  if (isFocused) classes.push(`${baseClass}--focused`);
  if (isInvalid) classes.push(`${baseClass}--invalid`);
  
  return classes.join(' ');
};


const getDynamicContainerStyles = (borderRadius?: string): React.CSSProperties => {
  return borderRadius ? { borderRadius } : {};
};


export function CustomFilledInput(props: CustomInputProps) {
  const { 
    label, 
    value, 
    borderRadius, 
    borderRight, 
    options, 
    name, 
    id, 
    type = 'text', 
    onChange, 
    onFocus, 
    onBlur,
    isInvalid = false,
    helperText = '',
  } = props;
  
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
  };
  
  return (
    <div className="custom-filled-input">
      <div 
        className={getContainerClasses(isFocused, isInvalid, borderRight)}
        style={getDynamicContainerStyles(borderRadius)}
      >
        <label 
          htmlFor={id || name}
          className={getLabelClasses(isShrunk, isFocused, isInvalid)}
        >
          {label}
        </label>

        {isSelect ? (
          <select
            {...(commonElementProps as SelectHTMLAttributes<HTMLSelectElement>)}
            className="custom-filled-input__select"
          >
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            {...(commonElementProps as InputHTMLAttributes<HTMLInputElement>)}
            type={type}
            className={`custom-filled-input__input ${isShrunk ? 'custom-filled-input__input--shrunk' : ''}`}
          />
        )}
        
        {isSelect && (
          <div className="custom-filled-input__arrow">
            <img src={arrow} alt="arrow" /> 
          </div>
        )}
      </div>
      
      {helperText && (
        <div className="custom-filled-input__helper-text">
          {helperText}
        </div>
      )}
    </div>
  );
}
