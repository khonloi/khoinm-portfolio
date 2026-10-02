import React, { memo, useEffect } from "react";
import Icon from "../Icon";
import { useDesktopStore } from "../../stores/useDesktopStore";
import { useWindowStore } from "../../stores/useWindowStore";
import type { DesktopItem, Position } from "../../types";

export interface DesktopIconsProps {
  allDesktopItems?: DesktopItem[];
  itemPositions?: Record<string, Position>;
  handleItemPositionChange?: (id: string, newPosition: Position, contextFolderId?: string | null) => void;
  handleItemDoubleClick?: (item: DesktopItem | string, label?: string, extra?: any) => void;
  selectedIcon?: string | null;
  setSelectedIcon?: (id: string | null) => void;
}

const DesktopIcons = memo<DesktopIconsProps>(({
  allDesktopItems: passedItems,
  itemPositions: passedPositions,
  handleItemPositionChange: passedPosChange,
  handleItemDoubleClick: passedDoubleClick,
  selectedIcon: passedSelected,
  setSelectedIcon: passedSetSelected,
}) => {
  const storeItems = useDesktopStore((s) => s.allDesktopItems);
  const storePositions = useDesktopStore((s) => s.itemPositions);
  const storePosChange = useDesktopStore((s) => s.handleItemPositionChange);
  const storeDoubleClick = useWindowStore((s) => s.handleItemDoubleClick);
  const storeSelected = useDesktopStore((s) => s.selectedIcon);
  const storeSetSelected = useDesktopStore((s) => s.setSelectedIcon);

  const allDesktopItems = passedItems || storeItems;
  const itemPositions = passedPositions || storePositions;
  const handleItemPositionChange = passedPosChange || storePosChange;
  const handleItemDoubleClick = passedDoubleClick || storeDoubleClick;
  const selectedIcon = passedSelected !== undefined ? passedSelected : storeSelected;
  const setSelectedIcon = passedSetSelected || storeSetSelected;
  // Keyboard navigation for desktop icons
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;
      
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
  }, [selectedIcon, allDesktopItems, handleItemDoubleClick, setSelectedIcon]);

  return (
    <>
      {allDesktopItems.map((item) => (
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
      ))}
    </>
  );
});

DesktopIcons.displayName = "DesktopIcons";
export default DesktopIcons;
