import React, { useState, useCallback, memo, useEffect, useRef } from 'react';
import { useDragDrop } from '../hooks/useDragDrop';
import { useContrastColor } from '../hooks/useContrastColor';
import winWindowBlankIcon from '../assets/icons/win-window-blank.ico';
import winFolderIcon from '../assets/icons/win-folder.ico';
import shortcutIcon from '../assets/icons/win-shortcut.ico';

/**
 * Unified Icon Component
 * Handles folders, application icons, dragging, selection, and visual effects.
 */
const Icon = memo(({
    id,
    label,
    type,
    iconSrc,
    position,
    onPositionChange,
    onDoubleClick,
    onSelect,
    isSelected,
    className = "",
    children,
    onDrop,
    onDragOver,
    draggable,
    onDragStart,
    link,
}) => {
    // Stage-based state
    const [isFlashing, setIsFlashing] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const lastClickTimeRef = useRef(0);
    const clickTimeoutRef = useRef(null);
    const flashTimeoutRef = useRef(null);

    const imageRef = useRef(null);
    const effectiveIcon = iconSrc || (type === 'folder' ? winFolderIcon : winWindowBlankIcon);
    const isDraggable = draggable !== undefined ? draggable : true;

    // Drag and drop integration
    const { elementRef, handleMouseDown, handleTouchStart, elementStyle } = useDragDrop(
        id, position, onPositionChange, onSelect
    );

    // Text contrast detection
    const textColor = useContrastColor(elementRef);

    // Preload and cache management
    useEffect(() => {
        setIsImageLoaded(false);
        const checkLoaded = () => {
            if (imageRef.current?.complete) setIsImageLoaded(true);
        };
        checkLoaded();
        const timeout = setTimeout(checkLoaded, 50);
        return () => {
            clearTimeout(timeout);
            if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
            if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
        };
    }, [effectiveIcon]);

    const handleAction = useCallback((e) => {
        setIsFlashing(true);
        if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
        flashTimeoutRef.current = setTimeout(() => {
            if (elementRef.current) setIsFlashing(false);
        }, 400);
        let originRect = null;
        if (elementRef.current) {
            const rect = elementRef.current.getBoundingClientRect();
            originRect = {
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height,
            };
        }
        onDoubleClick?.(e, { originRect });
    }, [onDoubleClick, elementRef]);

    const handleClick = useCallback((e) => {
        const now = Date.now();
        const DOUBLE_CLICK_DELAY = 300;

        if (now - lastClickTimeRef.current < DOUBLE_CLICK_DELAY) {
            if (clickTimeoutRef.current) {
                clearTimeout(clickTimeoutRef.current);
                clickTimeoutRef.current = null;
            }
            handleAction(e);
            lastClickTimeRef.current = 0;
        } else {
            lastClickTimeRef.current = now;
            onSelect?.(id);
        }
    }, [handleAction, onSelect, id]);

    const handleInternalDragOver = useCallback((e) => {
        if (!onDrop) return;
        e.preventDefault();
        onDragOver?.(e, id);
    }, [onDrop, onDragOver, id]);

    const handleInternalDrop = useCallback((e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');
        if (data && onDrop) {
            try {
                const parsed = JSON.parse(data);
                onDrop(parsed.id || data, id);
            } catch {
                onDrop(data, id);
            }
        }
    }, [id, onDrop]);

    // Style composition
    const itemClasses = [
        "windows-icon flex flex-col items-center w-20 h-24 select-none",
        className,
        !isImageLoaded ? "invisible" : ""
    ].filter(Boolean).join(" ");

    const dynamicStyle = {
        ...elementStyle,
        visibility: isImageLoaded ? undefined : 'hidden',
        opacity: isImageLoaded ? undefined : 0,
    };

    const labelClasses = [
        "mt-1 px-1 py-0.5 text-center text-sm leading-tight break-words w-full line-clamp-2",
        isSelected ? "bg-windows-yellow text-windows-black" : "text-windows-white",
        isFlashing ? "animate-flash z-10" : ""
    ].filter(Boolean).join(" ");

    return (
        <div
            ref={elementRef}
            className={itemClasses}
            style={dynamicStyle}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onClick={handleClick}
            onFocus={() => onSelect?.(id)}
            onDragOver={handleInternalDragOver}
            onDrop={handleInternalDrop}
            draggable={isDraggable}
            onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', id);
                onDragStart?.(e, id);
            }}
            role="button"
            aria-label={label}
            tabIndex={0}
        >
            <div className="relative h-12">
                <img
                    ref={imageRef}
                    src={effectiveIcon}
                    alt=""
                    className="h-full w-full object-contain"
                    onLoad={() => setIsImageLoaded(true)}
                    onError={(e) => { e.target.src = winWindowBlankIcon; }}
                    draggable="false"
                />
                {link && (
                    <img
                        src={shortcutIcon}
                        alt="Shortcut"
                        className="absolute inset-0 z-[2] h-full w-full object-contain"
                        draggable="false"
                    />
                )}
            </div>
            <div
                className={labelClasses}
                style={{ color: (isSelected || isFlashing) ? undefined : textColor }}
            >
                {label}
            </div>
            {children}
        </div>
    );
});


Icon.displayName = 'Icon';
export default Icon;