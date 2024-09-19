import { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import useUser from "@hooks/useUser";

import { X, Edit3 } from "react-feather";
import Button from "@components/ui/Button";
import RoleCard from "@components/RoleCard";
import EditProfile from "./EditProfile";
import withClickOutside from "@components/hoc/withClickOutside";

ProfileCard.propTypes = {
  handleProfileCard: PropTypes.func.isRequired,
  targetUser: PropTypes.object,
};

function ProfileCard ({ handleProfileCard, targetUser }) {
  const { user } = useUser();

  const [ isEditProfileOpen, setIsEditProfileOpen ] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  },  [user]);

  const handleEditProfile = useCallback(() => {
    setIsEditProfileOpen(prev => !prev);
  }, []);

  const isMyProfile = targetUser === user;

  const displayedUser = isMyProfile ? user : targetUser;

  return (
    <div className="bg-zinc-100 dark:bg-zinc-900 rounded-xl mx-2 md:m-0 p-5 flex flex-col max-w-[640px]">

      <span className="flex justify-between gap-6">
        <p className="font-semibold font-alternates text-xl leading-snug text-zinc-900 dark:text-zinc-50">
          {isMyProfile ? "My account" : "Profile"}
        </p>
        <X 
          onClick={handleProfileCard}
          className="w-5 h-5 text-zinc-500 flex items-center justify-center cursor-pointer
          transition-all hover:text-red-700 hover:dark:text-red-500 hover:scale-110"
        />
      </span>

      <div className={`${isMobile ? "justify-start" : "justify-between"} flex justify-between items-center gap-10 py-4`}>
        <span className={`flex gap-3 ${isMobile ? "flex-col" : "items-center"}`}>
          <img
            src={displayedUser?.profile_picture_url}
            alt="User profile picture"
            className="w-28 h-28 relative rounded-full border-2 bg-black border-blue-900"
          />

          <span className="flex flex-col gap-2">
            <p className="font-semibold text-lg dark:text-zinc-200 text-zinc-800">
              {displayedUser?.username}
            </p>
            <span className="flex gap-2 flex-wrap max-w-40">
              {displayedUser?.roles?.length  ? (
                displayedUser?.roles.map(role => (
                  <RoleCard key={role.name} role={role} />
                ))
              ) : (
                <RoleCard key="user" />
              )}
            </span>
          </span>
        </span>

        {isMyProfile && (
          <Button type="button" size="sm" onClick={handleEditProfile}>
              Edit
            <Edit3 />
          </Button>
        )}

        {isEditProfileOpen && (
          <EditProfile
            handleEditProfile={handleEditProfile}
            isMobile={isMobile} 
            onClose={handleEditProfile}
            isOpen={isEditProfileOpen}
            withOverlay={true}
          />
        )}
      </div>
    </div>
  );
}

const ProfileCardWithHandled = withClickOutside(ProfileCard);

export default ProfileCardWithHandled;
