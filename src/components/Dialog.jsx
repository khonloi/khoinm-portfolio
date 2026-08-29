import React, { useState, useEffect, useCallback, memo } from "react";
import Button from "./Button";
import { useDragDrop } from "../hooks/useDragDrop";

/**
 * Unified Dialog Component
 * Combines window frame and dialog content for a simplified modal/dialog interface.
 */
const Dialog = memo(({
    id = "generic-dialog",
    isVisible = true,
    title = "Dialog",
    message,
    icon,
    buttons = [], // Array of { label: string, onClick: function }
    onClose,
    zIndex: passedZIndex,
    centered = true,
    initialPosition = { x: 100, y: 100 },
    showIcon = true,
    showOverlay = true,
}) => {
    const zIndex = passedZIndex || (showOverlay ? 30000 : 20000);
    const [position, setPosition] = useState(initialPosition);
    const [isLoading, setIsLoading] = useState(true);

    const handlePosChange = useCallback((_, newPos) => setPosition(newPos), []);

    const { elementRef, handleMouseDown, handleTouchStart } = useDragDrop(
        id,
        position,
        handlePosChange,
        () => { } // Dialogs don't need complex focus management like desktop windows
    );

    // Initial loading simulated delay
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleTitleBarAction = useCallback((e) => {
        if (!e.target.closest(".window-title-bar")) return;
        if (e.target.closest("button") || e.target.closest(".control-button")) return;
        if (e.type === "mousedown") handleMouseDown(e);
        if (e.type === "touchstart") handleTouchStart(e);
    }, [handleMouseDown, handleTouchStart]);

    if (!isVisible || isLoading) return null;

    const windowStyle = centered ? {
        position: "relative",
        zIndex,
    } : {
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex,
    };

    const windowElement = (
        <div ref={elementRef} className="window-outer bg-windows-black p-[2px] min-w-[320px] origin-center trim-window-corners" style={windowStyle}>
            <div className="h-full relative bg-windows-grey trim-corners" onMouseDown={handleTitleBarAction} onTouchStart={handleTitleBarAction}>
                <div className="h-full flex flex-col border-t-2 border-l-2 border-windows-white p-1 pr-1.5 pb-1.5 bg-windows-grey overflow-hidden">
                    {/* Window Frame: Title and Controls */}
                    <div className="bg-windows-black p-[2px] mb-1.5 relative shrink-0">
                      <div className="window-title-bar flex justify-between items-center w-full h-full bg-windows-purple text-windows-white">
                        <span className="font-bold absolute left-1/2 -translate-x-1/2 select-none">{title}</span>
                        <div className="flex gap-0.5">
                            <Button
                                variant="control"
                                onClick={() => onClose?.(id)}
                                ariaLabel="Close Window"
                                title="Close Window"
                                className="control-button bg-[#ff746d]"
                                layer1ClassName="border-[#ffb3a7] text-white group-active:border-[#c94a3a]"
                                layer2ClassName="border-[#c94a3a]"
                            >
                                ×
                            </Button>
                        </div>
                      </div>
                    </div>

                    {/* Window Content: Message, Icon, and Buttons */}
                    <div className="window-content-outer flex-1 flex relative min-h-0 trim-corners">
                        <div className="border-l-2 border-t-2 border-windows-grey-dark flex-1 flex min-h-0 pr-0.5 pb-0.5">
                            <div className="border-2 border-windows-black bg-windows-white overflow-auto flex-1 select-text min-h-0 min-w-0 z-10 flex flex-col">
                                <div className="p-4 text-windows-black text-left max-w-[26rem] flex flex-col justify-center flex-1">
                                    <div className="flex items-center justify-center gap-4 mb-4">
                                        {showIcon && icon && (
                                            <img
                                                src={icon}
                                                alt=""
                                                className="w-10 h-10 object-contain align-middle select-none shrink-0"
                                                loading="eager"
                                                decoding="async"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        )}
                                        <span className="text-lg whitespace-pre-line">{message}</span>
                                    </div>
                                    {buttons.length > 0 && (
                                        <div className="flex justify-center gap-3">
                                            {buttons.slice(0, 3).map((btn, i) => (
                                                <Button
                                                    key={i}
                                                    onClick={btn.onClick}
                                                >
                                                    {btn.label}
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 border-r-2 border-b-2 border-windows-white"></div>
                    </div>
                </div>
                <div className="absolute inset-0 pointer-events-none border-r-2 border-b-2 border-windows-grey-dark"></div>
            </div>
        </div>
    );

    // Wrapper for centered modal experience
    if (centered) {
        return (
            <div
                className="fixed inset-0 flex items-center justify-center"
                style={{
                    zIndex: zIndex - 1,
                    backgroundColor: showOverlay ? "rgba(0, 0, 0, 0.5)" : "transparent",
                    pointerEvents: showOverlay ? "auto" : "none"
                }}
            >
                <div style={{ pointerEvents: "auto" }}>
                    {windowElement}
                </div>
            </div>
        );
    }

    return windowElement;
});

Dialog.displayName = "Dialog";
export default Dialog;
