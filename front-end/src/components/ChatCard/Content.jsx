import PropTypes from "prop-types";

ChatCardContent.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

function ChatCardContent ({ title, children }) {
  return (
    <span className="flex flex-col px-4 py-1.5 gap-3">
      <p className="font-semibold font-alternates text-xl leading-relaxed text-zinc-900 dark:text-white uppercase">{title}</p>
      {children}
    </span>
  );
}

export default ChatCardContent;