import PropTypes from "prop-types";

UsernameAndAvatarModalRoot.propTypes = {
  children: PropTypes.node.isRequired,
};

function UsernameAndAvatarModalRoot ({ children }) {
  return (
    <div className="bg-zinc-100 dark:bg-zinc-900 rounded-xl mx-2 md:m-0 p-5 flex flex-col gap-3 max-w-[640px]">
      {children}
    </div>
  );
}

export default UsernameAndAvatarModalRoot;