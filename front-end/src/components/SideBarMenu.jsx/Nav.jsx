import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import { Activity, Database, User, List, MessageCircle, ChevronLeft, Code } from "react-feather";

SidebarMenuNav.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.element.isRequired,
      href: PropTypes.string,
      subItems: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          href: PropTypes.string.isRequired,
          icon: PropTypes.element.isRequired,
        })
      ),
    })
  ),
};

const linksPropDefault = [
  {
    label: "Dashboard",
    icon: <Activity />,
    href: "/admin",
  },
  {
    label: "Roles",
    icon: <Code />,
    href: "/admin/roles",
  },
  {
    label: "Management",
    icon: <Database />,
    subItems: [
      { label: "Users", href: "/admin/management/users", icon: <User /> },
      { label: "Themes", href: "/admin/management/themes", icon: <List /> },
      { label: "Rooms", href: "/admin/management/rooms", icon: <MessageCircle /> },
    ],
  },
];

function SidebarMenuNav ({ links = linksPropDefault }) {
  const location = useLocation(); 
  
  const [activeItem, setActiveItem] = useState(null);
  const [activeSubItem, setActiveSubItem] = useState(null);

  useEffect(() => {
    const currentPath = location.pathname;

    let foundActiveItem = null;
    let foundActiveSubItem = null;

    for (const { label, href, subItems } of links) {
      if (href && currentPath === href) {
        foundActiveItem = label;
        break;
      }
      
      if (subItems) {
        for (const { label: subLabel, href: subHref } of subItems) {
          if (currentPath.startsWith(subHref)) {
            foundActiveItem = label;
            foundActiveSubItem = subLabel;
            break;
          }
        }
      }

      if (foundActiveItem || foundActiveSubItem) break;
    }

    setActiveItem(foundActiveItem);
    setActiveSubItem(foundActiveSubItem);

  }, [location.pathname, links]);

  const handleMenu = (label) => {
    if (activeItem === label) return;

    if (activeSubItem === label) return;
    setActiveSubItem(null);
    setActiveItem(label);
  };

  const handleSubMenu = (label) => {
    setActiveSubItem(label);
  };

  return (
    <ul className="py-3 px-1 rounded-lg flex flex-col gap-3 sidebar-menu-nav-items">
      {links.map(({ label, icon, href, subItems }) => (
        <li key={label} onClick={() => handleMenu(label)}> 
          {href ? (
            <Link
              to={href}
              className={`flex items-center justify-between border-l-2 py-2.5 px-5 w-full
              ${activeItem === label ? "border-blue-500 bg-zinc-300 dark:bg-zinc-950/55" : "border-transparent"}
              text-zinc-700 dark:text-zinc-300 rounded-r-md font-alternates font-semibold text-lg`}
              aria-label={`Go to ${href}`}
            >
              <span className="flex items-center gap-3">
                {icon}
                <p>{label}</p>
              </span>
            </Link>
          ) : (
            <button
              className={`flex items-center justify-between border-l-2 py-2.5 px-5 w-full
              ${activeItem === label ? "border-blue-500 bg-zinc-300 dark:bg-zinc-950/55" : "border-transparent"}
              text-zinc-700 dark:text-zinc-300 rounded-r-md font-alternates font-semibold text-lg`}
              aria-label={`Open ${label} submenu`}
              aria-expanded={activeItem === label}
              aria-controls={`submenu-${label}`}
            >
              <span className="flex items-center gap-3">
                {icon}
                <p>{label}</p>
              </span>
              {subItems && (
                <ChevronLeft  
                  className={`transition-all ${
                    activeItem === label ? "rotate-90" : "rotate-0"
                  }`}
                />
              )}
            </button>
          )}

          {subItems && activeItem === label && (
            <ul
              role="menu"
              aria-hidden={activeItem !== label}
              className="py-4 px-6 flex flex-col gap-3 border-l-2 border-blue-500 bg-zinc-300 dark:bg-zinc-950/55"
            >
              {subItems.map(({ label: subLabel, href: subHref, icon }) => (
                <Link
                  key={subLabel}
                  to={subHref}
                  onClick={() => handleSubMenu(subLabel)}
                  className={`flex items-center gap-3 px-6 cursor-pointer border-l-2 text-zinc-700 dark:text-zinc-300
                  ${activeSubItem === subLabel ? "border-blue-500 bg-zinc-300 dark:bg-zinc-950/55" : "border-transparent"}
                  hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors font-alternates font-medium text-base`}
                  aria-label={`Go to ${subHref}`}
                >
                  {icon}
                  <p>{subLabel}</p>
                </Link>
              ))}
            </ul>
          )}
        </li> 
      ))}
    </ul>
  );
}

export default SidebarMenuNav;