import PropTypes from "prop-types";
import useUser from "@hooks/useUser";

AdminProtection.propTypes = {
  children: PropTypes.node.isRequired,
};

function AdminProtection ({ children }) {
  const { user } = useUser();
  
  const isUserAdmin = user && user?.roles?.some(role => role.name === "admin");

  if (!isUserAdmin) {
    return (
      <div className="fixed top-0 bottom-0 right-0 left-0 w-full h-full flex items-center justify-center font-bold font-alternates text-3xl dark:text-zinc-100 text-zinc-900">
        Permission denied
      </div>
    );
  }

  return children;
}

export default AdminProtection;
