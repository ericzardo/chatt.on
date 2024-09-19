import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";
import useUser from "@hooks/useUser";

import { Menu, Sun, Moon, LogOut, User } from "react-feather";
import ProfileCard from "@components/Profile/ProfileCard";

import { toggleTheme } from "@utils/toggleTheme";

import authLogout from "@services/auth/authLogout";

HamburguerMenu.propTypes = {
  toggleHamburguerMenuOpen: PropTypes.func.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
};

const linksPropDefault = [
  { href: "/", label: "Rooms" },
  { href: "#", label: "About" },
  { href: "#", label: "Pricing" },
];

function HamburguerMenu ({ toggleHamburguerMenuOpen, links = linksPropDefault }) {
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

  const userActions = [
    user && {
      label: "My Account",
      icon: User,
      onClick: handleProfileCard,
    },
    {
      label: themeIcon === "dark" ? "Light Mode" : "Dark Mode",
      icon: themeIcon === "dark" ? Sun : Moon,
      onClick: handleTheme,
    },
    user && {
      label: "Logout",
      icon: LogOut,
      onClick: handleLogout,
    },
  ].filter(Boolean);

  return (
    <aside className="fixed z-50 top-0 left-0 right-0 h-full flex flex-col px-8 py-4 max-w-60 gap-3 bg-zinc-200 dark:bg-zinc-800 rounded-md overflow-hidden shadow-xl">

      <div 
        onClick={toggleHamburguerMenuOpen}
        className="header-hamburguer-menu-icon text-zinc-800 dark:text-zinc-200 w-10 h-24 flex items-center justify-center"
        aria-label="Toggle menu"
      >
        <Menu className="w-full h-full" />
      </div>

      <div className="flex flex-col gap-12">
        {user ? (
          <div className="flex items-center gap-2 cursor-pointer">
            <img
              src={user?.profile_picture_url}
              alt="User profile picture"
              className="w-10 h-10 bg-black rounded-full"
              aria-label="Open user menu"
            />
            <span className="text-lg font-alternates font-semibold dark:text-zinc-200">{user.username}</span>
          </div>
        ) : (
          <span className="flex flex-col gap-4">
            <Link 
              to="/sign-up"
              className="bg-blue-500 w-fit p-2.5 text-zinc-50 font-semibold text-xl uppercase font-alternates leading-relaxed rounded-lg hover:text-white hover:bg-blue-600 hover:dark:bg-blue-500/75"
              aria-label="Sign up"
            >
              Sign Up
            </Link>
            <Link
              to="/sign-in"
              className="text-zinc-950 dark:text-zinc-300 font-semibold text-xl uppercase font-alternates leading-relaxed hover:dark:text-zinc-200 hover:text-zinc-700"
              aria-label="Sign in"
            >
                Sign in
            </Link>
          </span>
          
        )}
        

        <ul className="py-3 px-1 rounded-lg flex flex-col gap-3">
          {links.map(({ href, label }) => (
            <li key={label}>
              <Link 
                to={href}
                className="text-lg font-semibold font-alternates leading-relaxed dark:text-zinc-300 text-zinc-900 uppercase hover:text-zinc-600 dark:hover:text-zinc-200"
                aria-label={label}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="flex flex-col gap-2 items-start justify-start">
          {userActions.map(({ label, icon: Icon, onClick }) => (
            <li
              key={label}
              onClick={onClick}
              className="text-zinc-700 dark:text-zinc-400 flex gap-2 justify-center cursor-pointer hover:text-zinc-500 dark:hover:text-zinc-300"
              aria-label={label}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </div>
            </li>
          ))}
        </ul>
      
      </div>
      {isMyAccountModalOpen && (
        <ProfileCard 
          handleProfileCard={handleProfileCard}
          targetUser={user}
          isOpen={isMyAccountModalOpen}
          onClose={handleProfileCard}
          withOverlay={true}
        />
      )}
    </aside>
  );
}

export default HamburguerMenu;