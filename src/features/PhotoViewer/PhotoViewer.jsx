import React, { useState, memo, useEffect, useRef } from "react";
import LayeredBox from "../../components/LayeredBox";
import monaLisaIcon from "../../assets/icons/Microsoft Windows 3 Mona Lisa.ico";

const PhotoViewer = memo(({ id, fileContent }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [imgInfo, setImgInfo] = useState({ width: 0, height: 0, name: "No image" });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const source = fileContent;
    if (source) {
      setImgSrc(source);
      setImgInfo(prev => ({
        ...prev,
        name: source.startsWith("http") ? source : id + ".img"
      }));
    }
  }, [id, fileContent]);

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setImgInfo(prev => ({ ...prev, width: naturalWidth, height: naturalHeight }));
  };

  const handleOpenFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImgSrc(url);
      setImgInfo({ width: 0, height: 0, name: file.name });
    }
  };

  return (
    <div className="flex flex-col w-full h-full md:w-[36rem] [.maximized_&]:md:w-full [.maximized_&]:md:h-full bg-windows-grey font-main text-sm">
      {/* Menu Bar */}
      <div className="flex bg-windows-grey border-b-2 border-windows-white p-1 select-none shrink-0">
        <div
          className="px-2 py-0.5 hover:bg-windows-blue-bright hover:text-white cursor-default"
          onClick={handleOpenFile}
        >
          <span className="underline">F</span>ile
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Image Area */}
      <div className="w-full aspect-[4/3] flex items-center justify-center bg-windows-black overflow-hidden relative [.maximized_&]:flex-1 [.maximized_&]:aspect-auto">
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={imgInfo.name}
              className="w-full h-full object-contain block select-none pointer-events-none"
              onLoad={handleImageLoad}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-20 text-windows-grey-dark select-none min-w-[300px]">
              <img src={monaLisaIcon} alt="" className="w-16 h-16 opacity-30 mb-4 grayscale" />
              <p className="font-bold">Select an image to view</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex bg-windows-grey p-2 gap-4 select-none shrink-0 text-xs font-bold text-windows-black uppercase tracking-wider border-t-2 border-windows-white">
        <div className="flex-1 min-w-0 truncate">
          {imgInfo.name.startsWith("http") ? (
            <a
              href={imgInfo.name}
              target="_blank"
              rel="noopener noreferrer"
              className="text-windows-blue-bright hover:underline normal-case tracking-normal block truncate"
              title={imgInfo.name}
            >
              {imgInfo.name.split("/")[2] || imgInfo.name}
            </a>
          ) : (
            imgInfo.name
          )}
        </div>
        <div>
          Res: {imgInfo.width}x{imgInfo.height}
        </div>
      </div>
    </div>
  );
});

PhotoViewer.displayName = "PhotoViewer";

export default PhotoViewer;
