import PropTypes from "prop-types";

SidebarMenuTitle.propTypes = {
  title: PropTypes.string.isRequired,
  handleSidebarMenu: PropTypes.func,
};

function SidebarMenuTitle ({ title, handleSidebarMenu }) {
  
  return (
    <span onClick={handleSidebarMenu} className="flex items-center justify-center px-2 py-3 bg-blue-500 max-[1025px]:cursor-pointer">

      <h1 className="uppercase font-bold font-alternates text-3xl leading-relaxed text-zinc-300">{title}</h1>
      
    </span>
  );
}

export default SidebarMenuTitle;