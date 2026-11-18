import React, { memo } from 'react';
import Button from '../Button';

export interface WindowTitleBarProps {
  id?: string;
  title?: string;
  isFocused?: boolean;
  onClose?: () => void;
  onMaximize?: () => void;
  onMinimize?: () => void;
  isMaximized?: boolean;
  isMaximizable?: boolean;
  showMaximize?: boolean;
  showMinimize?: boolean;
  titleId?: string;
}

export const WindowTitleBar = memo<WindowTitleBarProps>(({
  title,
  isFocused = true,
  onClose,
  onMaximize,
  onMinimize,
  isMaximized = false,
  showMaximize = false,
  showMinimize = false,
  titleId,
}) => {
  return (
    <div className="border-b-2 border-windows-black relative shrink-0">
      <div
        className={`window-title-bar flex items-center w-full h-full relative ${
          isFocused ? 'bg-windows-purple text-windows-white' : 'bg-windows-grey text-windows-black'
        }`}
      >
        <div className="flex gap-0.5 z-10">
          {onClose && (
            <Button
              variant="control"
              onClick={onClose}
              className="control-button bg-[#ff746d]"
              layer1ClassName="border-[#ffb3a7] text-white group-active:border-[#c94a3a]"
              layer2ClassName="border-[#c94a3a]"
              title="Close Window"
              ariaLabel="Close Window"
            >
              ×
            </Button>
          )}
          {showMaximize && onMaximize && (
            <Button
              variant="control"
              onClick={onMaximize}
              title={isMaximized ? 'Restore Window' : 'Maximize Window'}
              ariaLabel={isMaximized ? 'Restore Window' : 'Maximize Window'}
            >
              •
            </Button>
          )}
          {showMinimize && onMinimize && (
            <Button
              variant="control"
              onClick={onMinimize}
              title="Minimize Window"
              ariaLabel="Minimize Window"
            >
              -
            </Button>
          )}
        </div>
        <span
          id={titleId}
          className="font-bold absolute left-1/2 -translate-x-1/2 select-none pointer-events-none"
        >
          {title}
        </span>
      </div>
    </div>
  );
});

WindowTitleBar.displayName = 'WindowTitleBar';
export default WindowTitleBar;
