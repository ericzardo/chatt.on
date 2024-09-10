import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import UsernameAndAvatarModalRoot from "./Root";
import UsernameAndAvatarModalTitle from "./Title";
import UsernameAndAvatarModalAvatarSelection from "./AvatarSelection";
import UsernameAndAvatarModalUsernameForm from "./UsernameForm";

UsernameAndAvatarModal.propTypes = {
  chat: PropTypes.object.isRequired,
  onClose: PropTypes.func,
};

function UsernameAndAvatarModal ({ chat, onClose }) {
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    if (!onClose) return;
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (chat) return;

    navigate("/");
  }, [chat, navigate]);

  return chat && (
    <UsernameAndAvatarModalRoot>
      <UsernameAndAvatarModalTitle title="Choose your avatar and username" onClose={handleClose} />
      <div className="flex md:flex-row flex-col md:gap-4 gap-8">
    
        <UsernameAndAvatarModalAvatarSelection />
        <UsernameAndAvatarModalUsernameForm chat={chat} />
    
      </div>
    </UsernameAndAvatarModalRoot>
  );
    

}

export default UsernameAndAvatarModal;
