import PropTypes from "prop-types";

HeaderRoot.propTypes = {
  children: PropTypes.node.isRequired,
};

function HeaderRoot ({ children }) {
  return (
    <div className="bg-zinc-300 dark:bg-zinc-900 flex items-center leading-relaxed justify-between w-full h-24 lg:px-20 px-8 py-4 shadow-xl">
      {children}
    </div>
  );
}

export default HeaderRoot;