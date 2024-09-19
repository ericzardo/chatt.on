import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import UsernameAndAvatarModalRoot from "./Root";
import UsernameAndAvatarModalTitle from "./Title";
import UsernameAndAvatarModalAvatarSelection from "./AvatarSelection";
import UsernameAndAvatarModalUsernameForm from "./UsernameForm";
import withClickOutside from "@components/hoc/withClickOutside";

UsernameAndAvatarModal.propTypes = {
  chat: PropTypes.object.isRequired,
  onClose: PropTypes.func,
};

function UsernameAndAvatarModal ({ chat, onClose }) {
  const navigate = useNavigate();

  const [selectedAvatar, setSelectedAvatar] = useState(0);

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
    
        <UsernameAndAvatarModalAvatarSelection selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar} />
        <UsernameAndAvatarModalUsernameForm chat={chat} selectedAvatar={selectedAvatar} />
    
      </div>
    </UsernameAndAvatarModalRoot>
  );
    

}

const UsernameAndAvatarModalWithHandled = withClickOutside(UsernameAndAvatarModal);

export default UsernameAndAvatarModalWithHandled;
