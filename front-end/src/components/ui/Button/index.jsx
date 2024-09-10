import { forwardRef } from "react";
import { tv } from "tailwind-variants";
import PropTypes from "prop-types";
import clsx from "clsx";

const button = tv({
  base: "font-semibold text-xl font-alternates leading-relaxed rounded-lg",
  variants: {
    size: {
      default: "w-fit p-2.5 uppercase",
      sm: "px-3 py-1 flex items-center justify-center gap-1 text-zinc-100 text-base",
      icon: "w-fit flex items-center gap-2 p-2.5 self-end",
      square: "leading-none px-1 max-h-6",
    },
    color: {
      default: "bg-blue-500 text-zinc-50 hover:text-white hover:bg-blue-600 hover:dark:bg-blue-500/75",
      cancel: "text-zinc-100 bg-red-500 hover:bg-red-600/70",
      submit: "text-zinc-100 bg-green-500 hover:bg-green-600/70",
      transparent: "text-blue-500 bg-transparent border font-medium border-blue-500",
      warn: "text-red-500 bg-transparent border font-medium border-red-500"
    },
  },
  defaultVariants: {
    size: "default",
    color: "default",
  },
});

const Button = forwardRef(({ children, type = "button", color, size, onClick, ...props }, ref) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(button({ color, size }))}
      ref={ref}
      role="button"
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

Button.propTypes = {
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  size: PropTypes.oneOf(["default", "sm", "icon", "square"]),
  color: PropTypes.oneOf(["default", "cancel", "submit", "transparent", "warn"]),
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};


export default Button;
