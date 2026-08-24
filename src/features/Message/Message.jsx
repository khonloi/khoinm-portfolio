import React, { useEffect, memo, useRef, useState, useCallback } from "react";
import Button from "../../components/Button";
import LayeredBox from "../../components/LayeredBox";
import Input from "../../components/Input";
import { useMessageForm } from "../../hooks/useMessageForm";



const Message = memo(() => {
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



  const handleInput = useCallback(() => {
    if (editorRef.current) {
      setMessageHtml(editorRef.current.innerHTML);
    }
  }, []);

  return (
    <div className="h-full w-full bg-windows-grey-shade-1 p-4 md:h-auto md:w-[34rem] flex flex-col overflow-hidden">
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

        {/* Bottom Bar: Send */}
        <div className="flex flex-col gap-4 mt-1 sm:flex-row sm:items-center sm:justify-end flex-none">
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
