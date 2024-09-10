import { useContext, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import UserContext from "src/context/UserContext";

import Header from "@components/Header";
import ThemeSelection from "./steps/ThemeSelection";
import ChatSelection from "./steps/ChatSelection";
import UsernameAndAvatarModal from "@components/modals/UsernameAndAvatarModal";

function Home () {
  const { user } = useContext(UserContext);
  const [ searchParams, setSearchParams ] = useSearchParams();
  const [ chat, setChat ] = useState(null);

  const isThemeSelected = searchParams.get("theme");
  const isChatSelected = searchParams.get("chat");

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);

  useEffect(() => {
    const handleResize = () => { 
      setIsMobile(window.innerWidth <= 1000);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleParam = useCallback((key, value) => {
    if (!value) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);
  
  const handleSelectTheme = useCallback((theme) => {
    handleParam("theme", theme?.name);
    if (!theme) handleParam("chat");
  }, [handleParam]);

  const handleSelectChat = useCallback((chat) => {
    handleParam("chat", chat?.name);
  }, [handleParam]);

  const isGuestJoiningInChatRoom = isChatSelected && !user;

  return (
    <div className="w-full h-full flex flex-col gap-16">
      <Header isMobile={isMobile} />
      
      {isThemeSelected ? (
        <ChatSelection handleSelectTheme={handleSelectTheme} handleSelectChat={handleSelectChat} setChat={setChat} />
      ) : (
        <ThemeSelection handleSelectTheme={handleSelectTheme}/>
      )}

      {isGuestJoiningInChatRoom && (
        <UsernameAndAvatarModal chat={chat} onClose={handleSelectChat} />
      )}
      
    </div>
    
  );

}

export default Home;
