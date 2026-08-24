import React, { memo, useState, useCallback } from 'react';

const Button = memo(({
  children,
  onClick,
  variant = "program", // "program" | "control" | "none"
  className = "",
  title,
  ariaLabel,
  disabled = false,
  isPressed: controlledIsPressed,
  isToggleable = false,
  type = "button",
  // Allow overriding layer colors for specific buttons (like the red close button)
  layer1ClassName = "",
  layer2ClassName = "",
  layer3ClassName = "",
  ...props
}) => {
  const [internalIsPressed, setIsPressed] = useState(false);

  const isPressed = controlledIsPressed !== undefined ? controlledIsPressed : (isToggleable ? internalIsPressed : false);

  const handleClick = useCallback((e) => {
    if (isToggleable && controlledIsPressed === undefined) {
      setIsPressed(prev => !prev);
    }
    if (onClick) {
      onClick(e);
    }
  }, [onClick, isToggleable, controlledIsPressed]);

  // Base button styles
  const baseButtonClasses = [
    "group relative select-none text-windows-black ring-2 ring-black trim-corners-ring touch-manipulation cursor-pointer active:outline-none",
    !className.includes('bg-') ? "bg-windows-grey" : "",
    variant === "program" ? "m-0.5 h-8 w-24 font-normal" : "",
    variant === "control" ? "h-8 w-8 text-3xl" : "",
    disabled ? "opacity-60 cursor-not-allowed pointer-events-none" : "",
    className
  ].filter(Boolean).join(" ");

  // Layer 1 styles (borders)
  // When disabled, borders collapse to bg color — no raised effect
  const currentL1Border = disabled
    ? "border-windows-grey"
    : isPressed
      ? "border-windows-grey-dark"
      : "border-windows-white group-active:border-windows-grey-dark";

  const l1Final = [
    "h-full border-l-2 border-t-2 pb-0.5 pr-0.5 pointer-events-none",
    !layer1ClassName.includes('border-') ? currentL1Border : "",
    layer1ClassName
  ].filter(Boolean).join(" ");

  // Layer 2 styles (shadow borders)
  // When disabled, hide the shadow border entirely
  const currentL2Border = disabled
    ? "border-windows-grey"
    : "border-windows-grey-dark";

  const l2Final = [
    "absolute inset-0 border-b-2 border-r-2 pointer-events-none",
    !layer2ClassName.includes('border-') ? currentL2Border : "",
    disabled ? "" : isPressed ? "hidden" : "group-active:hidden",
    layer2ClassName
  ].filter(Boolean).join(" ");

  // Layer 3 styles (content)
  const l3Variant = variant === "control" ? "font-button" : (variant === "program" ? "px-2.5 py-0.5" : "");

  const l3Final = [
    "flex h-full items-center justify-center pointer-events-none",
    l3Variant,
    !disabled && (isPressed
      ? "translate-x-px translate-y-px"
      : "group-active:translate-x-px group-active:translate-y-px"),
    layer3ClassName
  ].filter(Boolean).join(" ");

  return (
    <button
      type={type}
      className={baseButtonClasses}
      onClick={handleClick}
      title={title}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      disabled={disabled}
      {...props}
    >
      <div className={l1Final}>
        <div className={l3Final}>
          {children}
        </div>
      </div>
      <div className={l2Final}></div>
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
