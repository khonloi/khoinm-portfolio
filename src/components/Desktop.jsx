import React, { useState, useCallback, memo, useEffect } from "react";
import DesktopIcons from "./desktop/DesktopIcons";
import DesktopWindows from "./desktop/DesktopWindows";
import Taskbar from "./Taskbar";
import MenuBar from "./MenuBar";
import LoadingScreen from "./LoadingScreen";
import ZoomRectOverlay from "./ZoomRectOverlay";
import { useSystem } from "../context/SystemContext";
import { useDesktopContext } from "../context/DesktopContext";
import { useWindowContext } from "../context/WindowContext";
import { useStartup } from "../hooks/useStartup";
import { useDeepLinking } from "../hooks/useDeepLinking";
import SEO from "./SEO";
import { playSound } from "../data/sounds";
import { getCursorStyle } from "../data/cursors";

const Desktop = memo(({ onFullScreenChange, onTriggerBSOD }) => {
  // System context
  const {
    isLoading,
    isDelaying,
    progress,
    menuBarVisible,
    skipLoading,
    isShuttingDown,
    shutdownStage,
    startShutdown,
    triggerBSOD: systemTriggerBSOD,
  } = useSystem();

  // Desktop context
  const {
    setSelectedIcon,
  } = useDesktopContext();

  // Window context
  const {
    openWindows,
    focusedWindow,
    minimizedWindows,
    loadingWindows,
    handleItemDoubleClick,
    handleRestoreWindow,
    focusWindow,
    zoomAnimations,
    handleAnimationComplete,
    hasFullScreenWindow,
    hasActiveWindows,
  } = useWindowContext();

  const [isTaskbarCollapsed, setIsTaskbarCollapsed] = useState(false);

  const effectiveTriggerBSOD = onTriggerBSOD || systemTriggerBSOD;

  // Startup hook
  const { hasStarted } = useStartup({
    isLoading,
    isDelaying,
    isShuttingDown,
    handleItemDoubleClick,
  });

  // Deep linking and URL synchronization
  useDeepLinking({
    handleItemDoubleClick,
    openWindows,
    focusedWindow,
    focusWindow,
    hasBooted: hasStarted,
  });

  const handleDesktopClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      setSelectedIcon(null);
    }
  }, [setSelectedIcon]);

  const handleToggleTaskbarCollapse = useCallback(async () => {
    const newCollapsedState = !isTaskbarCollapsed;
    setIsTaskbarCollapsed(newCollapsedState);
    const soundType = newCollapsedState ? "collapse" : "expand";
    await playSound(soundType);
  }, [isTaskbarCollapsed]);

  // Handle cursor state during shutdown
  useEffect(() => {
    if (isShuttingDown && shutdownStage < 2) {
      document.body.style.cursor = getCursorStyle("wait");
    }
  }, [isShuttingDown, shutdownStage]);

  // Notify parent of full-screen state
  useEffect(() => {
    onFullScreenChange?.(hasFullScreenWindow);
  }, [hasFullScreenWindow, onFullScreenChange]);

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
      <SEO focusedWindow={focusedWindow} openWindows={openWindows} />
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
          onShutdown={startShutdown}
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
        <DesktopIcons />
        <DesktopWindows
          onTriggerBSOD={effectiveTriggerBSOD}
          onFullScreenChange={onFullScreenChange}
        />

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
