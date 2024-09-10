import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import useUser from "@hooks/useUser";

import { X, Edit3 } from "react-feather";
import Button from "@components/ui/Button";
import RoleCard from "@components/RoleCard";
import EditProfile from "./EditProfile";

ProfileCard.propTypes = {
  handleProfileCard: PropTypes.func.isRequired,
  targetUser: PropTypes.object,
};

function ProfileCard ({ handleProfileCard, targetUser }) {
  const { user } = useUser();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const handleEditProfile = useCallback(() => {
    setIsEditProfileOpen(prev => !prev);
  }, []);

  const isMyProfile = targetUser === user;

  const displayedUser = isMyProfile ? user : targetUser;

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 flex items-center justify-center">
      <div className="bg-zinc-100 dark:bg-zinc-900 rounded-xl mx-2 md:m-0 p-5 flex flex-col max-w-[640px] min-w-96">

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

        <div className="flex justify-between items-center gap-10 py-4">
          <span className="flex items-center gap-3">
            <div className="w-28 h-28 relative rounded-full border-2 bg-black border-blue-900"></div>

            <span className="flex flex-col gap-2">
              <p className="font-semibold text-lg dark:text-zinc-200 text-zinc-800">
                {displayedUser?.username}
              </p>
              <span className="flex gap-2 flex-wrap max-w-40">
                {displayedUser?.roles?.length  ? (
                  displayedUser?.roles.map(role => (
                    <RoleCard key={role.name} name={role.name} />
                  ))
                ) : (
                  <RoleCard key="user" name="user" />
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
            <EditProfile handleEditProfile={handleEditProfile} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
