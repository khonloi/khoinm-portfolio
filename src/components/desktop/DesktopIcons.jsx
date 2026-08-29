import React, { memo, useEffect } from "react";
import Icon from "../Icon";

const DesktopIcons = memo(({
  allDesktopItems,
  itemPositions,
  handleItemPositionChange,
  handleItemDoubleClick,
  selectedIcon,
  setSelectedIcon,
}) => {
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
