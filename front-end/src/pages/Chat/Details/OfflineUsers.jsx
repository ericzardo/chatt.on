import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

import useUser from "@hooks/useUser";
import useSocket from "@hooks/useSocket";

import ListItemSkeleton from "@components/skeleton/ListItemSkeleton";

OfflineUsers.propTypes = {
  isLoading: PropTypes.bool,
  handleUserModal: PropTypes.func,
  handleProfileCard: PropTypes.func,
  selectedUser: PropTypes.object,
  isUserModalOpen: PropTypes.bool,
};

function OfflineUsers ({ isLoading = false, handleUserModal, handleProfileCard, selectedUser, isUserModalOpen }) {
  const location = useLocation();

  const { user } = useUser();
  const { socket } = useSocket();

  const [ offlineUsers, setOfflineUsers ] = useState([]);

  const chatName = location.pathname.split("/c/")[1];

  useEffect(() => {
    if (!socket || !user || !chatName) return;
    socket.on("OFFLINE_USERS", (usersList) => {
      setOfflineUsers(usersList);
    });

    return () => {
      socket.off("OFFLINE_USERS");
    };
  }, [socket, user, chatName]);


  return (
    <>
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
    </>
  );
}

export default OfflineUsers;