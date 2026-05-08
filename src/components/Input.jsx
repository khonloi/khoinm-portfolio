import React, { forwardRef } from 'react';
import LayeredBox from './LayeredBox';

const Input = forwardRef(({
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
