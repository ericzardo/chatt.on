import { useCallback, useState } from "react";
import useSocket from "@hooks/useSocket";

import Input from "@components/ui/Input";
import { CornerDownRight } from "react-feather";

import { handleSendMessage } from "src/controller/websocket";

function SendMessage () {
  const chatName = location.pathname.split("/c/")[1];

  const { socket } = useSocket();

  const [ message, setMessage ] = useState("");
  const [ isSendingDisabled, setIsSendingDisabled ] = useState(false);
  const [ showTimeoutMessage, setShowTimeoutMessage ] = useState(false);

  const handleSend = useCallback(() => {
    if (!message.trim()) return; 

    if (isSendingDisabled) {
      setShowTimeoutMessage(true);
      return;
    }

    setMessage("");
    
    handleSendMessage(socket, message, chatName);
    
    setIsSendingDisabled(true);

    setTimeout(() => {
      setIsSendingDisabled(false);
      setShowTimeoutMessage(false);
    }, 2000);

  }, [message, socket, isSendingDisabled, chatName]);

  const handleKeyDown = useCallback((e) => {
    if (e.key.toLowerCase() === "enter") {
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className="px-5 pb-10">
      <span className="relative w-full flex mx-auto min-w-max max-w-[700px]">
        <Input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className={`absolute right-0 top-0 h-full font-semibold text-base font-alternates leading-relaxed rounded-lg px-4 py-1 flex items-center justify-center gap-1 
          bg-blue-500 hover:bg-blue-600 hover:dark:bg-blue-500/75 text-zinc-200 hover:text-zinc-100`}
          onClick={handleSend}
          disabled={isSendingDisabled}
        >
        Send
          <CornerDownRight className="h-6 w-6 text-zinc-200 hover:text-zinc-100" />
        </button>
        {showTimeoutMessage && (
          <p className="absolute top-full text-xs dark:text-red-500 text-red-600 font-alternates leading-relaxed">You are sending messages too fast</p>
        )}
      </span>
    </div>
  );
}

export default SendMessage;