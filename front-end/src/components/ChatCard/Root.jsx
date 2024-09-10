import PropTypes from "prop-types";

ChatCardRoot.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

function ChatCardRoot ({ children, onClick }) {
  return (
    <div onClick={onClick} className="w-72 h-56 border-blue-500 border rounded-xl flex flex-col overflow-hidden cursor-pointer transition-transform hover:scale-110">
      {children}
    </div>
  );
}

export default ChatCardRoot;