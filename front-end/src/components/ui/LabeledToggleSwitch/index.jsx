import PropTypes from "prop-types";

LabeledToggleSwitch.propTypes = {
  name: PropTypes.string.isRequired,
  labelText: PropTypes.string,
  children: PropTypes.node.isRequired,
  description: PropTypes.string,
};

function LabeledToggleSwitch ({ name, labelText, children, description }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label
        htmlFor={name}
        className="flex items-center justify-between gap-2"
      >
        <p className="text-zinc-700 dark:text-zinc-300 font-semibold">
          {labelText}
        </p>

        {children}
      </label>
      <p className="text-sm font-normal leading-5 dark:text-zinc-500 text-zinc-500">{description}</p>
    </div>
  );
}

export default LabeledToggleSwitch;
