import React, { memo, useCallback } from "react";
import Window from "../Window";
import Explorer from "../Explorer";
import { renderWindowContent } from "../../config/programConfig";
import { useWindowContext } from "../../context/WindowContext";
import { useDesktopContext } from "../../context/DesktopContext";
import ErrorBoundary from "../ErrorBoundary";
import type { WindowState, TriggerZoomAnimationOptions } from "../../types";

export interface DesktopWindowsProps {
  openWindows?: WindowState[];
  focusedWindow?: string | null;
  minimizedWindowIds?: Set<string>;
  renderFolderContent?: (folderId: string) => React.ReactNode;
  handleCloseWindow?: (id: string) => void;
  onTriggerBSOD?: () => void;
  triggerZoomAnimation?: (options: TriggerZoomAnimationOptions) => string;
  handleMinimizeWindow?: (windowId: string, windowData: { title?: string; icon?: string }) => void;
  focusWindow?: (id: string) => void;
  onFullScreenChange?: (fullScreen: boolean) => void;
  handleWindowLoadingChange?: (windowId: string, isLoading: boolean) => void;
}

const DesktopWindows = memo<DesktopWindowsProps>(({
  openWindows: passedOpenWindows,
  focusedWindow: passedFocusedWindow,
  minimizedWindowIds: passedMinimizedWindowIds,
  renderFolderContent: passedRenderFolder,
  handleCloseWindow: passedClose,
  onTriggerBSOD,
  triggerZoomAnimation: passedZoom,
  handleMinimizeWindow: passedMinimize,
  focusWindow: passedFocus,
  onFullScreenChange,
  handleWindowLoadingChange: passedLoadingChange,
}) => {
  const windowCtx = useWindowContext();
  const { folderDataMap } = useDesktopContext();

  const openWindows = passedOpenWindows || windowCtx.openWindows;
  const focusedWindow = passedFocusedWindow !== undefined ? passedFocusedWindow : windowCtx.focusedWindow;
  const minimizedWindowIds = passedMinimizedWindowIds || windowCtx.minimizedWindowIds;
  const handleCloseWindow = passedClose || windowCtx.handleCloseWindow;
  const triggerZoomAnimation = passedZoom || windowCtx.triggerZoomAnimation;
  const handleMinimizeWindow = passedMinimize || windowCtx.handleMinimizeWindow;
  const focusWindow = passedFocus || windowCtx.focusWindow;
  const handleWindowLoadingChange = passedLoadingChange || windowCtx.handleWindowLoadingChange;

  const defaultRenderFolderContent = useCallback(
    (folderId: string) => {
      const folderData = folderDataMap.get(folderId);
      return <Explorer folderId={folderId} folderData={folderData} />;
    },
    [folderDataMap]
  );

  const renderFolderContent = passedRenderFolder || defaultRenderFolderContent;
  return (
    <>
      {openWindows.map((win) => {
        const isMinimized = minimizedWindowIds.has(win.id);
        const content =
          win.type === "folder"
            ? renderFolderContent(win.folderId || "")
            : renderWindowContent(
                win.id,
                win.title || "",
                () => handleCloseWindow(win.id),
                win.iconSrc ?? undefined,
                onTriggerBSOD,
                win
              );

        // If the program opted to open as a dialog or if the content is already a Dialog
        const isDialogElement =
          React.isValidElement(content) &&
          (content.type as { displayName?: string })?.displayName === "Dialog";

        if (win.isDialog || isDialogElement) {
          return <React.Fragment key={win.id}>{content}</React.Fragment>;
        }

        return (
          <Window
            key={win.id}
            id={win.id}
            title={win.title}
            icon={win.iconSrc ?? undefined}
            originRect={win.originRect ?? undefined}
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
            <ErrorBoundary name={win.title} onClose={() => handleCloseWindow(win.id)}>
              {content}
            </ErrorBoundary>
          </Window>
        );
      })}
    </>
  );
});

DesktopWindows.displayName = "DesktopWindows";
export default DesktopWindows;
