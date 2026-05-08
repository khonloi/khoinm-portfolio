import React, { useState, useCallback, memo, useEffect, useMemo } from "react";
import Icon from "./Icon";
import Window from "./Window";
import Explorer from "./Explorer";
import Taskbar from "./Taskbar";
import MenuBar from "./MenuBar";
import LoadingScreen from "./LoadingScreen";
import { useWindow } from "../hooks/useWindow";
import { useDesktop } from "../hooks/useDesktop";
import { useLoadingScreen } from "../hooks/useLoadingScreen";
import { useWindowManager } from "../hooks/useWindowManager";
import { useShutdown } from "../hooks/useShutdown";
import { useStartup } from "../hooks/useStartup";
import { useCMSContent } from "../hooks/useDesktopItems";
import { playSound } from "../data/sounds";
import { getCursorStyle } from "../data/cursors";
import { desktopItems, renderWindowContent } from "../config/programConfig";

const Desktop = memo(({ onFullScreenChange, onTriggerBSOD }) => {
  const { openWindows, openWindow, closeWindow, focusWindow, focusedWindow } = useWindow();
  const { folderMap } = useCMSContent();
  const { allDesktopItems, itemPositions, handleItemPositionChange } =
    useDesktop();

  const { isLoading, isDelaying, progress, menuBarVisible, skipLoading } =
    useLoadingScreen();
  const {
    minimizedWindows,
    loadingWindows,
    handleItemDoubleClick: handleItemDoubleClickBase,
    handleMinimizeWindow,
    handleRestoreWindow: handleRestoreWindowBase,
    handleCloseWindow: handleCloseWindowBase,
  } = useWindowManager();
  const { isShuttingDown, shutdownStage, startShutdown } = useShutdown();

  const [selectedIcon, setSelectedIcon] = useState(null);
  const [isTaskbarCollapsed, setIsTaskbarCollapsed] = useState(false);
  const [windowLoadingStates, setWindowLoadingStates] = useState({});

  const handleItemDoubleClick = useCallback(
    (idOrItem, label, options = {}) => {
      handleItemDoubleClickBase(
        idOrItem,
        label,
        openWindows,
        openWindow,
        focusWindow,
        options
      );
    },
    [handleItemDoubleClickBase, openWindows, openWindow, focusWindow]
  );



  const { hasStarted } = useStartup({
    isLoading,
    isDelaying,
    isShuttingDown,
    handleItemDoubleClick: handleItemDoubleClick,
  });

  const handleRestoreWindow = useCallback(
    (windowId) => {
      handleRestoreWindowBase(windowId, focusWindow);
    },
    [handleRestoreWindowBase, focusWindow]
  );

  const handleCloseWindow = useCallback(
    (windowId) => {
      handleCloseWindowBase(windowId, closeWindow);
      setWindowLoadingStates((prev) => {
        const newStates = { ...prev };
        delete newStates[windowId];
        return newStates;
      });
    },
    [handleCloseWindowBase, closeWindow]
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
        // Option A: Append dynamic items
        // folder.contents = [...folder.contents, ...dynamicItems];
        
        // Option B: Replace contents (User said "adjust the items in folder", usually means they want control)
        folder.contents = dynamicItems;
      }
    });
    
    return map;
  }, [allDesktopItems, folderMap]);

  const renderFolderContent = useCallback(
    (folderId) => {
      const folderData = folderDataMap.get(folderId);
      if (!folderData) return <div role="alert">Folder not found</div>;

      return (
        <Explorer
          folderId={folderId}
          folderData={folderData}
          onIconDoubleClick={handleItemDoubleClick}
          onFolderDoubleClick={handleItemDoubleClick}
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

  // Memoize minimized window IDs for faster lookup
  const minimizedWindowIds = useMemo(
    () => new Set(minimizedWindows.map((mw) => mw.id)),
    [minimizedWindows]
  );

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
    // Check if any open window is finished loading or is a dialog
    const hasVisibleContent = openWindows.some(win => 
      win.isDialog || windowLoadingStates[win.id] === false
    );
    // Check if there are any minimized windows in the taskbar
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
      {isShuttingDown && shutdownStage < 2 && (
        <div className="overlay" style={{ zIndex: 100000, cursor: getCursorStyle("busy") }} />
      )}
      {!hasFullScreenWindow && (
        <MenuBar
          visible={menuBarVisible && shutdownStage === 0}
          onShutdown={handleShutdown}
        />
      )}
      <div
        className={`desktop fixed w-screen p-0 m-0 ${hasFullScreenWindow ? "top-0 h-[100dvh]" : "top-[36px] h-[calc(100dvh-36px-var(--safe-bottom-buffer,0px))]"
          } ${loadingWindows.size > 0 ? "cursor-[var(--cursor-wait)]" : ""
          } ${shutdownStage === 1 ? "opacity-0 pointer-events-none" : ""}`}
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
              onDoubleClick={() => handleItemDoubleClick(item)}
              link={item.link}
              isSelected={selectedIcon === item.id}
              onSelect={setSelectedIcon}
              aria-label={`${item.label} ${item.type === "folder" ? "folder" : "application"
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
          const content = win.type === "folder"
            ? renderFolderContent(win.folderId)
            : renderWindowContent(win.id, win.title, () => handleCloseWindow(win.id), win.iconSrc, onTriggerBSOD, win);


          // If the program opted to open as a dialog or if the content is already a Dialog
          // We render it directly to avoid double-windowing.
          if (win.isDialog || (content && content.type && content.type.displayName === "Dialog")) {
            return <React.Fragment key={win.id}>{content}</React.Fragment>;
          }

          return (
            <Window
              key={win.id}
              id={win.id}
              title={win.title}
              icon={win.iconSrc}
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
