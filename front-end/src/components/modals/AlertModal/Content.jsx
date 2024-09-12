import PropTypes from "prop-types";

AlertModalContent.propTypes = {
  message: PropTypes.string.isRequired,
};

function AlertModalContent ({ message }) {
  return <p className="text-base">{message}</p>;
}

export default AlertModalContent;
