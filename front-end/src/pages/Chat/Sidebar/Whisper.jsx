import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";

import useUser from "@hooks/useUser";
import useSocket from "@hooks/useSocket";

import { X } from "react-feather";

Whisper.propTypes = {
  handleCurrentSelection: PropTypes.func,
  currentSelection: PropTypes.object,

  isMobile: PropTypes.bool,
};

function Whisper ({ handleCurrentSelection, currentSelection, isMobile = false }) {
  const { user } = useUser();
  const { socket } = useSocket();

  const chatName = location.pathname.split("/c/")[1];

  const [ userWhispers, setUserWhispers ] = useState([]);
  
  const removeWhisper = useCallback((targetUser) => {
    setUserWhispers((prevUserWhispers) =>
      prevUserWhispers.filter((user) => user.username !== targetUser.username)
    );

    if (chatName.startsWith("@") && chatName.slice(1) === targetUser.username) {
      handleCurrentSelection(user?.chats[0]);
    }

  }, [chatName, handleCurrentSelection, setUserWhispers, user?.chats]);

  useEffect(() => {
    if (!socket) return;
    
    socket.on("RECEIVE_WHISPER", ({ user }) => {
      const whisperExists = userWhispers.some((whisper) => whisper.id === user.id);
  
      if (whisperExists) return;

      setUserWhispers([...userWhispers, user]);
    });

    socket.on("WHISPER_START", ({ target }) => {
      const whisperExists = userWhispers.some((user) => user.id === target.id);
  
      if (whisperExists) return;
  
      setUserWhispers([...userWhispers, target]);

      handleCurrentSelection(target);
    });

    return () => {
      socket.off("WHISPER_START");
      socket.off("RECEIVE_WHISPER");
    };
  }, [handleCurrentSelection, setUserWhispers, socket, userWhispers]);

  return (
    <>
      <h1 className="uppercase font-bold font-alternates text-2xl leading-relaxed text-zinc-900 dark:text-zinc-50">Whispers</h1>

      <ul className="flex flex-col py-4 gap-3 sidebar-menu-nav-items">
        {userWhispers.map((user, index) => (
          <li
            key={user.username}
            className={`flex gap-2 p-1 rounded-lg items-center justify-between cursor-pointer
              ${currentSelection === user && !isMobile ? "dark:bg-zinc-800 bg-zinc-400/40" : "bg-transparent"}
              ${currentSelection === user && isMobile ? "dark:bg-zinc-900/40 bg-zinc-400/40" : "bg-transparent"}`}
            onClick={() => handleCurrentSelection(user)}
            aria-label={`Open ${user.username} conversation`}
            tabIndex={index}
          >
            <span className="flex gap-2 items-center">
              <span className="w-10 h-10 bg-black rounded-full"></span>
              <p className="font-alternates font-semibold text-lg leading-relaxed text-zinc-800 dark:text-zinc-400">
                {user.username}
              </p>
            </span>

            <X
              onClick={(event) => {
                event.stopPropagation();
                removeWhisper(user);
              }}
              className="w-5 h-5 dark:text-zinc-500 text-zinc-700 flex items-center justify-center cursor-pointer transition-all hover:text-zinc-800 hover:dark:text-zinc-400 hover:scale-x-105"
            />
            

          </li>
        ))}
      </ul>
      
    </>
  );
}

export default Whisper;