import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const withClickOutside = (WrappedComponent) => {
  const ClickOutsideWrapper = ({ isOpen, onClose,  withOverlay = false, ...props }) => {
    const wrapperRef = useRef(null);
    const overlayRef = useRef(null);
    
    useEffect(() => {
      function handleClickOutside (event) {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
          onClose();
        }
      }

      function handleEscapeKey (event) {
        if (event.key === "Escape") {
          onClose();
        }
      }

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscapeKey);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscapeKey);
      };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return withOverlay ? (
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-zinc-950/80 flex items-center justify-center"
        onClick={onClose}
      >
        <div
          ref={wrapperRef}
          className="flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <WrappedComponent onClose={onClose} {...props} />
        </div>
      </div>
    ) : (
      <div
        ref={wrapperRef}
        className={`fixed z-50 ${isOpen ? "visible" : "hidden"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <WrappedComponent onClose={onClose} {...props} />
      </div>
    );
  };

  ClickOutsideWrapper.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    withOverlay: PropTypes.bool,
  };

  return ClickOutsideWrapper;
};

export default withClickOutside;
