import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { X } from "react-feather";
import ListItemSkeleton from "@components/skeleton/ListItemSkeleton";

import removeUserChat from "@services/users/removeUserChat";
import useUser from "@hooks/useUser";
import useSocket from "@hooks/useSocket";

ChatSideBar.propTypes = {
  isLoading: PropTypes.bool,
  isMobile: PropTypes.bool,
  isChatSidebarOpen: PropTypes.bool,
  handleChatSidebarOpen: PropTypes.func,
};


function ChatSideBar ({ isLoading = false, isMobile = false, isChatSidebarOpen, handleChatSidebarOpen }) {
  const navigate = useNavigate();

  const { user, revalidateUser } = useUser();
  const { socket } = useSocket();

  const chatName = location.pathname.split("/c/")[1];
  
  const [ currentSelection, setCurrentSelection ] = useState(null);
  const [ userWhispers, setUserWhispers ] = useState([]);

  useEffect(() => {
    if (!chatName) return;
    
    const isWhisperChat = chatName.startsWith("@");

    if (isWhisperChat) {
      const selection = userWhispers.find(user => user.username === chatName.slice(1)) || userWhispers[0];
      setCurrentSelection(selection);
    } else {
      const selection = user?.chats.find(chat => chat.name === chatName) || user?.chats[0];
      setCurrentSelection(selection);
    }

  }, [chatName, user?.chats, userWhispers, setCurrentSelection]);

  useEffect(() => {
    if (!socket) return;

    socket.on("whisperStarted", (data) => {
      const { targetUser } = data;
      
      const whisperExists = userWhispers.some((user) => user.id === targetUser.id);
  
      if (whisperExists) return;
  
      setUserWhispers([...userWhispers, targetUser]);
      
      setCurrentSelection(targetUser);
      navigate(`/c/@${targetUser.username}`);
    });

    socket.on("receiveWhisper", (data) => {
      const { targetUser } = data;

      const whisperExists = userWhispers.some((user) => user.id === targetUser.id);
  
      if (whisperExists) return;
  
      setUserWhispers([...userWhispers, targetUser]);
    });

    socket.on("chatsUpdated", async () => {
      await revalidateUser();
    });

    return () => {
      socket.off("whisperStarted");
      socket.off("receiveWhisper");
      socket.off("chatsUpdated");
    };
  }, [userWhispers, socket, navigate, chatName, user?.chats, revalidateUser, currentSelection]);

  const handleCurrentSelection = useCallback((object) => {
    if (object.name) {
      navigate(`/c/${object.name}`);
    }
    if (object.username) {
      navigate(`/c/@${object.username}`);
    }
   
    handleChatSidebarOpen();
  }, [handleChatSidebarOpen, navigate]);

  const removeWhisper = useCallback((targetUser) => {
    setUserWhispers((prevUserWhispers) =>
      prevUserWhispers.filter((user) => user.username !== targetUser.username)
    );

    if (chatName.startsWith("@") && chatName.slice(1) === targetUser.username) {
      handleCurrentSelection(user?.chats[0]);
    }

  }, [chatName, handleCurrentSelection, user?.chats]);

  const handleRemoveChat = async (chat) => {
    const response = await removeUserChat(chat);
  
    if (!response) return;
    await revalidateUser();

    if (user?.chats.length - 1 === 0) {
      navigate("/");
    } else {
      navigate(`/c/${user?.chats[0].name}`);
    }
  };

  return (
    <aside className={`${isMobile && !isChatSidebarOpen ? "hidden" : "flex"} ${isMobile && isChatSidebarOpen ? "fixed z-50 top-0 left-0 min-w-72 w-fit h-full dark:bg-zinc-800 bg-zinc-300" : ""}${!isMobile ? "max-w-60 dark:bg-zinc-900/55 bg-zinc-200" : ""} flex-col flex-1 p-2.5 gap-3 rounded-md overflow-hidden shadow-md`}>
      {isMobile && isChatSidebarOpen && (
        <X 
          onClick={handleChatSidebarOpen}
          className="w-6 h-6 absolute right-2 text-zinc-500 flex items-center justify-center cursor-pointer
           transition-all hover:text-red-700 hover:dark:text-red-500 hover:scale-110"
        />
      )}

      <span className="flex flex-col justify-center px-2 py-2 max-[1025px]:cursor-pointer">

        <h1 className="uppercase font-bold font-alternates text-2xl leading-relaxed text-zinc-900 dark:text-zinc-50">Chats</h1>

        <ul className="flex flex-col py-4 gap-3 sidebar-menu-nav-items">

          {isLoading ? [1, 2, 3].map((_, index) => (
            <ListItemSkeleton key={index} />
          )) : (
            user.chats.length > 0 && user.chats.map((chat, index) => (
              <li
                key={chat.name}
                className={`flex gap-2 p-1 rounded-lg items-center justify-between cursor-pointer 
                  ${currentSelection === chat && !isMobile ? "dark:bg-zinc-800 bg-zinc-400/40" : "bg-transparent"}
                  ${currentSelection === chat && isMobile ? "dark:bg-zinc-900/40 bg-zinc-400/40" : "bg-transparent"}`}
                onClick={() => handleCurrentSelection(chat)}
                aria-label={`Open ${chat.name} chat`}
                tabIndex={index}
              >
                <span className="flex gap-2 items-center">
                  <span className="w-10 h-10 bg-black rounded-xl"></span>
                  <p className="font-alternates font-semibold text-lg leading-relaxed text-zinc-900 dark:text-zinc-300">
                    {chat.name}
                  </p>
                </span>
  
                {!user.is_temporary_user && (
                  <X
                    onClick={() => handleRemoveChat(chat)}
                    className="w-5 h-5 dark:text-zinc-500 text-zinc-700 flex items-center justify-center cursor-pointer transition-all hover:text-zinc-800 hover:dark:text-zinc-400 hover:scale-x-105"
                    aria-label={`Remove ${chat.name}`}
                  />
                )}
      
              </li>
            ))
          )}
        </ul>

        {userWhispers?.length > 0 && (
          <>
            <h1 className="uppercase font-bold font-alternates text-2xl leading-relaxed text-zinc-900 dark:text-zinc-50">Whispers</h1>

            <ul className="flex flex-col py-4 gap-3 sidebar-menu-nav-items">
              {userWhispers.map((user, index) => (
                <li
                  key={user.username}
                  className={`flex gap-2 p-1 rounded-lg items-center justify-between cursor-pointer
                    ${currentSelection === user && !isMobile ? "dark:bg-zinc-800 bg-zinc-400/40" : "bg-transparent"}
                    ${currentSelection === user && isMobile ? "dark:bg-zinc-900/40 bg-zinc-400/40" : "bg-transparent"}`}
                  onClick={() => handleCurrentSelection(user)}
                  aria-label={`Open ${user.username} conversation`}
                  tabIndex={index}
                >
                  <span className="flex gap-2 items-center">
                    <span className="w-10 h-10 bg-black rounded-full"></span>
                    <p className="font-alternates font-semibold text-lg leading-relaxed text-zinc-800 dark:text-zinc-400">
                      {user.username}
                    </p>
                  </span>

                  <X
                    onClick={(event) => {
                      event.stopPropagation();
                      removeWhisper(user);
                    }}
                    className="w-5 h-5 dark:text-zinc-500 text-zinc-700 flex items-center justify-center cursor-pointer transition-all hover:text-zinc-800 hover:dark:text-zinc-400 hover:scale-x-105"
                  />
                  
      
                </li>
              ))}
            </ul>
            
          </>
        )}

      </span>

    </aside>
  );
}

export default ChatSideBar;