import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { sanitizeInput } from '@/lib/security';

interface SecureInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'form'> {
  form?: UseFormReturn<any>;
  name?: string;
}

export const SecureInput: React.FC<SecureInputProps> = ({ 
  onChange, 
  form, 
  name, 
  ...props 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Sanitize input on change
    const sanitizedValue = sanitizeInput(e.target.value);
    
    // Create new event with sanitized value
    const sanitizedEvent = {
      ...e,
      target: {
        ...e.target,
        value: sanitizedValue,
      },
    };

    // Update form if provided
    if (form && name) {
      form.setValue(name, sanitizedValue);
    }

    // Call original onChange
    onChange?.(sanitizedEvent as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <input
      {...props}
      onChange={handleChange}
      maxLength={props.maxLength || 1000}
    />
  );
};

interface SecureTextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'form'> {
  form?: UseFormReturn<any>;
  name?: string;
}

export const SecureTextArea: React.FC<SecureTextAreaProps> = ({ 
  onChange, 
  form, 
  name, 
  ...props 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Sanitize input on change
    const sanitizedValue = sanitizeInput(e.target.value);
    
    // Create new event with sanitized value
    const sanitizedEvent = {
      ...e,
      target: {
        ...e.target,
        value: sanitizedValue,
      },
    };

    // Update form if provided
    if (form && name) {
      form.setValue(name, sanitizedValue);
    }

    // Call original onChange
    onChange?.(sanitizedEvent as React.ChangeEvent<HTMLTextAreaElement>);
  };

  return (
    <textarea
      {...props}
      onChange={handleChange}
      maxLength={props.maxLength || 2000}
    />
  );
};