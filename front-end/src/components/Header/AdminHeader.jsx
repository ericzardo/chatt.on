import { useState, useCallback } from "react";
import useUser from "@hooks/useUser";

import HeaderNavMobile from "./NavMobile";
import UserDropdown from "./UserDropdown";

function AdminHeader () {
  const { user } = useUser();

  const [ isUserDropdownVisible, setIsUserDropdownVisible ] = useState(false);

  const handleUserDropdown = useCallback(() => {
    setIsUserDropdownVisible(prev => !prev);
  }, []);

  return (
    <div className="flex flex-1 max-h-[76px] items-center justify-between px-4 py-5 min-h-[72.75px] bg-zinc-200 dark:bg-zinc-950/55">

      <HeaderNavMobile />

      <div className="relative flex items-center gap-2 cursor-pointer">
        <p className="font-alternates text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{user.username}</p>

        <img
          src={user?.profile_picture_url}
          alt="User profile picture"
          className="w-9 h-9 bg-black rounded-full border-2 border-blue-900"
          aria-label="Open user menu"
          onClick={handleUserDropdown}
        />

        {isUserDropdownVisible && (
          <UserDropdown />
        )}
      </div>

    </div>
  );
}

export default AdminHeader;