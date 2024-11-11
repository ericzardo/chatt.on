import { useCallback, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";

import useUser from "@hooks/useUser";
import useSocket from "@hooks/useSocket";

import TargetUserOptions from "@components/TargetUserOptions";
import ProfileCard from "@components/Profile/ProfileCard";
import MessageSkeleton from "@components/skeleton/MessageSkeleton";

MessageContainer.propTypes = {
  isLoading: PropTypes.bool,
};



function MessageContainer ({isLoading = false}) {
  const { user } = useUser();
  const { socket } = useSocket();

  const [ chatHistory, setChatHistory ] = useState([]);
  const [ isUserModalOpen, setIsUserModalOpen ] = useState(false);
  const [ selectedUser, setSelectedUser ] = useState(null);
  const [ isProfileModalOpen, setIsProfileModalOpen ] = useState(false);


  const chatName = location.pathname.split("/c/")[1];
  const messagesEndRef = useRef(null);

  const handleUserModal = useCallback((targetUser) => {
    if (targetUser.id === user.id) return;

    setSelectedUser(targetUser);
    setIsUserModalOpen(prev => !prev);
  }, [user]);

  const handleWhisperStart = useCallback((targetUser) => {
    if (targetUser.id === user.id) return;
  
    socket.emit("WHISPER_START", { targetUser });
  }, [socket, user]);

  const handleProfileCard = useCallback(() => {
    setIsUserModalOpen(prev => !prev);
    setIsProfileModalOpen(prev => !prev);
  }, []);

  useEffect(() => {
    if (!socket) return; 
    
    socket.on("CHAT_HISTORY", (history) => {
      setChatHistory(history);
    });
  
    socket.on("RECEIVE_MESSAGE", (message) => {
      setChatHistory((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("CHAT_HISTORY");
      socket.off("RECEIVE_MESSAGE");
    };
  }, [socket, user, chatName]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);
  

  return (
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

export default MessageContainer;