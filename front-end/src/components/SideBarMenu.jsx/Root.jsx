import PropTypes from "prop-types";

SidebarMenuRoot.propTypes = {
  children: PropTypes.node.isRequired,
};

function SidebarMenuRoot ({ children }) {
  return (
    <aside className="flex flex-col flex-1 max-w-72 gap-3 bg-zinc-200 dark:bg-zinc-900/55 rounded-md overflow-hidden shadow-md sidebar-menu">

      {children}

    </aside>
  );
}

export default SidebarMenuRoot;