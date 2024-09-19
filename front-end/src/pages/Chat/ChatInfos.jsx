import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import useUser from "@hooks/useUser";
import useSocket from "@hooks/useSocket";

import { X } from "react-feather";
import ProfileCard from "@components/Profile/ProfileCard";
import ListItemSkeleton from "@components/skeleton/ListItemSkeleton";
import TargetUserOptions from "@components/TargetUserOptions";

ChatInfos.propTypes = {
  isLoading: PropTypes.bool,
  isMobile: PropTypes.bool,
  isChatInfosOpen: PropTypes.bool,
  handleChatInfosOpen: PropTypes.func,
};

function ChatInfos ({ isLoading = false, isMobile = false, isChatInfosOpen, handleChatInfosOpen }) {
  const { user } = useUser();
  const { socket } = useSocket();
  
  const [ onlineUsers, setOnlineUsers ] = useState([]);
  const [ offlineUsers, setOfflineUsers ] = useState([]);

  const [ isUserModalOpen, setIsUserModalOpen ] = useState(false);
  const [ selectedUser, setSelectedUser ] = useState(null);
  const [ isProfileModalOpen, setIsProfileModalOpen ] = useState(false);

  useEffect(() => {
    if (!socket || !user) return;

    socket.on("onlineUsers", (userList) => {
      setOnlineUsers(userList);
    });

    socket.on("offlineUsers", (userList) => {
      setOfflineUsers(userList);
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("offlineUsers");
    };

  }, [socket, user]);

  const handleUserModal = useCallback((targetUser) => {
    if (targetUser.id === user.id) return;

    setSelectedUser(targetUser);
    setIsUserModalOpen(prev => !prev);
  }, [user]);

  const handleWhisperStart = useCallback((targetUser) => {
    if (targetUser.id === user.id) return;
  
    socket.emit("startWhisper", targetUser);
  }, [socket, user]);

  const handleProfileCard = useCallback(() => {
    setIsUserModalOpen(prev => !prev);
    setIsProfileModalOpen(prev => !prev);
  }, []);

  return (
    <aside className={`${isMobile && !isChatInfosOpen ? "hidden" : "flex"} ${isMobile && isChatInfosOpen ? "fixed z-50 top-0 right-0 min-w-full h-full dark:bg-zinc-800 bg-zinc-300" : ""}${!isMobile ? "max-w-60 dark:bg-zinc-900/55 bg-zinc-200" : ""} flex-col flex-1 p-2.5 gap-3 rounded-md overflow-hidden shadow-md`}>
      {isMobile && isChatInfosOpen && (
        <X 
          onClick={handleChatInfosOpen}
          className="w-6 h-6 absolute text-zinc-500 flex items-center justify-center right-4 top-4 cursor-pointer
           transition-all hover:text-red-700 hover:dark:text-red-500 hover:scale-110"
        />
      )}

      <span className="flex flex-col justify-center px-2 py-2">

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

        <h1 className="uppercase font-semibold font-alternates text-sm leading-7 text-zinc-500 dark:text-zinc-400">off-line {!isLoading ? `- ${offlineUsers?.length || 0}` : ""}</h1>

        <ul className="flex flex-col py-4 gap-3 cursor-pointer opacity-60 sidebar-menu-nav-items">
          {isLoading ? (
            [1, 2, 3, 4, 5].map((_, index) => <ListItemSkeleton key={index} />)
          ) : (
            offlineUsers.length > 0 && offlineUsers.map((user) => (
              <li key={user.username} onClick={() => handleUserModal(user)} className="flex gap-2 p-1 rounded-lg items-center relative">
                <img
                  src={user?.profile_picture_url}
                  alt="User profile picture"
                  className="w-10 h-10 bg-black rounded-full"
                />
                <p className="font-alternates font-semibold text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {user.username}
                </p>
                {isUserModalOpen && selectedUser === user && (
                  <ul className="flex flex-col absolute z-10 top-full left-0 rounded-md shadow-sm overflow-hidden dark:bg-zinc-800 bg-zinc-300">
                    <li 
                      className="p-2 cursor-pointer text-sm font-alternates font-semibold uppercase hover:dark:bg-zinc-700 hover:bg-zinc-400/20
                      text-zinc-700 dark:text-zinc-400 hover:text-zinc-800 hover:dark:text-zinc-300"
                      onClick={handleProfileCard}
                    >
                      See Profile
                    </li>
                  </ul>
                )}
              </li>
            ))
          )}
        </ul>

      </span>

      {isProfileModalOpen && (
        <ProfileCard
          handleProfileCard={handleProfileCard}
          targetUser={selectedUser}
          isOpen={isProfileModalOpen}
          onClose={handleProfileCard}
          withOverlay={true}
        />
      )}

    </aside>
  );
}

export default ChatInfos;