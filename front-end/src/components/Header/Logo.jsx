import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

HeaderLogo.propTypes = {
  content: PropTypes.string,
};

function HeaderLogo ({ content = "chatt.on" }) {
  const navigate = useNavigate();

  const navigateToHome = () => navigate("/");
  
  return (
    <span
      onClick={navigateToHome}
      className="dark:text-zinc-50 text-zinc-950 font-alternates text-4xl font-bold cursor-pointer flex-1"
      aria-label="Home"
    >
      {content}
    </span>
  );
}

export default HeaderLogo;