import PropTypes from "prop-types";
import withClickOutside from "@components/hoc/withClickOutside";

TargetUserOptions.propTypes = {
  user: PropTypes.object.isRequired,
  onWhisperStart: PropTypes.func.isRequired,
  onProfileClick: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

function TargetUserOptions ({ user, onWhisperStart, onProfileClick, closeModal }) {
  return (
    <ul className="flex flex-col absolute z-10 top-full left-0 rounded-md shadow-sm overflow-hidden dark:bg-zinc-800 bg-zinc-300">
      <li
        className="p-2 cursor-pointer text-sm font-alternates font-semibold uppercase hover:dark:bg-zinc-700 hover:bg-zinc-400/20
        text-zinc-700 dark:text-zinc-400 hover:text-zinc-800 hover:dark:text-zinc-300"
        onClick={() => {
          onWhisperStart(user);
          closeModal();
        }}
      >
        Talk with
      </li>
      <li
        className="p-2 cursor-pointer text-sm font-alternates font-semibold uppercase hover:dark:bg-zinc-700 hover:bg-zinc-400/20
        text-zinc-700 dark:text-zinc-400 hover:text-zinc-800 hover:dark:text-zinc-300"
        onClick={() => {
          onProfileClick();
          closeModal();
        }}
      >
        See Profile
      </li>
    </ul>
  );
}

const TargetUserOptionsWithClickOutside = withClickOutside(TargetUserOptions);

export default TargetUserOptionsWithClickOutside;
