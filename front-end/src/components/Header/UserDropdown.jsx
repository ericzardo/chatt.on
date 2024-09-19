import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "@hooks/useUser";

import { LogOut, User, Sun, Moon } from "react-feather";
import ProfileCard from "@components/Profile/ProfileCard";
import withClickOutside from "@components/hoc/withClickOutside";

import { toggleTheme } from "@utils/toggleTheme";

import authLogout from "@services/auth/authLogout";

function UserDropdown () {
  const { user, revalidateUser } = useUser();

  const navigate = useNavigate();

  const [themeIcon, setThemeIcon] = useState(() => window.localStorage.getItem("theme") || "dark");

  const [isMyAccountModalOpen, setIsMyAccountModalOpen ] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      const response = await authLogout();
      if (response) {
        await revalidateUser();
        navigate("/sign-in");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [navigate, revalidateUser]);

  const handleProfileCard = useCallback(() => {
    setIsMyAccountModalOpen(prev => !prev);
  }, []);

  const handleTheme = useCallback(() => {
    toggleTheme(setThemeIcon);
  }, []);

  const userMenuDropdown = [
    {
      label: "My Account",
      onClick: handleProfileCard,
      icon: User,
    },
    {
      label: themeIcon === "dark" ? "Light Mode" : "Dark Mode",
      onClick: handleTheme,
      icon: themeIcon === "dark" ? Sun : Moon,
    },
    {
      label: "Logout",
      onClick: handleLogout,
      icon: LogOut,
    },
  ];

  return (
    <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-100 dark:bg-zinc-800 rounded-md overflow-hidden shadow-sm z-10">
      <ul>
        {userMenuDropdown.map(({ label, onClick, icon: Icon }) => (
          <li
            key={label}
            onClick={onClick}
            className="px-4 py-2 cursor-pointer hover:bg-zinc-200 hover:dark:bg-zinc-700 text-zinc-700 dark:text-zinc-400 flex items-center gap-2 hover:dark:text-zinc-300 hover:text-zinc-900"
            aria-label={label}
          >
            <div className="flex items-center gap-2">
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </div>
          </li>
        ))}
      </ul>
      {isMyAccountModalOpen && (
        <ProfileCard
          handleProfileCard={handleProfileCard}
          targetUser={user}
          isOpen={isMyAccountModalOpen}
          onClose={handleProfileCard}
          withOverlay={true}
        />
      )}
    </div>
  );
}
const UserDropdownWithHandled = withClickOutside(UserDropdown);

export default UserDropdownWithHandled;