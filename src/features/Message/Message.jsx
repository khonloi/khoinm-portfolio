import React, { useEffect, memo } from "react";
import Button from "../../components/Button";
import LayeredBox from "../../components/LayeredBox";
import Input from "../../components/Input";
import { useMessageForm } from "../../hooks/useMessageForm";

const Message = memo(({ onClose }) => {
  const { formRef, status, errors, isSending, sendEmail, clearMessages } =
    useMessageForm();

  // Clear messages after timeout
  useEffect(() => {
    return clearMessages();
  }, [clearMessages]);

  return (
    <div className="h-full w-full bg-windows-grey-shade-1 p-4 md:h-auto md:w-[38rem]">
      <form ref={formRef} onSubmit={sendEmail}>
        <div className="flex items-baseline gap-2">
          <label className="mb-2 block text-base font-bold text-windows-black">Name:</label>
          {errors.name && <span className="m-0 text-red-600">{errors.name}</span>}
        </div>
        <Input 
          type="text" 
          name="user_name" 
          boxClassName="mb-4"
          required 
        />
        <div className="flex items-baseline gap-2">
          <label className="mb-2 block text-base font-bold text-windows-black">Email:</label>
          {errors.email && (
            <span className="m-0 text-red-600">{errors.email}</span>
          )}
        </div>
        <Input 
          type="email" 
          name="user_email" 
          boxClassName="mb-4"
          required 
        />
        <div className="flex items-baseline gap-2">
          <label className="mb-2 block text-base font-bold text-windows-black">Message:</label>
          {errors.message && (
            <span className="m-0 text-red-600">{errors.message}</span>
          )}
        </div>
        <Input 
          as="textarea"
          name="message" 
          boxClassName="mb-4"
          className="h-48 resize-none"
          required 
        />
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            disabled={isSending}
          >
            Send
          </Button>
          {status && <p className="m-0 text-base text-windows-black">{status}</p>}
        </div>
      </form>
    </div>
  );
});

Message.displayName = "Message";

export default Message;
