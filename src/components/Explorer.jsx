import React, { memo, useCallback } from 'react';
import Icon from './Icon';
import flashlightGif from '../assets/images/flashlight.gif';

const Explorer = memo(({
  folderId,
  folderData,
  onIconDoubleClick,
  onFolderDoubleClick,
  onIconSelect,
  onFolderSelect,
  selectedItem,
  onMoveIcon,
}) => {
  const handleItemDoubleClick = useCallback((item) => {
    if (item.type === 'folder') {
      onFolderDoubleClick(item);
    } else {
      onIconDoubleClick(item);
    }
  }, [onFolderDoubleClick, onIconDoubleClick]);

  const handleDrop = useCallback((draggedIconId, targetFolderId) => {
    if (onMoveIcon) {
      onMoveIcon(draggedIconId, folderId, targetFolderId);
    }
  }, [onMoveIcon, folderId]);

  const handleDragStart = useCallback((e, itemId) => {
    e.dataTransfer.setData('text/plain', itemId);
  }, []);

  const isLoading = folderData?.contents?.length === 1 && folderData.contents[0].label === "Loading CMS data";
  const isNotFound = !folderData;

  if (isLoading || isNotFound) {
    return (
      <div className="folder-content w-[520px] h-[336px] [.maximized_&]:w-full [.maximized_&]:h-full flex flex-col items-center justify-center bg-windows-white gap-1">
        <img
          src={flashlightGif}
          alt="Searching..."
          className="w-24 object-contain pointer-events-none select-none"
        />
        <p className="text-sm text-windows-black font-main">
          {isNotFound ? "Folder not found" : "Loading CMS data"}
        </p>
      </div>
    );
  }

  return (
    <div className="folder-content w-[520px] h-[336px] [.maximized_&]:w-full [.maximized_&]:h-full overflow-y-auto overflow-x-hidden">
      <div className="grid grid-cols-[repeat(5,80px)] auto-rows-[96px] [.maximized_&]:grid-cols-[repeat(auto-fill,minmax(80px,1fr))] justify-items-center gap-x-5 gap-y-1 p-5 w-full">
        {folderData.contents.map(item => {
          return (
            <Icon
              key={item.id}
              id={item.id}
              label={item.label}
              iconSrc={item.iconSrc}
              type={item.type}
              link={item.link}
              onDoubleClick={() => handleItemDoubleClick(item)}
              isSelected={selectedItem === item.id}
              onSelect={item.type === 'folder' ? onFolderSelect : onIconSelect}
              onDrop={item.type === 'folder' ? handleDrop : undefined}
              draggable={false}
            />
          );
        })}
      </div>
    </div>
  );
});

Explorer.displayName = 'Explorer';

export default Explorer;