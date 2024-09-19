import { forwardRef } from "react";
import PropTypes from "prop-types";

const SelectInput = forwardRef(({ onChange, options, placeholder = "Choose an option", ...props }, ref) => {
  return (
    <select
      {...props}
      ref={ref}
      value={props.value || ""}
      className="flex items-center gap-3 h-max w-max p-1.5 cursor-pointer font-semibold rounded-lg
      bg-zinc-300 text-zinc-600 dark:bg-zinc-800 dark:placeholder-zinc-700 dark:text-zinc-500"
      onChange={onChange}
      aria-label="Select input"
    >
      <option value="" disabled>{placeholder}</option>
      {options && options.map(option => (
        <option key={option.value} value={option.value} aria-label={`Select ${option.value} item`}>
          {option.placeholder}
        </option>
      ))}
    </select>
  );
});

SelectInput.displayName = "SelectInput";

SelectInput.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

export default SelectInput;