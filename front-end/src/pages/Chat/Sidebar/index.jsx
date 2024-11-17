import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { X } from "react-feather";

import Whisper from "./Whisper";
import Chats from ".//Chats";

ChatSideBar.propTypes = {
  isLoading: PropTypes.bool,
  isMobile: PropTypes.bool,
  isChatSidebarOpen: PropTypes.bool,
  handleChatSidebarOpen: PropTypes.func,
};


function ChatSideBar ({ isLoading = false, isMobile = false, isChatSidebarOpen, handleChatSidebarOpen }) {
  const navigate = useNavigate();
  
  const [ currentSelection, setCurrentSelection ] = useState(null);


  const handleCurrentSelection = useCallback((object) => {
    if (object?.name) {
      navigate(`/c/${object.name}`);
    }
    if (object?.username) {
      navigate(`/c/@${object.username}`);
    }
    setCurrentSelection(object);
  }, [navigate]);

  return (
    <aside className={`${isMobile && !isChatSidebarOpen ? "hidden" : "flex"} ${isMobile && isChatSidebarOpen ? "fixed z-50 top-0 left-0 min-w-full w-fit h-full dark:bg-zinc-800 bg-zinc-300" : ""}${!isMobile ? "max-w-60 dark:bg-zinc-900/55 bg-zinc-200" : ""} flex-col flex-1 p-2.5 gap-3 rounded-md overflow-hidden shadow-md`}>
      {isMobile && isChatSidebarOpen && (
        <X 
          onClick={(e) => {
            e.stopPropagation();
            handleChatSidebarOpen();
          }}
          className="w-6 h-6 absolute right-4 top-4 text-zinc-500 flex items-center justify-center cursor-pointer
           transition-all hover:text-red-700 hover:dark:text-red-500 hover:scale-110"
        />
      )}

      <span className="flex flex-col justify-center px-2 py-2 max-[1025px]:cursor-pointer">

        <Chats isLoading={isLoading} isMobile={isMobile} currentSelection={currentSelection} handleCurrentSelection={handleCurrentSelection} />

        <Whisper currentSelection={currentSelection} handleCurrentSelection={handleCurrentSelection} isMobile={isMobile} />

      </span>

    </aside>
  );
}

export default ChatSideBar;