import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import useUser from "@hooks/useUser";

import { X } from "react-feather";
import ProfileCard from "@components/Profile/ProfileCard";

import OnlineUsers from "./OnlineUsers";
import OfflineUsers from "./OfflineUsers";

ChatDetails.propTypes = {
  isLoading: PropTypes.bool,
  isMobile: PropTypes.bool,
  isChatInfosOpen: PropTypes.bool,
  handleChatInfosOpen: PropTypes.func,
};

function ChatDetails ({ isLoading = false, isMobile = false, isChatInfosOpen, handleChatInfosOpen }) {

  const { user } = useUser();

  const [ isUserModalOpen, setIsUserModalOpen ] = useState(false);
  const [ selectedUser, setSelectedUser ] = useState(null);
  const [ isProfileModalOpen, setIsProfileModalOpen ] = useState(false);

  const handleUserModal = useCallback((targetUser) => {
    if (targetUser.id === user.id) return;

    setSelectedUser(targetUser);
    setIsUserModalOpen(prev => !prev);
  }, [user]);

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

        <OnlineUsers 
          isLoading={isLoading}
          handleProfileCard={handleProfileCard}
          handleUserModal={handleUserModal}
          isUserModalOpen={isUserModalOpen}
          selectedUser={selectedUser}
          setIsUserModalOpen={setIsUserModalOpen}
        />

        <OfflineUsers
          isLoading={isLoading}
          handleProfileCard={handleProfileCard}
          handleUserModal={handleUserModal}
          isUserModalOpen={isUserModalOpen}
          selectedUser={selectedUser}
        />

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

export default ChatDetails;