import { useLocation } from "react-router-dom";
import useUser from "@hooks/useUser";

import SidebarMenu from "@components/SideBarMenu.jsx";
import AdminHeader from "@components/Header/AdminHeader";
import UserManager from "../sections/UserManager";
import ThemesManager from "../sections/ThemesManager";
import ChatsManager from "../sections/ChatsManager";
import RolesManager from "../sections/RolesManager";

function AdminHome () {
  const { user } = useUser();
  const location = useLocation();

  const pathParts = location.pathname.split("/").filter(part => part);

  const mainPage = pathParts[1] || "";
  const subPage = pathParts[2];

  const isUnauthorizedUser = !user  || !user.roles.find(role => role.name.toLowerCase() === "admin");

  return isUnauthorizedUser ? (
    <div className="fixed top-0 bottom-0 right-0 left-0 w-full h-full flex items-center justify-center font-bold font-alternates text-3xl dark:text-zinc-100 text-zinc-900">
    Permission denied
    </div>
  ) : (
    <div className="w-full h-[100vh] flex gap-2 p-2">
      <SidebarMenu title="Admin" />
 
      <div className="flex flex-1 gap-3 rounded-md overflow-hidden shadow-md">
        <span className="flex flex-col w-full bg-zinc-100 dark:bg-zinc-900">
          
          <AdminHeader />

          {mainPage === "" && (
            <h1 className="text-white">Admin Home</h1>
          )}
          {mainPage === "roles" && (
            <RolesManager />
          )}
          {mainPage === "management" && subPage === "users" && (
            <UserManager />
          )}
          {mainPage === "management" && subPage === "themes" && (
            <ThemesManager />
          )}
          {mainPage === "management" && subPage === "rooms" && (
            <ChatsManager />
          )}

        </span>
      </div>

    </div>
  );

}

export default AdminHome;
