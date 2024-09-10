import PropTypes from "prop-types";
import { tv } from "tailwind-variants";

MessageModalProgressBar.propTypes = {
  model: PropTypes.string,
};

const progressBar = tv({
  base: "absolute bottom-0 left-0 h-1 w-full animate-progress-bar",
  variants: {
    colors: {
      default: "bg-zinc-800",
      error: "bg-zinc-200",
      success: "bg-zinc-200",
    },
  },
  defaultVariants: {
    colors: "default",
  },
});

function MessageModalProgressBar ({ model }) {
  return <span className={progressBar({ colors: model })}></span>;
}

export default MessageModalProgressBar;
