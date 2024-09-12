import PropTypes from "prop-types";

ToggleSwitch.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

function ToggleSwitch ({ checked = false, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div
        className={`w-11 h-6 rounded-full transition-colors ${
          checked ? "bg-blue-400 dark:bg-blue-500" : "bg-zinc-300 dark:bg-zinc-800"
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        ></div>
      </div>
    </label>
  );
}

export default ToggleSwitch;
