import PropTypes from "prop-types";

import AlertModalRoot from "./Root";
import AlertModalContent from "./Content";
import AlertModalProgressBar from "./ProgressBar";

AlertModal.propTypes = {
  notification: PropTypes.shape({
    model: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }).isRequired,
  handleNotification: PropTypes.func.isRequired,
};

function AlertModal ({ notification, handleNotification}) {
  const { model, message } = notification;

  const closeModal = () => handleNotification(null);

  return (
    <AlertModalRoot model={model} onClose={closeModal} >
      <AlertModalContent message={message} />  
      <AlertModalProgressBar model={model} />
    </AlertModalRoot>
  );
}

export default AlertModal;

