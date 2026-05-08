import React, { memo } from 'react';
import Button from './Button';

const Taskbar = memo(({ minimizedWindows, onRestore, isCollapsed, onToggleCollapse }) => {
  // Don't render taskbar if there are no minimized windows
  if (!minimizedWindows || minimizedWindows.length === 0) {
    return null;
  }

  return (
    <div
      style={{ bottom: 'calc(var(--safe-bottom-buffer, 0px))' }}
      className={`fixed left-0 z-[10000] flex h-12 items-center justify-center bg-windows-grey border-t-2 border-r-2 border-windows-white border-r-windows-grey-dark outline-2 outline-windows-black ${isCollapsed ? 'w-12' : 'w-max'} transition-all`}
    >
      {!isCollapsed && (
        <div className="flex gap-3 p-2">
          {minimizedWindows.map((window) => (
            <Button
              key={window.id}
              variant="control"
              onClick={() => onRestore(window.id)}
              title={`Restore ${window.title}`}
            >
              {window.icon && (
                <img
                  src={window.icon}
                  alt=""
                  className="h-5 w-5 object-contain"
                />
              )}
            </Button>
          ))}
        </div>
      )}
      <div className="p-2">
        <Button
          variant="control"
          className="text-windows-black font-button text-2xl"
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