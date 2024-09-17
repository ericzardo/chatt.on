import { useCallback } from "react";
import PropTypes from "prop-types";

import { ArrowLeft, Link, Users } from "react-feather";
import useNotification from "@hooks/useNotification";

ChatHeader.propTypes = {
  chatName: PropTypes.string.isRequired,
  handleChatSidebarOpen: PropTypes.func.isRequired,
  handleChatInfosOpen: PropTypes.func.isRequired,
};

function ChatHeader ({ chatName, handleChatSidebarOpen, handleChatInfosOpen }) {
  const { handleNotification } = useNotification();

  const copyLinkToClipboard = useCallback(() => {
    const chatLink = window.location.href;
    navigator.clipboard.writeText(chatLink).then(() => {
      handleNotification({
        model: "success",
        message: "Link copied successfully"
      });
    }).catch(() => {
      console.error("Failed to copy link");
    });
  }, [handleNotification]);

  return (

    <div className="sticky top-0 left-0 flex w-full justify-between items-center px-6 py-2 dark:bg-zinc-950/20 bg-zinc-300/80">
      <span className="flex gap-3 justify-between items-center">

        <ArrowLeft onClick={handleChatSidebarOpen} className="dark:text-zinc-400 text-zinc-600 hover:dark:text-zinc-300 hover:text-zinc-800 cursor-pointer" />
        <h1 className="uppercase font-bold font-alternates text-3xl leading-relaxed text-zinc-900 dark:text-zinc-100">
          {chatName || "ERROR"}
        </h1>
      </span>
      <span className="flex gap-3 items-center dark:text-zinc-400 text-zinc-600">
        <Link onClick={copyLinkToClipboard} className="cursor-pointer hover:dark:text-zinc-300 hover:text-zinc-800" />
        <Users onClick={handleChatInfosOpen} className="cursor-pointer hover:dark:text-zinc-300 hover:text-zinc-800" />
      </span>
          
    </div>

    
  );
}

export default ChatHeader;