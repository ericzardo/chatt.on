import PropTypes from "prop-types";

import { Link } from "react-router-dom";

HeaderNav.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
};

const linksPropDefault = [
  { href: "/", label: "Rooms" },
  { href: "#", label: "About" },
  { href: "#", label: "Pricing" },
];

function HeaderNav ({ links = linksPropDefault }) {
  return (
    <div className="flex flex-1 justify-center">
      <ul className="flex items-center justify-between gap-4 w-fit list-none">
        {links.map(({ href, label }) => (
          <li key={label}>
            <Link
              to={href}
              className="text-lg font-semibold font-alternates leading-relaxed dark:text-zinc-300 text-zinc-900 uppercase hover:dark:text-zinc-200 hover:text-zinc-600"
              aria-label={label}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HeaderNav;