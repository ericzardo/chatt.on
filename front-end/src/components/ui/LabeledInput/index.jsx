import PropTypes from "prop-types";

LabeledInput.propTypes = {
  name: PropTypes.string.isRequired,
  labelText: PropTypes.string,
  children: PropTypes.node.isRequired,
};

function LabeledInput ({ name, labelText, children }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label
        htmlFor={name}
        className="text-zinc-700 dark:text-zinc-300"
      >
        {labelText}
      </label>

      {children}
    </div>
  );
}

export default LabeledInput;
