import PropTypes from "prop-types";
import { X } from "react-feather";

UsernameAndAvatarModalTitle.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

function UsernameAndAvatarModalTitle ({ title, onClose }) {
  return (
    <span className="flex justify-between gap-6">
      <p 
        className="font-semibold font-alternates text-xl leading-snug text-zinc-900 dark:text-zinc-50"
      >{title}</p>
      <X 
        onClick={onClose}
        className="w-5 h-5 text-zinc-500 flex items-center justify-center cursor-pointer
        transition-all hover:text-red-700 hover:dark:text-red-500 hover:scale-110"
        aria-label="Close"
        role="button"
        tabIndex="0"
      />
    </span>
  );
}

export default UsernameAndAvatarModalTitle;