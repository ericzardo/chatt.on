import { useState, useCallback } from "react";

import { Menu } from "react-feather";
import HamburguerMenu from "./HamburguerMenu";

function HeaderNavMobile () {
  const [ isHamburguerMenuOpen, setIsHamburguerMenuOpen ] = useState(false);

  const handleHamburguerMenuOpen = useCallback(() => {
    setIsHamburguerMenuOpen(prev => !prev);
  }, []);

  return (
    <>
      <div
        onClick={handleHamburguerMenuOpen}
        className={"flex text-zinc-800 dark:text-zinc-200 w-10 h-24 items-center justify-center"}
        aria-label="Toggle menu"
        aria-expanded={isHamburguerMenuOpen}
      >
        <Menu
          className="w-full h-full"
          aria-label="Menu"
        />
      </div>
      {isHamburguerMenuOpen && (
        <HamburguerMenu toggleHamburguerMenuOpen={handleHamburguerMenuOpen} />
      )}
    </>
    
  );
}

export default HeaderNavMobile;