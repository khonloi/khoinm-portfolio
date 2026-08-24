import React, { memo } from "react";
import Button from "./Button";
import { useWindowInstance } from "../hooks/useWindowInstance";

const Window = memo(
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

    const windowStyle = {
      position: "absolute",
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
          className={[
            "window-outer bg-windows-black p-[2px] min-w-[320px] origin-center trim-window-corners",
            isMinimized ? "invisible absolute" : "",
            isFullScreenActive ? "!w-screen !h-[100dvh] !top-0 !left-0 !z-[40000] !p-0 !bg-windows-white ![clip-path:none]" : "",
            isMaximized || isMobile ? "maximized !-top-0.5" : "",
            isDragging ? "select-none" : "",
          ].filter(Boolean).join(" ")}
          style={windowStyle}
          onClick={isFullScreenActive ? () => onFocus(id) : undefined}
          onTouchStart={isFullScreenActive ? handleTouchStart : undefined}
          onTouchEnd={isFullScreenActive ? handleTouchEnd : undefined}
        >
          {isFullScreenActive ? (
            children
          ) : (
            <div
              className="h-full relative bg-windows-grey trim-corners"
              onMouseDown={handleTitleBarMouseDown}
              onTouchStart={handleTouchStart}
            >
              <div className="h-full flex flex-col border-t-2 border-l-2 border-windows-white p-1 pr-1.5 pb-1.5 bg-windows-grey overflow-hidden">
                <div className="bg-windows-black p-[2px] mb-1.5 relative shrink-0">
                  <div className={`window-title-bar flex justify-between items-center w-full h-full ${isFocused ? "bg-windows-purple text-windows-white" : "bg-windows-grey text-windows-black"}`}>
                    <span className="font-bold absolute left-1/2 -translate-x-1/2 select-none">{title}</span>
                  <div className="flex gap-0.5">
                    <Button
                      variant="control"
                      onClick={handleCloseClick}
                      className="control-button bg-[#ff746d]"
                      layer1ClassName="border-[#ffb3a7] text-white group-active:border-[#c94a3a]"
                      layer2ClassName="border-[#c94a3a]"
                      title="Close Window"
                      ariaLabel="Close Window"
                    >
                      ×
                    </Button>
                    {!isMobile && isMaximizable && !isFullScreenActive && (
                      <Button
                        variant="control"
                        onClick={handleMaximizeClick}
                        title={isMaximized ? "Restore Window" : "Maximize Window"}
                        ariaLabel={
                          isMaximized ? "Restore Window" : "Maximize Window"
                        }
                      >
                        •
                      </Button>
                    )}
                    <Button
                      variant="control"
                      onClick={handleMinimizeClick}
                      title="Minimize Window"
                      ariaLabel="Minimize Window"
                    >
                      -
                    </Button>
                  </div>
                </div>
                </div>
                <div className="window-content-outer flex-1 flex relative min-h-0 trim-corners">
                  <div className="border-l-2 border-t-2 border-windows-grey-dark flex-1 flex min-h-0 pr-0.5 pb-0.5">
                    <div className="border-2 border-windows-black bg-windows-white overflow-auto flex-1 select-text min-h-0 min-w-0 z-10">
                      {children}
                    </div>
                  </div>
                  <div className="absolute inset-0 border-r-2 border-b-2 border-windows-white"></div>
                </div>
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
