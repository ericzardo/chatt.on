import { createContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import AlertModal from "@components/modals/AlertModal";

const NotificationContext = createContext(null);

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function NotificationProvider ({ children }) {
  const [notification , setNotification ] = useState(null);

  const handleNotification = useCallback((notification) => {
    setNotification(notification);
  }, []);

  return (
    <NotificationContext.Provider value={{ notification, handleNotification  }}>
      { children }
      { notification && <AlertModal notification={notification} handleNotification={handleNotification} /> }
    </NotificationContext.Provider>
  );
}

export default NotificationContext;
