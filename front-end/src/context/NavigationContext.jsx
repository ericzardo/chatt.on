import { createContext,  useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import useUser from "@hooks/useUser";

import authLogout from "@services/auth/authLogout";

const NavigationContext = createContext(null);

NavigationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function NavigationProvider ({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { user, revalidateUser } = useUser();

  const prevLocation = useRef(location.pathname);

  useEffect(() => {
    const handleLogout = async () => {
      if (user?.is_temporary_user && !location.pathname.startsWith("/c/") && prevLocation.current !== location.pathname) {
        await authLogout();
      }

      await revalidateUser();
    };

    handleLogout();

    prevLocation.current = location.pathname;

  }, [location.pathname, user, revalidateUser, queryClient, navigate]);

  return (
    <NavigationContext.Provider value={ {} }>
      {children}
    </NavigationContext.Provider>
  );
}

export default NavigationContext;
