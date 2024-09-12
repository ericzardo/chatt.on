import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import AlertModalRoot from "./Root";
import AlertModalContent from "./Content";
import AlertModalProgressBar from "./ProgressBar";


AlertModal.propTypes = {
  notification: PropTypes.shape({
    model: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    duration: PropTypes.number,
  }).isRequired,
  handleNotification: PropTypes.func.isRequired,
};

function AlertModal ({ notification, handleNotification}) {
  const { model, message, duration } = notification;
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);

    const timer = setTimeout(() => {
      handleNotification(null);
    }, duration);

    return () => clearTimeout(timer);
  }, [notification, handleNotification, duration]);

  const closeModal = () => handleNotification(null);

  return (
    <AlertModalRoot duration={duration} model={model} onClose={closeModal} >
      <AlertModalContent message={message} />  
      <AlertModalProgressBar key={key} model={model} duration={duration} />
    </AlertModalRoot>
  );
}

export default AlertModal;

