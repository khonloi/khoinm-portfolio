import React, { useState, memo, useEffect, useRef, useCallback } from "react";
import Button from "../../components/Button";
import LayeredBox from "../../components/LayeredBox";

const FORMATTING_ICONS = {
  bold: (
    <svg width="14" height="14" viewBox="0 0 10 10" fill="currentColor" shapeRendering="crispEdges">
      <rect x="2" y="1" width="2" height="8" />
      <rect x="4" y="1" width="3" height="1" />
      <rect x="4" y="4" width="3" height="1" />
      <rect x="4" y="8" width="3" height="1" />
      <rect x="7" y="2" width="1" height="2" />
      <rect x="7" y="5" width="1" height="3" />
    </svg>
  ),
  italic: (
    <svg width="14" height="14" viewBox="0 0 10 10" fill="currentColor" shapeRendering="crispEdges">
      <rect x="3" y="1" width="5" height="1" />
      <rect x="2" y="8" width="5" height="1" />
      <rect x="5" y="2" width="1" height="2" />
      <rect x="4" y="4" width="1" height="2" />
      <rect x="3" y="6" width="1" height="2" />
    </svg>
  ),
  underline: (
    <svg width="14" height="14" viewBox="0 0 10 10" fill="currentColor" shapeRendering="crispEdges">
      <rect x="2" y="1" width="1" height="6" />
      <rect x="7" y="1" width="1" height="6" />
      <rect x="3" y="7" width="4" height="1" />
      <rect x="1" y="9" width="8" height="1" />
    </svg>
  ),
  justifyLeft: (
    <svg width="14" height="14" viewBox="0 0 10 10" fill="currentColor" shapeRendering="crispEdges">
      <rect x="1" y="2" width="8" height="1" />
      <rect x="1" y="4" width="5" height="1" />
      <rect x="1" y="6" width="8" height="1" />
      <rect x="1" y="8" width="5" height="1" />
    </svg>
  ),
  justifyCenter: (
    <svg width="14" height="14" viewBox="0 0 10 10" fill="currentColor" shapeRendering="crispEdges">
      <rect x="1" y="2" width="8" height="1" />
      <rect x="3" y="4" width="4" height="1" />
      <rect x="1" y="6" width="8" height="1" />
      <rect x="3" y="8" width="4" height="1" />
    </svg>
  ),
  justifyRight: (
    <svg width="14" height="14" viewBox="0 0 10 10" fill="currentColor" shapeRendering="crispEdges">
      <rect x="1" y="2" width="8" height="1" />
      <rect x="4" y="4" width="5" height="1" />
      <rect x="1" y="6" width="8" height="1" />
      <rect x="4" y="8" width="5" height="1" />
    </svg>
  ),
  justifyFull: (
    <svg width="14" height="14" viewBox="0 0 10 10" fill="currentColor" shapeRendering="crispEdges">
      <rect x="1" y="2" width="8" height="1" />
      <rect x="1" y="4" width="8" height="1" />
      <rect x="1" y="6" width="8" height="1" />
      <rect x="1" y="8" width="8" height="1" />
    </svg>
  ),
  fontSizeM: <span className="text-[14px] leading-none font-bold">A</span>,
  fontSizeL: <span className="text-[18px] leading-none font-bold">A</span>,
  plain: <span className="text-[14px] leading-none font-bold font-sans">¶</span>,
};

const FORMATTING_TOOLS = [
  { command: 'bold', icon: FORMATTING_ICONS.bold, title: 'Bold' },
  { command: 'italic', icon: FORMATTING_ICONS.italic, title: 'Italic' },
  { command: 'underline', icon: FORMATTING_ICONS.underline, title: 'Underline' },
  { type: 'separator' },
  { command: 'justifyLeft', icon: FORMATTING_ICONS.justifyLeft, title: 'Align Left' },
  { command: 'justifyCenter', icon: FORMATTING_ICONS.justifyCenter, title: 'Align Center' },
  { command: 'justifyRight', icon: FORMATTING_ICONS.justifyRight, title: 'Align Right' },
  { command: 'justifyFull', icon: FORMATTING_ICONS.justifyFull, title: 'Justify' },
  { type: 'separator' },
  { command: 'plainParagraph', icon: FORMATTING_ICONS.plain, title: 'Plain Paragraph' },
  { command: 'fontSize', icon: FORMATTING_ICONS.fontSizeM, value: '3', title: 'Medium' },
  { command: 'fontSize', icon: FORMATTING_ICONS.fontSizeL, value: '5', title: 'Large' },
];

const Notebook = memo(({ id, fileContent }) => {
  const [text, setText] = useState("");
  const editorRef = useRef(null);

  useEffect(() => {
    if (fileContent !== undefined) {
      setText(fileContent);
      if (editorRef.current) {
        editorRef.current.innerText = fileContent || "";
      }
    } else {
      setText("");
      if (editorRef.current) {
        editorRef.current.innerText = "";
      }
    }
  }, [id, fileContent]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      setText(editorRef.current.innerHTML);
    }
  }, []);

  const handleFormat = useCallback((command, value = null) => {
    if (command === 'plainParagraph') {
      document.execCommand('removeFormat', false, null);
      document.execCommand('formatBlock', false, 'p');
    } else {
      document.execCommand(command, false, value);
    }
    if (editorRef.current) {
      setText(editorRef.current.innerHTML);
    }
  }, []);

  // Calculate line and column for the status bar
  // Using a simplified calculation based on innerText
  const plainText = (editorRef.current ? editorRef.current.innerText || text : text) || "";
  const lines = plainText.split("\n");

  return (
    <div className="flex flex-col w-full h-full md:w-[36rem] md:h-[27rem] [.maximized_&]:md:w-full [.maximized_&]:md:h-full bg-windows-grey font-main text-sm">


      {/* Editor Area with Formatting Bar */}
      <div className="flex-1 p-2 pb-0 overflow-hidden flex flex-col relative gap-2">
        <div className="flex flex-wrap p-0.5 gap-0.5">
          {FORMATTING_TOOLS.map((tool, index) => (
            tool.type === 'separator' ? (
              <div key={index} className="mx-2" />
            ) : (
              <Button
                key={index}
                type="button"
                variant="control"
                title={tool.title}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleFormat(tool.command, tool.value);
                }}
                className={`!text-sm ${tool.className || ''}`}
              >
                {tool.icon}
              </Button>
            )
          ))}
        </div>
        <LayeredBox
          variant="inward"
          bgColor="#ffffff"
          className="flex-1 min-h-0 flex flex-col"
        >
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={handleInput}
            className="flex-1 w-full h-full overflow-auto p-2 outline-none break-all whitespace-pre-wrap selection:bg-windows-blue-bright selection:text-white"
            style={{ minHeight: '100%' }}
          />
        </LayeredBox>
      </div>

      {/* Status Bar */}
      <div className="flex bg-windows-grey border-windows-white p-2 gap-4 select-none shrink-0 text-xs font-bold text-windows-black uppercase tracking-wider">
        <div>
          Lines: {lines.length}
        </div>
        <div className="border-l border-windows-grey-dark pl-4">
          Chr: {plainText.length}
        </div>
      </div>
    </div>
  );
});

Notebook.displayName = "Notebook";

export default Notebook;
