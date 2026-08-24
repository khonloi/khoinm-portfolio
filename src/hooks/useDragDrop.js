// src/hooks/useDragDrop.js
import { useState, useRef, useEffect, useCallback } from "react";
// Import the cursor file from assets


export const useDragDrop = (id, position, onPositionChange, onSelect, options = {}) => {
  const { useOutline = false } = options;
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [previewPosition, setPreviewPosition] = useState(position || { x: 0, y: 0 });
  const elementRef = useRef(null);
  const lastPositionRef = useRef(null);
  const requestRef = useRef(null);

  const safePosition = position || { x: 0, y: 0 };
  const isAbsolutePositioned = position !== null && position !== undefined;

  const handleMouseDown = useCallback(
    (e) => {
      if (e.target.closest("button") || e.target.closest(".control-button") || e.target.closest("[role='button']")) {
        return;
      }
      onSelect?.(id);
      if (e.detail === 2 || !isAbsolutePositioned) return;

      setIsDragging(true);
      const rect = elementRef.current.getBoundingClientRect();
      const currentPos = position || { x: 0, y: 0 };
      setPreviewPosition(currentPos);
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [id, isAbsolutePositioned, onSelect, position]
  );

  const handleTouchStart = useCallback(
    (e) => {
      if (e.target.closest("button") || e.target.closest(".control-button") || e.target.closest("[role='button']")) {
        return;
      }
      onSelect?.(id);
      if (!isAbsolutePositioned) return;

      const target = e.target;
      const isTitleBar = target.closest(".window-title-bar");

      if (
        elementRef.current &&
        elementRef.current.classList.contains("window-outer") &&
        !isTitleBar
      ) {
        return;
      }

      setIsDragging(true);
      const rect = elementRef.current.getBoundingClientRect();
      const currentPos = position || { x: 0, y: 0 };
      setPreviewPosition(currentPos);
      const touch = e.touches[0];
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
    },
    [id, isAbsolutePositioned, onSelect, position]
  );

  const updatePosition = useCallback(
    (clientX, clientY) => {
      if (!isDragging || !isAbsolutePositioned || !elementRef.current) return;

      const container =
        elementRef.current.closest(".desktop") ||
        elementRef.current.closest(".folder-content");
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newX = clientX - containerRect.left - dragOffset.x;
      const newY = clientY - containerRect.top - dragOffset.y;

      const isWindow = elementRef.current.classList.contains("window-outer");
      const elementWidth = isWindow ? elementRef.current.offsetWidth : 64;
      const elementHeight = isWindow ? elementRef.current.offsetHeight : 64;

      const EDGE_PADDING = 5;
      const maxX = containerRect.width - elementWidth + EDGE_PADDING;
      const maxY = containerRect.height - elementHeight + EDGE_PADDING;

      const clampedX = Math.max(-EDGE_PADDING, Math.min(newX, maxX));
      const clampedY = Math.max(-EDGE_PADDING, Math.min(newY, maxY));

      const newPosition = { x: clampedX, y: clampedY };
      
      if (
        !lastPositionRef.current ||
        Math.abs(lastPositionRef.current.x - newPosition.x) > 0.5 ||
        Math.abs(lastPositionRef.current.y - newPosition.y) > 0.5
      ) {
        lastPositionRef.current = newPosition;
        
        if (useOutline) {
          setPreviewPosition(newPosition);
        } else {
          onPositionChange(id, newPosition);
        }
      }
    },
    [id, isDragging, isAbsolutePositioned, dragOffset, onPositionChange, useOutline]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);

      requestRef.current = requestAnimationFrame(() => {
        updatePosition(e.clientX, e.clientY);
      });
    },
    [isDragging, updatePosition]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging) return;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);

      const touch = e.touches[0];
      requestRef.current = requestAnimationFrame(() => {
        updatePosition(touch.clientX, touch.clientY);
      });

      e.preventDefault();
    },
    [isDragging, updatePosition]
  );

  const handleDragEnd = useCallback(() => {
    if (isDragging && useOutline && lastPositionRef.current) {
      onPositionChange(id, lastPositionRef.current);
    }
    
    setIsDragging(false);
    lastPositionRef.current = null;
    
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  }, [id, isDragging, onPositionChange, useOutline]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleDragEnd);
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleDragEnd);
      document.addEventListener("touchcancel", handleDragEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleDragEnd);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleDragEnd);
        document.removeEventListener("touchcancel", handleDragEnd);

        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
          requestRef.current = null;
        }
      };
    }
  }, [isDragging, handleMouseMove, handleTouchMove, handleDragEnd]);

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return {
    elementRef,
    isDragging,
    previewPosition,
    handleMouseDown,
    handleTouchStart,
    elementStyle: isAbsolutePositioned
      ? {
          position: "absolute",
          left: `${safePosition.x}px`,
          top: `${safePosition.y}px`,
          cursor: "var(--cursor-link)",
          zIndex: isDragging ? 1000 : 1,
        }
      : {
          cursor: "var(--cursor-link)",
        },
  };
};

