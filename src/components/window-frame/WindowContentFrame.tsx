import React, { memo } from 'react';

export interface WindowContentFrameProps {
  children?: React.ReactNode;
  contentClassName?: string;
}

export const WindowContentFrame = memo<WindowContentFrameProps>(({
  children,
  contentClassName = '',
}) => {
  return (
    <div className="window-content-outer flex-1 flex relative min-h-0 trim-corners">
      <div className="border-l-2 border-t-2 border-windows-grey-dark flex-1 flex min-h-0 pr-0.5 pb-0.5">
        <div
          className={`border-2 border-windows-black bg-windows-white overflow-auto flex-1 select-text min-h-0 min-w-0 z-10 ${contentClassName}`}
        >
          {children}
        </div>
      </div>
      <div className="absolute inset-0 border-r-2 border-b-2 border-windows-white pointer-events-none" />
    </div>
  );
});

WindowContentFrame.displayName = 'WindowContentFrame';
export default WindowContentFrame;
