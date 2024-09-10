import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import useUser from "@hooks/useUser";

import { Sun, Moon, } from "react-feather";
import Button from "@components/ui/Button";
import UserDropdown from "./UserDropdown";

import { toggleTheme } from "@utils/toggleTheme";

function HeaderUserActions () {
  const { user } = useUser();
  const navigate = useNavigate();

  const [themeIcon, setThemeIcon] = useState(() => window.localStorage.getItem("theme") || "dark");

  const [ isUserDropdownVisible, setIsUserDropdownVisible ] = useState(false);

  const handleUserDropdownVisible = useCallback(() => {
    setIsUserDropdownVisible(prev => !prev);
  }, []);

  const handleTheme = useCallback(() => {
    toggleTheme(setThemeIcon);
  }, []);

  const handleSignUp = useCallback(() => {
    navigate("/sign-up");
  }, [navigate]);

  return (
    <span className="flex relative flex-1 items-center justify-end gap-6">
      {user && !user.is_temporary_user ? (
        <span className="relative flex items-center gap-4">
          
          <span onClick={handleUserDropdownVisible} className="w-12 h-12 bg-black rounded-full cursor-pointer" aria-label="User menu" />

          {isUserDropdownVisible && (
            <UserDropdown />
          )}

        </span>
      ) : (
        <>
          <button
            onClick={handleTheme}
            className="text-zinc-700 dark:text-zinc-400 w-6 h-6 flex items-center justify-center hover:dark:text-zinc-300 hover:text-zinc-500"
            aria-label="Toggle theme"
          >
            {themeIcon === "dark" ? <Sun /> : <Moon />}
          </button>
          <Link
            to="/sign-in"
            className="text-zinc-950 dark:text-zinc-300 font-semibold text-xl uppercase font-alternates leading-relaxed hover:dark:text-zinc-200 hover:text-zinc-700"
            aria-label="Sign in"
          >
            Sign in
          </Link>
          <Button onClick={handleSignUp} aria-label="Sign up" >
            Sign Up
          </Button>
        </>  
      )}
    </span>
  );
}

export default HeaderUserActions;