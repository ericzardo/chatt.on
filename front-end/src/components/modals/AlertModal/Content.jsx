import PropTypes from "prop-types";

MessageModalContent.propTypes = {
  message: PropTypes.string.isRequired,
};

function MessageModalContent ({ message }) {
  return <p className="text-base">{message}</p>;
}

export default MessageModalContent;
