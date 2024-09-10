import PropTypes from "prop-types";

import { NavigationProvider } from "./NavigationContext";
import { NotificationProvider } from "./NotificationContext";
import { UserProvider } from "./UserContext";

Providers.propTypes = {
  children: PropTypes.node.isRequired,
};

function Providers ({ children }) {
  return (
    <UserProvider >
      <NavigationProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </NavigationProvider>
    </UserProvider>
  );
}

export default Providers;