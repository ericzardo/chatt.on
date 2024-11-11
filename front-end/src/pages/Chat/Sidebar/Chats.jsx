import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import useUser from "@hooks/useUser";
import useSocket from "@hooks/useSocket";
import removeUserChat from "@services/users/removeUserChat";

import ListItemSkeleton from "@components/skeleton/ListItemSkeleton";
import { X } from "react-feather";

Chats.propTypes = {
  isLoading: PropTypes.bool,
  isMobile: PropTypes.bool,
  currentSelection: PropTypes.object,
  handleCurrentSelection: PropTypes.func,
};

function Chats ({ isLoading = false, isMobile = false, currentSelection, handleCurrentSelection }) {
  const navigate = useNavigate();

  const { user, revalidateUser } = useUser();
  const { socket } = useSocket();

  const chatName = location.pathname.split("/c/")[1];

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

  useEffect(() => {
    if (!socket) return;

    socket.on("CHATS_UPDATED", async () => {
      await revalidateUser();
    });

    return () => {
      socket.off("CHATS_UPDATED");
    };
  }, [socket, chatName, user?.chats, revalidateUser, currentSelection, handleCurrentSelection]);

  useEffect(() => {
    if (!chatName) return;
    
    const isWhisperChat = chatName.startsWith("@");  

    if (isWhisperChat) return;

    const selection = user?.chats.find(chat => chat.name === chatName) || user?.chats[0];
    
    handleCurrentSelection(selection);
    
  }, [chatName, user?.chats, handleCurrentSelection]);


  return (
    <>
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
    </>
  );
}

export default Chats;