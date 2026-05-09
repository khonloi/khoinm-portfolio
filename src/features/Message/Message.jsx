import React, { useEffect, memo, useRef, useState, useCallback } from "react";
import Button from "../../components/Button";
import LayeredBox from "../../components/LayeredBox";
import Input from "../../components/Input";
import { useMessageForm } from "../../hooks/useMessageForm";

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
  fontSizeS: <span className="text-[10px] leading-none font-bold">A</span>,
  fontSizeM: <span className="text-[14px] leading-none font-bold">A</span>,
  fontSizeL: <span className="text-[18px] leading-none font-bold">A</span>,
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
  { command: 'fontSize', icon: FORMATTING_ICONS.fontSizeS, value: '2', title: 'Small' },
  { command: 'fontSize', icon: FORMATTING_ICONS.fontSizeM, value: '3', title: 'Medium' },
  { command: 'fontSize', icon: FORMATTING_ICONS.fontSizeL, value: '5', title: 'Large' },
];

const Message = memo(({ onClose }) => {
  const { formRef, status, errors, isSending, sendEmail, clearMessages } =
    useMessageForm();

  const editorRef = useRef(null);
  const [messageHtml, setMessageHtml] = useState("");

  // Clear messages after timeout
  useEffect(() => {
    return clearMessages();
  }, [clearMessages]);

  // Clear editor on success
  useEffect(() => {
    if (status === 'Message sent successfully!' && editorRef.current) {
      editorRef.current.innerHTML = '';
      setMessageHtml('');
    }
  }, [status]);

  const handleFormat = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setMessageHtml(editorRef.current.innerHTML);
    }
  }, []);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      setMessageHtml(editorRef.current.innerHTML);
    }
  }, []);

  return (
    <div className="h-full w-full bg-windows-grey-shade-1 p-4 md:h-auto md:w-[38rem] flex flex-col overflow-hidden">
      <form ref={formRef} onSubmit={sendEmail} className="flex flex-col flex-grow min-h-0 md:h-auto md:flex-none">
        {/* Name Input Group */}
        <div className="flex items-baseline gap-2">
          <label className="mb-2 block text-base font-bold text-windows-black">Name:</label>
          {errors.name && <span className="m-0 text-red-600 text-base">{errors.name}</span>}
        </div>
        <Input
          type="text"
          name="user_name"
          boxClassName="mb-4"
          required
        />

        {/* Email Input Group */}
        <div className="flex items-baseline gap-2">
          <label className="mb-2 block text-base font-bold text-windows-black">Email:</label>
          {errors.email && (
            <span className="m-0 text-red-600 text-base">{errors.email}</span>
          )}
        </div>
        <Input
          type="email"
          name="user_email"
          boxClassName="mb-4"
          required
        />

        {/* Message Input Group */}
        <div className="mb-2 flex flex-col flex-grow min-h-0 md:flex-none">
          <div className="flex items-baseline gap-2 flex-none">
            <label className="mb-2 block text-base font-bold text-windows-black">Message:</label>
            {errors.message && (
              <span className="m-0 text-red-600 text-base">{errors.message}</span>
            )}
            {status && (
              <span className="m-0 text-windows-black text-sm">{status}</span>
            )}
          </div>
          <LayeredBox
            variant="inward"
            bgColor="#ffffff"
            className="mb-1 flex-grow min-h-0 md:flex-none"
          >
            <div
              ref={editorRef}
              contentEditable
              onInput={handleInput}
              onBlur={handleInput}
              className="w-full h-full overflow-auto p-2 font-main text-base outline-none bg-transparent break-all md:h-48"
              style={{ minHeight: '12rem' }}
            />
          </LayeredBox>
          <input type="hidden" name="message" value={messageHtml} />
        </div>

        {/* Bottom Bar: Formatting and Send */}
        <div className="flex flex-col gap-4 mt-1 sm:flex-row sm:items-center sm:justify-between flex-none">
          <div className="flex flex-wrap gap-0.5">
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

          <div className="flex items-center justify-end gap-4 flex-grow">
            <Button
              type="submit"
              disabled={isSending}
            >
              Send
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
});

Message.displayName = "Message";

export default Message;
