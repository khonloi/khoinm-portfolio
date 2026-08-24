import React, { useState, useCallback, memo, useEffect, useMemo } from "react";
import Icon from "./Icon";
import Window from "./Window";
import Explorer from "./Explorer";
import Taskbar from "./Taskbar";
import MenuBar from "./MenuBar";
import LoadingScreen from "./LoadingScreen";
import ZoomRectOverlay from "./ZoomRectOverlay";
import { useWindowSystem } from "../hooks/useWindowSystem";
import { useDesktop } from "../hooks/useDesktop";
import { useLoadingScreen } from "../hooks/useLoadingScreen";
import { useWindowAnimation } from "../hooks/useWindowAnimation";
import { useShutdown } from "../hooks/useShutdown";
import { useStartup } from "../hooks/useStartup";
import { useCMSContent } from "../hooks/useDesktopItems";
import { playSound } from "../data/sounds";
import { getCursorStyle } from "../data/cursors";
import { renderWindowContent } from "../config/programConfig";

const Desktop = memo(({ onFullScreenChange, onTriggerBSOD }) => {
  const {
    openWindows,
    focusedWindow,
    minimizedWindows,
    minimizedWindowIds,
    loadingWindows,
    handleItemDoubleClick,
    handleMinimizeWindow,
    handleRestoreWindow: handleRestoreWindowBase,
    handleCloseWindow: handleCloseWindowBase,
    focusWindow,
    updateWindowOriginRect,
  } = useWindowSystem();
  const { zoomAnimations, triggerZoomAnimation, handleAnimationComplete } =
    useWindowAnimation();
  const { isShuttingDown, shutdownStage, startShutdown } = useShutdown();

  const [selectedIcon, setSelectedIcon] = useState(null);
  const [isTaskbarCollapsed, setIsTaskbarCollapsed] = useState(false);
  const [windowLoadingStates, setWindowLoadingStates] = useState({});

  const { folderMap, cdDrive } = useCMSContent();
  const { allDesktopItems, itemPositions, handleItemPositionChange } =
    useDesktop(cdDrive);

  const { isLoading, isDelaying, progress, menuBarVisible, skipLoading } =
    useLoadingScreen();

  useStartup({
    isLoading,
    isDelaying,
    isShuttingDown,
    handleItemDoubleClick: handleItemDoubleClick,
  });

  const handleRestoreWindow = useCallback(
    (windowId, extra = {}) => {
      if (extra?.originRect) {
        updateWindowOriginRect(windowId, extra.originRect);
      }
      handleRestoreWindowBase(windowId);
    },
    [handleRestoreWindowBase, updateWindowOriginRect]
  );

  const handleCloseWindow = useCallback(
    (windowId) => {
      handleCloseWindowBase(windowId);
      setWindowLoadingStates((prev) => {
        const newStates = { ...prev };
        delete newStates[windowId];
        return newStates;
      });
    },
    [handleCloseWindowBase]
  );

  const handleDesktopClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      setSelectedIcon(null);
    }
  }, []);

  const handleShutdown = useCallback(() => {
    startShutdown();
  }, [startShutdown]);

  const handleToggleTaskbarCollapse = useCallback(async () => {
    const newCollapsedState = !isTaskbarCollapsed;
    setIsTaskbarCollapsed(newCollapsedState);
    const soundType = newCollapsedState ? "collapse" : "expand";
    await playSound(soundType);
  }, [isTaskbarCollapsed]);

  // Memoize folder data lookup for better performance
  const folderDataMap = useMemo(() => {
    const map = new Map();
    const processItems = (itemList) => {
      itemList.forEach((item) => {
        if (item.type === "folder") {
          map.set(item.id, item);
        }
        if (item.contents) {
          processItems(item.contents);
        }
      });
    };
    processItems(allDesktopItems);

    // Merge dynamic folder contents from Sanity
    Object.entries(folderMap).forEach(([folderId, dynamicItems]) => {
      const folder = map.get(folderId);
      if (folder) {
        folder.contents = dynamicItems;
        // Also index sub-folders inside dynamic content
        const processDynamic = (items) => {
          items.forEach((item) => {
            if (item.type === "folder") {
              map.set(item.id, item);
              if (item.contents) processDynamic(item.contents);
            }
          });
        };
        processDynamic(dynamicItems);
      }
    });

    return map;
  }, [allDesktopItems, folderMap]);

  const renderFolderContent = useCallback(
    (folderId) => {
      const folderData = folderDataMap.get(folderId);

      return (
        <Explorer
          folderId={folderId}
          folderData={folderData}
          onIconDoubleClick={(item, extra) =>
            handleItemDoubleClick(item, undefined, extra)
          }
          onFolderDoubleClick={(item, extra) =>
            handleItemDoubleClick(item, undefined, extra)
          }
          onIconPositionChange={handleItemPositionChange}
          onFolderPositionChange={handleItemPositionChange}
          onIconSelect={setSelectedIcon}
          onFolderSelect={setSelectedIcon}
          selectedItem={selectedIcon}
        />
      );
    },
    [
      folderDataMap,
      handleItemDoubleClick,
      handleItemPositionChange,
      selectedIcon,
    ]
  );

  // Handle window loading state changes
  const handleWindowLoadingChange = useCallback((windowId, isLoading) => {
    setWindowLoadingStates((prev) => ({
      ...prev,
      [windowId]: isLoading,
    }));
  }, []);

  // Handle cursor state during shutdown
  useEffect(() => {
    if (isShuttingDown && shutdownStage < 2) {
      document.body.style.cursor = getCursorStyle("wait");
    }
  }, [isShuttingDown, shutdownStage]);

  // Keyboard navigation for desktop icons
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      
      if (!selectedIcon && allDesktopItems.length > 0 && (e.key === 'ArrowDown' || e.key === 'ArrowRight')) {
        setSelectedIcon(allDesktopItems[0].id);
        return;
      }
      
      if (!selectedIcon) return;

      if (e.key === 'Enter') {
        const item = allDesktopItems.find(i => i.id === selectedIcon);
        if (item) handleItemDoubleClick(item);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const currentIndex = allDesktopItems.findIndex(i => i.id === selectedIcon);
        if (currentIndex === -1) return;

        let nextIndex = currentIndex;
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          nextIndex = (currentIndex - 1 + allDesktopItems.length) % allDesktopItems.length;
        } else {
          nextIndex = (currentIndex + 1) % allDesktopItems.length;
        }
        
        setSelectedIcon(allDesktopItems[nextIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIcon, allDesktopItems, handleItemDoubleClick]);

  // Memoize full-screen window calculation to avoid duplicate computation
  const hasFullScreenWindow = useMemo(() => {
    return openWindows.some(
      (win) =>
        win.isFullScreen &&
        !minimizedWindowIds.has(win.id) &&
        windowLoadingStates[win.id] === false
    );
  }, [openWindows, minimizedWindowIds, windowLoadingStates]);

  // Notify parent of full-screen state
  useEffect(() => {
    onFullScreenChange?.(hasFullScreenWindow);
  }, [hasFullScreenWindow, onFullScreenChange]);

  // Determine if there are any windows currently visible or minimized (requiring the safe area)
  const hasActiveWindows = useMemo(() => {
    const hasVisibleContent = openWindows.some(
      (win) => win.isDialog || windowLoadingStates[win.id] === false
    );
    const hasMinimizedWindows = minimizedWindows.length > 0;

    return hasVisibleContent || hasMinimizedWindows;
  }, [openWindows, windowLoadingStates, minimizedWindows.length]);

  // Manage mobile safe area buffer visibility class based on active windows
  useEffect(() => {
    if (hasActiveWindows) {
      document.documentElement.classList.add("has-windows");
    } else {
      document.documentElement.classList.remove("has-windows");
    }

    if (hasFullScreenWindow) {
      document.documentElement.classList.add("has-fullscreen");
    } else {
      document.documentElement.classList.remove("has-fullscreen");
    }

    return () => {
      document.documentElement.classList.remove("has-windows");
      document.documentElement.classList.remove("has-fullscreen");
    };
  }, [hasActiveWindows, hasFullScreenWindow]);

  if (isLoading) {
    return <LoadingScreen progress={progress} onSkip={skipLoading} />;
  }

  if (isShuttingDown && shutdownStage === 2) {
    return <LoadingScreen mode="shutdown" onComplete={() => window.close()} />;
  }

  if (isDelaying) {
    return (
      <>
        <MenuBar visible={menuBarVisible} />
        <div
          className="fixed w-screen p-0 m-0 top-[36px] h-[calc(100dvh-36px-var(--safe-bottom-buffer,0px))] cursor-[var(--cursor-busy)]"
          onClick={handleDesktopClick}
          onDragOver={(e) => e.preventDefault()}
          role="main"
          aria-label="Desktop environment"
        >
          <Taskbar
            minimizedWindows={minimizedWindows}
            onRestore={handleRestoreWindow}
            isCollapsed={isTaskbarCollapsed}
            onToggleCollapse={handleToggleTaskbarCollapse}
            aria-label="System Taskbar"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <ZoomRectOverlay
        animations={zoomAnimations}
        onAnimationComplete={handleAnimationComplete}
      />
      {isShuttingDown && shutdownStage < 2 && (
        <div
          className="overlay"
          style={{ zIndex: 100000, cursor: getCursorStyle("busy") }}
        />
      )}
      {!hasFullScreenWindow && (
        <MenuBar
          visible={menuBarVisible && shutdownStage === 0}
          onShutdown={handleShutdown}
        />
      )}
      <div
        className={`desktop fixed w-screen p-0 m-0 ${
          hasFullScreenWindow
            ? "top-0 h-[100dvh]"
            : "top-[36px] h-[calc(100dvh-36px-var(--safe-bottom-buffer,0px))]"
        } ${loadingWindows.size > 0 ? "cursor-[var(--cursor-wait)]" : ""} ${
          shutdownStage === 1 ? "opacity-0 pointer-events-none" : ""
        }`}
        onClick={handleDesktopClick}
        onDragOver={(e) => e.preventDefault()}
        role="main"
        aria-label="Desktop environment"
      >
        {allDesktopItems.map((item) => {
          return (
            <Icon
              key={item.id}
              id={item.id}
              label={item.label}
              iconSrc={item.iconSrc}
              type={item.type}
              position={itemPositions[item.id]}
              onPositionChange={handleItemPositionChange}
              onDoubleClick={(e, extra) =>
                handleItemDoubleClick(item, undefined, extra)
              }
              link={item.link}
              isSelected={selectedIcon === item.id}
              onSelect={setSelectedIcon}
              aria-label={`${item.label} ${
                item.type === "folder" ? "folder" : "application"
              }`}
              draggable={false}
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  "text/plain",
                  JSON.stringify({ id: item.id })
                );
              }}
            />
          );
        })}

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

        {!hasFullScreenWindow && (
          <Taskbar
            minimizedWindows={minimizedWindows}
            onRestore={handleRestoreWindow}
            isCollapsed={isTaskbarCollapsed}
            onToggleCollapse={handleToggleTaskbarCollapse}
            aria-label="System Taskbar"
          />
        )}
      </div>
    </>
  );
});

Desktop.displayName = "Desktop";

export default Desktop;
