import PropTypes from "prop-types";

import SidebarMenuRoot from "./Root";
import SidebarMenuTitle from "./Title";
import SidebarMenuNav from "./Nav";

SidebarMenu.propTypes = {
  title: PropTypes.string,
  handleSidebarMenu: PropTypes.func,
};

function SidebarMenu ({ title, handleSidebarMenu }) {
  return (
    <SidebarMenuRoot>
      <SidebarMenuTitle title={title} handleSidebarMenu={handleSidebarMenu} />
      <SidebarMenuNav />
    </SidebarMenuRoot>
  );
}

export default SidebarMenu;