import { createContext, useState, useCallback, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import AlertModal from "@components/modals/AlertModal";

const NotificationContext = createContext(null);

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function NotificationProvider ({ children }) {
  const [notification, setNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef(null);

  const clearNotification = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setIsVisible(false);
    setNotification(null);
  }, []);

  const handleNotification = useCallback((newNotification) => {
    if (!newNotification) return;

    clearNotification();

    setNotification(newNotification);
    setIsVisible(true);

    timerRef.current = setTimeout(() => {
      setIsVisible(false);
      setNotification(null);
    }, newNotification.duration || 5000);
  }, [clearNotification]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notification, handleNotification }}>
      {children}
      {notification && isVisible && (
        <AlertModal
          notification={notification}
          handleNotification={handleNotification}
        />
      )}
    </NotificationContext.Provider>
  );
}

export default NotificationContext;
