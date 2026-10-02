import React, { memo, useCallback } from "react";
import Window from "../Window";
import Explorer from "../Explorer";
import { renderWindowContent } from "../../config/programConfig";
import { useWindowStore } from "../../stores/useWindowStore";
import { useDesktopStore } from "../../stores/useDesktopStore";
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
  const storeOpenWindows = useWindowStore((s) => s.openWindows);
  const storeFocusedWindow = useWindowStore((s) => s.focusedWindow);
  const storeMinimizedWindowIds = useWindowStore((s) => s.minimizedWindowIds);
  const storeCloseWindow = useWindowStore((s) => s.handleCloseWindow);
  const storeZoomAnimation = useWindowStore((s) => s.triggerZoomAnimation);
  const storeMinimizeWindow = useWindowStore((s) => s.handleMinimizeWindow);
  const storeFocusWindow = useWindowStore((s) => s.focusWindow);
  const storeLoadingChange = useWindowStore((s) => s.handleWindowLoadingChange);
  const folderDataMap = useDesktopStore((s) => s.folderDataMap);

  const openWindows = passedOpenWindows || storeOpenWindows;
  const focusedWindow = passedFocusedWindow !== undefined ? passedFocusedWindow : storeFocusedWindow;
  const minimizedWindowIds = passedMinimizedWindowIds || storeMinimizedWindowIds;
  const handleCloseWindow = passedClose || storeCloseWindow;
  const triggerZoomAnimation = passedZoom || storeZoomAnimation;
  const handleMinimizeWindow = passedMinimize || storeMinimizeWindow;
  const focusWindow = passedFocus || storeFocusWindow;
  const handleWindowLoadingChange = passedLoadingChange || storeLoadingChange;

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
