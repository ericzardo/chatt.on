import PropTypes from "prop-types";

import HeaderRoot from "./Root";
import HeaderLogo from "./Logo";
import HeaderNav from "./Nav";
import HeaderUserActions from "./UserActions";
import HeaderNavMobile from "./NavMobile";

Header.propTypes = {
  isMobile: PropTypes.bool,
};

function Header ({ isMobile = false }) {
  return (
    <HeaderRoot>
      <HeaderLogo />
      {isMobile ? (
        <HeaderNavMobile />
      ) : (
        <>
          <HeaderNav />
          <HeaderUserActions  />
        </>
        
      )}
    </HeaderRoot>
  );
}

export default Header;