import PropTypes from "prop-types";

import MessageContainer from "./MessageContainer";
import SendMessage from "./SendMessage";
import ChatHeader from "../ChatHeader";

ChatBody.propTypes = {
  isLoading: PropTypes.bool,
  isMobile: PropTypes.bool,
  handleChatSidebarOpen: PropTypes.func,
  handleChatInfosOpen: PropTypes.func,
};

function ChatBody ({ isLoading = false, isMobile = false, handleChatSidebarOpen, handleChatInfosOpen }) {
  const chatName = location.pathname.split("/c/")[1];

  return (
    <div className="dark:bg-zinc-900 flex-1 relative bg-zinc-200 rounded-md overflow-hidden shadow-md flex flex-col justify-between">

      {isMobile && (
        <ChatHeader chatName={chatName} handleChatSidebarOpen={handleChatSidebarOpen} handleChatInfosOpen={handleChatInfosOpen} />
      )}

      <MessageContainer isLoading={isLoading} />
      <SendMessage />

    </div>
  );
}

export default ChatBody;
