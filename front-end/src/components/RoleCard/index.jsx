import { useState } from "react";
import PropTypes from "prop-types";
import { X } from "react-feather";

RoleCard.propTypes = {
  role: PropTypes.object.isRequired,
  removeRole: PropTypes.func,
};

function RoleCard ({ role = { name: "user" }, removeRole }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => removeRole && setIsHovered(true);
  const handleMouseLeave = () => removeRole && setIsHovered(false);
  const handleRemoveClick = () => removeRole && removeRole();

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex="0"
      className={`${removeRole ? "cursor-pointer" : "cursor-auto"} p-2 w-fit h-fit rounded-2xl flex items-center justify-center gap-2 bg-zinc-200 dark:bg-zinc-800`}>
      <span
        onClick={handleRemoveClick}
        className={`${!removeRole ? "w-3 h-3" : "w-4 h-4"} flex items-center justify-center p-0.5 bg-[${role.color}] rounded-full`}
        aria-label="Remove role"
      >
        {isHovered && removeRole && role.name !== "user" && (
          <X className="absolute w-3 h-3 text-white cursor-pointer" />
        )}
      </span>
      <p className="capitalize text-zinc-700 dark:text-zinc-200 text-xs select-none">{role.name}</p>
    </span>
  );
}
export default RoleCard;