import PropTypes from "prop-types";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { NavigationProvider } from "./NavigationContext";
import { NotificationProvider } from "./NotificationContext";
import { UserProvider } from "./UserContext";

Providers.propTypes = {
  children: PropTypes.node.isRequired,
};

function Providers ({ children }) {
  return (
    <DndProvider backend={HTML5Backend}>
      <UserProvider>
        <NavigationProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </NavigationProvider>
      </UserProvider>
    </DndProvider>
  );
}

export default Providers;