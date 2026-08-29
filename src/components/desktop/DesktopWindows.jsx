import React, { memo } from "react";
import Window from "../Window";
import { renderWindowContent } from "../../config/programConfig";

const DesktopWindows = memo(({
  openWindows,
  focusedWindow,
  minimizedWindowIds,
  renderFolderContent,
  handleCloseWindow,
  onTriggerBSOD,
  triggerZoomAnimation,
  handleMinimizeWindow,
  focusWindow,
  onFullScreenChange,
  handleWindowLoadingChange,
}) => {
  return (
    <>
      {openWindows.map((win) => {
        const isMinimized = minimizedWindowIds.has(win.id);
        const content =
          win.type === "folder"
            ? renderFolderContent(win.folderId)
            : renderWindowContent(
                win.id,
                win.title,
                () => handleCloseWindow(win.id),
                win.iconSrc,
                onTriggerBSOD,
                win
              );

        // If the program opted to open as a dialog or if the content is already a Dialog
        if (
          win.isDialog ||
          (content && content.type && content.type.displayName === "Dialog")
        ) {
          return <React.Fragment key={win.id}>{content}</React.Fragment>;
        }

        return (
          <Window
            key={win.id}
            id={win.id}
            title={win.title}
            icon={win.iconSrc}
            originRect={win.originRect}
            triggerZoomAnimation={triggerZoomAnimation}
            initialPosition={win.initialPosition}
            zIndex={win.zIndex}
            isMinimized={isMinimized}
            isMaximizable={win.isMaximizable}
            isMaximized={win.isMaximized}
            isFullScreen={win.isFullScreen}
            isFocused={win.id === focusedWindow}
            onClose={handleCloseWindow}
            onMinimize={handleMinimizeWindow}
            onFocus={focusWindow}
            onFullScreenChange={onFullScreenChange}
            onLoadingChange={handleWindowLoadingChange}
            aria-label={`${win.title} window`}
          >
            {content}
          </Window>
        );
      })}
    </>
  );
});

DesktopWindows.displayName = "DesktopWindows";
export default DesktopWindows;
