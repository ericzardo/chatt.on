import { useEffect } from "react";
import { tv } from "tailwind-variants";
import PropTypes from "prop-types";

MessageModalRoot.propTypes = {
  children: PropTypes.node.isRequired,
  model: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

const messageModal = tv({
  base: "absolute m-auto h-fit left-0 right-0 top-2 flex flex-col justify-between p-4 pr-7 w-2/5 rounded-lg overflow-hidden",
  variants: {
    model: {
      default: "bg-zinc-200 text-zinc-800 border-zinc-800",
      error: "bg-red-600 text-zinc-200 border-zinc-200",
      success: "bg-green-600 text-zinc-200 border-zinc-200",
    },
  },
  defaultVariants: {
    model: "default",
  },
});

function MessageModalRoot ({ model, onClose, children }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return <span className={messageModal({ model })}>{children}</span>;
}

export default MessageModalRoot;
