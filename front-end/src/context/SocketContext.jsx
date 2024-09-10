import { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import PropTypes from "prop-types";
import useUser from "@hooks/useUser";
import useNotification from "@hooks/useNotification";

const SocketContext = createContext({
  socket: null,
  setSocket: () => {},
});

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function SocketProvider ({ children }) {
  const location = useLocation();

  const { user } = useUser();
  const { handleNotification } = useNotification();

  const [ socket, setSocket ] = useState();
  const [ isSocketConnected, setIsSocketConnected ] = useState(false);

  const chatName = location.pathname.split("/c/")[1];

  useEffect(() => {
    if (!user || !chatName) return;

    const ws = io("http://localhost:1337/chat", {
      withCredentials: true,
    });

    const isWhisperChat = chatName.startsWith("@");

    ws.on("connect", () => {
      console.log("Conectado ao WebSocket via Socket.IO");

      ws.emit("joinChat", isWhisperChat ? chatName.slice(1) : chatName, user);   

      setIsSocketConnected(true);
      setSocket(ws);
    });

    ws.on("disconnect", () => {
      setIsSocketConnected(false);
    });

    ws.on("error", (error) => {
      console.log(error);
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred.",
      });
    });

    return () => {
      if (ws) {
        ws.emit("leaveChat", isWhisperChat ? chatName.slice(1) : chatName, user);
        ws.disconnect();
      }
      
    };

  }, [chatName, user, handleNotification]);

  return (
    <SocketContext.Provider value={{ socket, setSocket, isSocketConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketContext;
