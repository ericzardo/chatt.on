import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import useUser from "@hooks/useUser";
import useSocket from "@hooks/useSocket";
import useNotification from "@hooks/useNotification";

import UsernameAndAvatarModal from "@components/modals/UsernameAndAvatarModal";

import getChatByName from "@services/chats/getChatByName";


AuthProtection.propTypes = {
  children: PropTypes.node.isRequired,
};

function AuthProtection ({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, revalidateUser } = useUser();
  const { isSocketConnected } = useSocket();
  const { handleNotification } = useNotification();

  const chatName = location.pathname.split("/c/")[1];

  const [ chatSelected, setChatSelected ] = useState(null);

  useEffect(() => {

    const handleChatRoomProtection = async () => {
      if (!chatName || chatName.slice(0,1) === "@") return;

      await getChatByName(chatName).then((chat) => {
        setChatSelected(chat);
      }).catch((error) => {
        handleNotification({
          model: "error",
          message: error.message || "An unexpected error occurred.",
        });
        navigate("/");
      });

    };

    handleChatRoomProtection();

  }, [user, revalidateUser, navigate, chatName, handleNotification]);

  const closeGuestUserModal = useCallback(() => {
    console.log("B");
    setChatSelected(null);
    navigate("/");
  }, [navigate]);

  const shouldShowUsernameModal = chatSelected && !user && !isSocketConnected;
  
  if (shouldShowUsernameModal) {
    return (
      <UsernameAndAvatarModal
        chat={chatSelected} 
        onClose={closeGuestUserModal}
        isOpen={shouldShowUsernameModal}
        withOverlay={true}
      />
    );
  }

  return children;
}

export default AuthProtection;
