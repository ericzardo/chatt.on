import { forwardRef } from "react";
import PropTypes from "prop-types";
import { tv } from "tailwind-variants";

const input = tv({
  base: "outline-none w-full border-none font-semibold rounded-lg transition-all ease-out duration-300",
  variants: {
    size: {
      default: "p-3",
      sm: "px-3 py-1.5 max-h-8",
    },
    color: {
      default: "bg-zinc-300 text-zinc-600 placeholder:text-zinc-400 dark:bg-zinc-800 dark:placeholder-zinc-700 dark:text-zinc-500",
    },
  },
  defaultVariants: {
    size: "default",
    color: "default",
  },
});


const Input = forwardRef(({ size, color, placeholder, icon, ...props }, ref) => {
  return (
    <span className="flex items-center !p-0 w-full">
      <input
        {...props}
        placeholder={placeholder}
        className={input({ color, size })}
        ref={ref}
        autoComplete="off"
      />
      {icon && <span className="absolute right-2">{icon}</span>}
    </span>
  );
});

Input.displayName = "Input";

Input.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
  placeholder: PropTypes.string,
  icon: PropTypes.element,
};

export default Input;
