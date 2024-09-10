import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { ArrowRight, Loader } from "react-feather";

import Button from "@components/ui/Button";

SignModal.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  footerDetailsModal: PropTypes.object,
  isLoading: PropTypes.bool,
};

function SignModal ({ handleSubmit, title, children, footerDetailsModal, isLoading = false }) {

  return (
    <div
      className="fixed inset-0 flex items-center justify-center mx-2 md:m-0"
      role="dialog"
      aria-modal="true"
    >
        
      <div className="bg-zinc-100 dark:bg-zinc-900 rounded-xl p-5 flex flex-col gap-6 w-[460px] shadow-2xl">

        <p 
          className="font-semibold font-alternates text-xl leading-snug text-zinc-900 dark:text-zinc-50"
        >{title}</p>

        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-3">
          {children}

          <span className={`flex  items-center gap-2 ${footerDetailsModal ? "justify-between" : "justify-end"}`}>
            {footerDetailsModal && (
              <p  className="text-zinc-500 dark:text-zinc-400 font-alternates text-sm leading-snug">
                {footerDetailsModal.text}{" "}
                <Link to={footerDetailsModal.link} className="text-zinc-800 dark:text-white font-semibold">
                  {footerDetailsModal.strong}
                </Link>
              </p>
            )}
            
            <Button disabled={isLoading} size="sm" type="submit" aria-label={title}>
              {!isLoading ? "Contiue" : <Loader className="animate-spin text-zinc-400" />}
              {!isLoading && <ArrowRight />}
            </Button>
          </span>

        </form>

      </div>
    </div>
  );
}

export default SignModal;