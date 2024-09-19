import PropTypes from "prop-types";

ContainerModalRoot.propTypes = {
  children: PropTypes.node.isRequired,
};

function ContainerModalRoot ({ children }) {
  return (
    <div className="bg-zinc-100 dark:bg-zinc-900 rounded-xl p-5 flex flex-col gap-6 w-[460px] shadow-2xl">
      {children}
    </div>

  );
}

export default ContainerModalRoot;