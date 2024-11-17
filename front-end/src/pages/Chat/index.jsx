import { useEffect, useState, useCallback } from "react";

import Header from "@components/Header";
import ChatSideBar from "./Sidebar";
import ChatBody from "./Body";
import ChatDetails from "./Details";
import useUser from "@hooks/useUser";

function ChatPage () {
  const { user } = useUser();

  const [ isLoading, setIsLoading ] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);

  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
  const [isChatInfosOpen, setIsChatInfosOpen] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    if (user) {
      setIsLoading(false);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  },  [user]);

  const handleChatSidebarOpen = useCallback(() => {
    setIsChatSidebarOpen(prev => !prev);
  }, []);

  const handleChatInfosOpen = useCallback(() => {
    setIsChatInfosOpen(prev => !prev);
  }, []);

  return (

    <div className="w-full h-screen flex flex-col">
      <Header isMobile={isMobile} />

      <span className="flex flex-1 min-h-0 overflow-hidden w-full p-2 gap-2">
        <ChatSideBar
          isMobile={isMobile} 
          isLoading={isLoading} 
          isChatSidebarOpen={isChatSidebarOpen}
          handleChatSidebarOpen={handleChatSidebarOpen}
        />
        <ChatBody 
          isMobile={isMobile} 
          isLoading={isLoading}
          handleChatInfosOpen={handleChatInfosOpen}
          handleChatSidebarOpen={handleChatSidebarOpen}
        />
        <ChatDetails 
          isMobile={isMobile} 
          isLoading={isLoading} 
          isChatInfosOpen={isChatInfosOpen}
          handleChatInfosOpen={handleChatInfosOpen}
        />
      </span>

    </div>
  );
}

export default ChatPage;
