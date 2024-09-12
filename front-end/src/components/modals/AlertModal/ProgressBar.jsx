import PropTypes from "prop-types";
import { tv } from "tailwind-variants";

AlertModalProgressBar.propTypes = {
  model: PropTypes.string,
  duration: PropTypes.number,
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

function AlertModalProgressBar ({ model, duration = 5000 }) {

  return (
    <span
      className={progressBar({ colors: model })}
      style={{ animationDuration: `${duration}ms` }}
    ></span>
  );
}

export default AlertModalProgressBar;
