import React, { memo } from 'react';
import Button from './Button';
import { useWindowContext } from '../context/WindowContext';

const Taskbar = memo(({
  minimizedWindows: passedMinimized,
  onRestore: passedRestore,
  isCollapsed,
  onToggleCollapse,
}) => {
  const windowCtx = useWindowContext();
  const minimizedWindows = passedMinimized || windowCtx.minimizedWindows;
  const onRestore = passedRestore || windowCtx.handleRestoreWindow;

  // Don't render taskbar if there are no minimized windows
  if (!minimizedWindows || minimizedWindows.length === 0) {
    return null;
  }

  return (
    <div
      style={{ bottom: 'calc(var(--safe-bottom-buffer, 0px))' }}
      className={`fixed left-0 z-[10000] flex h-[56px] items-center justify-center bg-windows-grey border-t-2 border-r-2 border-windows-white border-r-windows-grey-dark outline-2 outline-windows-black w-max transition-all`}
    >
      {!isCollapsed && (
        <div className="flex gap-3 p-2">
          {minimizedWindows.map((window) => (
            <Button
              key={window.id}
              variant="control"
              className="h-10 w-10"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                onRestore(window.id, {
                  originRect: {
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height,
                  },
                });
              }}
              title={`Restore ${window.title}`}
            >
              {window.icon && (
                <img
                  src={window.icon}
                  alt=""
                  className="h-7 w-7 object-contain"
                />
              )}
            </Button>
          ))}
        </div>
      )}
      <div className="p-2">
        <Button
          variant="control"
          className="h-10 w-6 text-windows-black font-button text-2xl"
          onClick={onToggleCollapse}
          title={isCollapsed ? "Expand Taskbar" : "Collapse Taskbar"}
        >
          {isCollapsed ? ">" : "<"}
        </Button>
      </div>
    </div>
  );
});

Taskbar.displayName = 'Taskbar';

export default Taskbar;