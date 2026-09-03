import React, { memo, useCallback } from 'react';
import Icon from './Icon';
import flashlightGif from '../assets/images/flashlight.gif';
import { useDesktopContext } from '../context/DesktopContext';
import { useWindowContext } from '../context/WindowContext';

const Explorer = memo(({
  folderId,
  folderData: passedFolderData,
  onIconDoubleClick,
  onFolderDoubleClick,
  onIconSelect,
  onFolderSelect,
  selectedItem: passedSelectedItem,
  onMoveIcon,
}) => {
  const desktopCtx = useDesktopContext();
  const windowCtx = useWindowContext();

  const folderData = passedFolderData || desktopCtx.folderDataMap.get(folderId);
  const selectedItem = passedSelectedItem !== undefined ? passedSelectedItem : desktopCtx.selectedIcon;

  const handleItemDoubleClick = useCallback((item, extra) => {
    if (item.type === 'folder' && onFolderDoubleClick) {
      onFolderDoubleClick(item, extra);
    } else if (onIconDoubleClick) {
      onIconDoubleClick(item, extra);
    } else {
      windowCtx.handleItemDoubleClick(item, undefined, extra);
    }
  }, [onFolderDoubleClick, onIconDoubleClick, windowCtx]);

  const handleIconSelect = onIconSelect || desktopCtx.setSelectedIcon;
  const handleFolderSelect = onFolderSelect || desktopCtx.setSelectedIcon;

  const handleDrop = useCallback((draggedIconId, targetFolderId) => {
    if (onMoveIcon) {
      onMoveIcon(draggedIconId, folderId, targetFolderId);
    }
  }, [onMoveIcon, folderId]);



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
              onDoubleClick={(e, extra) => handleItemDoubleClick(item, extra)}
              isSelected={selectedItem === item.id}
              onSelect={item.type === 'folder' ? handleFolderSelect : handleIconSelect}
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