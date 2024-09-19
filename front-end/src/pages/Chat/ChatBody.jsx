import { useEffect, useState, useRef, useCallback } from "react";
import { format } from "date-fns";
import PropTypes from "prop-types";
import useUser from "@hooks/useUser";
import useSocket from "@hooks/useSocket";

import { CornerDownRight } from "react-feather";
import Input from "@components/ui/Input";
import MessageSkeleton from "@components/skeleton/MessageSkeleton";
import ChatHeader from "./ChatHeader";
import ProfileCard from "@components/Profile/ProfileCard";
import TargetUserOptions from "@components/TargetUserOptions";

ChatBody.propTypes = {
  isLoading: PropTypes.bool,
  isMobile: PropTypes.bool,
  handleChatSidebarOpen: PropTypes.func,
  handleChatInfosOpen: PropTypes.func,
};

function ChatBody ({ isLoading = false, isMobile = false, handleChatSidebarOpen, handleChatInfosOpen }) {
  const { user } = useUser();
  const { socket } = useSocket();

  const [ chatHistory, setChatHistory ] = useState([]);
  const [ message, setMessage ] = useState("");
  const [ isSendingDisabled, setIsSendingDisabled ] = useState(false);
  const [ showTimeoutMessage, setShowTimeoutMessage ] = useState(false);

  const [ isUserModalOpen, setIsUserModalOpen ] = useState(false);
  const [ selectedUser, setSelectedUser ] = useState(null);
  const [ isProfileModalOpen, setIsProfileModalOpen ] = useState(false);

  const messagesEndRef = useRef(null);

  const chatName = location.pathname.split("/c/")[1];

  useEffect(() => {
    if (!socket) return; 
    
    socket.on("chatHistory", (history) => {
      setChatHistory(history);
    });
  
    socket.on("receiveMessage", (message) => {
      setChatHistory((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("chatHistory");
      socket.off("receiveMessage");
    };
  }, [socket, user, chatName]);

  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSend = useCallback(() => {
    if (!message.trim()) return; 

    if (isSendingDisabled) {
      setShowTimeoutMessage(true);
      return;
    }

    setMessage("");

    const messageInfos = {
      user,
      message,
    };

    const isWhisperChat = chatName.startsWith("@");
    
    socket.emit("sendMessage", isWhisperChat ? chatName.slice(1) : chatName, messageInfos);
    
    setIsSendingDisabled(true);

    setTimeout(() => {
      setIsSendingDisabled(false);
      setShowTimeoutMessage(false);
    }, 2000);

  }, [chatName, message, socket, user, isSendingDisabled]);

  const handleKeyDown = useCallback((e) => {
    if (e.key.toLowerCase() === "enter") {
      handleSend();
    }
  }, [handleSend]);

  const handleUserModal = useCallback((targetUser) => {
    if (targetUser.id === user.id) return;

    setSelectedUser(targetUser);
    setIsUserModalOpen(prev => !prev);
  }, [user]);

  const handleProfileCard = useCallback(() => {
    setIsUserModalOpen(prev => !prev);
    setIsProfileModalOpen(prev => !prev);
  }, []);

  const handleWhisperStart = useCallback((targetUser) => {
    if (targetUser.id === user.id) return;
  
    socket.emit("startWhisper", targetUser);
  }, [socket, user]);

  return (
    <div className="dark:bg-zinc-900 flex-1 relative bg-zinc-200 rounded-md overflow-hidden shadow-md flex flex-col justify-between">

      {isMobile && (
        <ChatHeader chatName={chatName} handleChatSidebarOpen={handleChatSidebarOpen} handleChatInfosOpen={handleChatInfosOpen} />
      )}

      <div className={"flex flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden p-5 pb-6"}>
        {isLoading ? (
          [1, 2, 3, 4, 5].map((_, index) => <MessageSkeleton key={index} />)
        ) : (
          chatHistory.length > 0 && chatHistory.map((messageInfos) => {
            const { user, message, timestamp } = messageInfos;

            return (
              <div key={`${user.username}${timestamp}`} className="flex gap-2 items-start relative">
                <img
                  src={user?.profile_picture_url}
                  alt="User profile picture"
                  className="w-8 h-8 bg-black rounded-full flex-shrink-0 cursor-pointer"
                  aria-label="Open guest actions"
                  onClick={() => handleUserModal(user)}
                />
                <div className="flex flex-col">
                  <span className="flex gap-3 items-center cursor-pointer" onClick={() => handleUserModal(user)}>
                    <p className="font-alternates font-semibold text-lg leading-5 dark:text-zinc-200 text-zinc-800">{user.username}</p>
                    <p className="font-light text-sm leading-5 dark:text-zinc-500 text-zinc-600">{format(timestamp, "p")}</p>
                  </span>
                  <p className="text-base leading-5 break-words break-all dark:text-zinc-400 text-zinc-600 max-w-full overflow-hidden">
                    {message}
                  </p>
                </div>
                <TargetUserOptions
                  user={user}
                  onWhisperStart={handleWhisperStart}
                  onProfileClick={handleProfileCard}
                  closeModal={() => setIsUserModalOpen(false)}
                  isOpen={isUserModalOpen && selectedUser === user}
                  onClose={() => setIsUserModalOpen(false)}
                />
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

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
      
      {isProfileModalOpen && (
        <ProfileCard
          handleProfileCard={handleProfileCard}
          targetUser={selectedUser}
          isOpen={isProfileModalOpen}
          onClose={handleProfileCard}
          withOverlay={true}
        />
      )}
    </div>
  );
}

export default ChatBody;
