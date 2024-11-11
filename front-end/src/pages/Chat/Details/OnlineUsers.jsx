import { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";

import useUser from "@hooks/useUser";
import useSocket from "@hooks/useSocket";

import ListItemSkeleton from "@components/skeleton/ListItemSkeleton";
import TargetUserOptions from "@components/TargetUserOptions";

OnlineUsers.propTypes = {
  isLoading: PropTypes.bool,
  handleUserModal: PropTypes.func,
  handleProfileCard: PropTypes.func,
  setIsUserModalOpen: PropTypes.func,
  selectedUser: PropTypes.object,
  isUserModalOpen: PropTypes.bool,
};

function OnlineUsers ({ isLoading = false, handleUserModal, handleProfileCard, setIsUserModalOpen, selectedUser, isUserModalOpen }) {
  const { user } = useUser();
  const { socket } = useSocket();

  const [ onlineUsers, setOnlineUsers ] = useState([]);
  
  const chatName = location.pathname.split("/c/")[1];

  const handleWhisperStart = useCallback((targetUser) => {
    if (targetUser.id === user.id) return;
  
    socket.emit("startWhisper", targetUser);
  }, [socket, user]);

  useEffect(() => {
    if (!socket || !user || !chatName) return;

    socket.on("ONLINE_USERS", (usersList) => {
      setOnlineUsers(usersList);
    });

    return () => {
      socket.off("ONLINE_USERS");
    };
  }, [socket, user, chatName]);

  return (
    <>
      <h1 className="uppercase font-semibold font-alternates text-sm leading-7 text-zinc-500 dark:text-zinc-400">on-line {!isLoading ? `- ${onlineUsers?.length || 0}` : ""}</h1>

      <ul className="flex flex-col py-4 gap-3 cursor-pointer sidebar-menu-nav-items">
        {isLoading ? (
          [1, 2, 3, 4, 5].map((_, index) => <ListItemSkeleton key={index} />)
        ) : (
          onlineUsers.length > 0 && onlineUsers.map((user) => (
            <li key={user.username} onClick={() => handleUserModal(user)} className="flex gap-2 p-1 rounded-lg items-center relative">
              <img
                src={user?.profile_picture_url}
                alt="User profile picture"
                className="w-10 h-10 bg-black rounded-full"
              />
              <p className="font-alternates font-semibold text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
                {user.username}
              </p>
              <TargetUserOptions
                user={user}
                onWhisperStart={handleWhisperStart}
                onProfileClick={() => handleProfileCard(user)}
                closeModal={() => setIsUserModalOpen(false)}
                isOpen={isUserModalOpen && selectedUser === user}
                onClose={() => setIsUserModalOpen(false)}
              />
            </li>
          ))
        )}
      </ul>
    </>
    
  );
}

export default OnlineUsers;