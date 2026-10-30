import React, { memo } from "react";
import Button from "./Button";
import { WindowTitleBar, WindowContentFrame } from "./window-frame";
import { useWindowInstance } from "../hooks/window";
import type { Position, Rect, TriggerZoomAnimationOptions } from "../types";

export interface WindowProps {
  id: string;
  title?: string;
  icon?: string;
  onClose: (id: string) => void;
  onMinimize?: (id: string, data: { title?: string; icon?: string; position?: Position }) => void;
  onFocus?: (id: string) => void;
  onFullScreenChange?: (active: boolean) => void;
  onLoadingChange?: (id: string, isLoading: boolean) => void;
  originRect?: Rect | null;
  triggerZoomAnimation?: (options: TriggerZoomAnimationOptions) => string;
  children?: React.ReactNode;
  initialPosition?: { x?: number; y?: number; shouldCenter?: boolean };
  zIndex?: number;
  isMinimized?: boolean;
  isMaximizable?: boolean;
  isMaximized?: boolean;
  isFullScreen?: boolean;
  isFocused?: boolean;
  'aria-label'?: string;
}

const Window = memo<WindowProps>(
  ({
    id,
    title,
    icon,
    onClose,
    onMinimize,
    onFocus,
    onFullScreenChange,
    onLoadingChange,
    originRect,
    triggerZoomAnimation,
    children,
    initialPosition = { x: 100, y: 100 },
    zIndex = 1000,
    isMinimized = false,
    isMaximizable = true,
    isMaximized: initialMaximized = false,
    isFullScreen = false,
    isFocused = false,
    'aria-label': ariaLabel,
  }) => {
    const {
      elementRef,
      position,

      isOpening,
      isClosing,
      isMinimizing,
      isMaximized,
      isMobile,
      isFullScreenActive,
      windowDimensions,
      previewPosition,
      isDragging,
      hasCentered,
      handleTitleBarMouseDown,
      handleTouchStart,
      handleTouchEnd,
      handleMinimizeClick,
      handleMaximizeClick,
      handleCloseClick,
    } = useWindowInstance({
      id,
      title,
      icon,
      onClose,
      onMinimize,
      onFocus,
      onFullScreenChange,
      onLoadingChange,
      initialPosition,
      originRect,
      triggerZoomAnimation,
      isMinimized,
      isMaximized: initialMaximized,
      isFullScreen,
    });

    // Hide window until it's measured, centered, and opening zoom animation finishes
    const needsCentering =
      !isMobile && !isFullScreenActive && initialPosition?.shouldCenter && !hasCentered;
    const isHidden = !isFullScreenActive && (isOpening || isClosing || isMinimizing || needsCentering || isMinimized);

    const windowStyle: React.CSSProperties = {
      position: "absolute" as const,
      left: isFullScreenActive
        ? 0
        : isMaximized || isMobile
          ? 0
          : `${position.x}px`,
      top: isFullScreenActive
        ? 0
        : isMaximized || isMobile
          ? 0
          : `${position.y}px`,
      width: isFullScreenActive
        ? "100vw"
        : isMaximized || isMobile
          ? "100vw"
          : "auto",
      height: isFullScreenActive
        ? "100dvh"
        : isMaximized || isMobile
          ? "calc(100% + 2px)"
          : "auto",
      zIndex: isFullScreenActive ? 40000 : zIndex,
      visibility: isHidden ? "hidden" : undefined,
    };

    return (
      <>
        <div
          ref={elementRef}
          role="region"
          aria-label={ariaLabel || (title ? `${title} window` : undefined)}
          className={[
            "window-outer bg-windows-black p-[2px] min-w-[320px] origin-center",
            isMinimized ? "invisible absolute" : "",
            isFullScreenActive ? "!w-screen !h-[100dvh] !top-0 !left-0 !z-[40000] !p-0 !bg-windows-white ![clip-path:none]" : "",
            isMaximized || isMobile ? "maximized !-top-0.5 ![clip-path:none]" : "trim-window-corners",
            isDragging ? "select-none" : "",
          ].filter(Boolean).join(" ")}
          style={windowStyle}
          onClick={isFullScreenActive ? () => onFocus?.(id) : undefined}
          onTouchStart={isFullScreenActive ? handleTouchStart : undefined}
          onTouchEnd={isFullScreenActive ? handleTouchEnd : undefined}
        >
          {isFullScreenActive ? (
            children
          ) : (
            <div
              className={`h-full relative bg-windows-grey ${
                isMaximized || isMobile ? "![clip-path:none]" : "trim-corners"
              }`}
              onMouseDown={handleTitleBarMouseDown}
              onTouchStart={handleTouchStart}
            >
              <div className="h-full flex flex-col border-t-2 border-l-2 border-windows-white p-1 pr-1.5 pb-1.5 bg-windows-grey overflow-hidden">
                <WindowTitleBar
                  title={title}
                  isFocused={isFocused}
                  onClose={handleCloseClick}
                  showMaximize={!isMobile && isMaximizable && !isFullScreenActive}
                  isMaximized={isMaximized}
                  onMaximize={handleMaximizeClick}
                  showMinimize={true}
                  onMinimize={handleMinimizeClick}
                />
                <WindowContentFrame>
                  {children}
                </WindowContentFrame>
              </div>
              <div className="absolute inset-0 pointer-events-none border-r-2 border-b-2 border-windows-grey-dark"></div>
            </div>
          )}
        </div>
        {isDragging && !isMaximized && !isMobile && !isFullScreenActive && (
          <div
            className="absolute pointer-events-none border-4 border-windows-grey-dark z-[99999]"
            style={{
              left: `${previewPosition.x}px`,
              top: `${previewPosition.y}px`,
              width: `${windowDimensions.width}px`,
              height: `${windowDimensions.height}px`,
            }}
          />
        )}
      </>
    );
  }
);

Window.displayName = "Window";

export default Window;
