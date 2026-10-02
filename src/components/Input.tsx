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

const Input = forwardRef<any, InputProps>(({
  type = 'text',
  className = '',
  boxClassName = '',
  as = 'input',
  bgColor = '#ffffff',
  parentBgColor = '#e0e0e0',
  ...props
}, ref) => {
  const Component = as;
  return (
    <LayeredBox
      variant="inward"
      bgColor={bgColor}
      parentBgColor={parentBgColor}
      className={boxClassName}
    >
      <Component
        type={as === 'textarea' ? undefined : type}
        ref={ref}
        className={`block w-full border-none p-1 font-main text-base outline-none bg-transparent ${className}`}
        {...props}
      />
    </LayeredBox>
  );
});

Input.displayName = 'Input';
export default Input;
