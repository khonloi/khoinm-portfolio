import React, { useState, memo, useEffect } from "react";
import Input from "../../components/Input";

const Notebook = memo(({ id, fileContent }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    if (fileContent) {
      setText(fileContent);
    } else {
      setText("");
    }
  }, [id, fileContent]);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // Calculate line and column for the status bar
  const lines = text.split("\n");
  const currentLine = text.substring(0, text.length).split("\n").length;
  // This is a bit simplified as it doesn't track cursor position accurately without ref
  // but for "display" it's a nice touch if we had cursor tracking.
  // For now let's just show total lines.

  return (
    <div className="flex flex-col w-full h-full md:min-w-[36rem] md:min-h-[27rem] bg-windows-grey font-main text-sm">

      {/* Editor Area */}
      <div className="flex-1 p-2 pb-0 overflow-hidden flex flex-col relative">
        <Input
          as="textarea"
          value={text}
          onChange={handleTextChange}
          placeholder="Start typing..."
          className="flex-1 resize-none h-full p-2 outline-none selection:bg-windows-blue-bright selection:text-white"
          boxClassName="h-full border-none"
          bgColor="#ffffff"
          style={{ height: '100%', border: 'none' }}
        />
      </div>

      {/* Status Bar */}
      <div className="flex bg-windows-grey border-windows-white p-2 gap-4 select-none shrink-0 text-xs font-bold text-windows-black uppercase tracking-wider">
        <div>
          Lines: {lines.length}
        </div>
        <div className="border-l border-windows-grey-dark pl-4">
          Chr: {text.length}
        </div>
      </div>
    </div>
  );
});

Notebook.displayName = "Notebook";

export default Notebook;
