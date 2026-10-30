import React, { forwardRef } from 'react';
import LayeredBox from './LayeredBox';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  type?: string;
  className?: string;
  boxClassName?: string;
  as?: 'input' | 'textarea';
  bgColor?: string;
  parentBgColor?: string;
  rows?: number;
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(({
  type = 'text',
  className = '',
  boxClassName = '',
  as = 'input',
  bgColor = '#ffffff',
  parentBgColor = '#e0e0e0',
  ...props
}, ref) => {
  return (
    <LayeredBox
      variant="inward"
      bgColor={bgColor}
      parentBgColor={parentBgColor}
      className={boxClassName}
    >
      {as === 'textarea' ? (
        <textarea
          ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
          className={`block w-full border-none p-1 font-main text-base outline-none bg-transparent ${className}`}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          type={type}
          ref={ref as React.ForwardedRef<HTMLInputElement>}
          className={`block w-full border-none p-1 font-main text-base outline-none bg-transparent ${className}`}
          {...props}
        />
      )}
    </LayeredBox>
  );
});

Input.displayName = 'Input';
export default Input;
