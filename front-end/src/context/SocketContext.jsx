import { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import PropTypes from "prop-types";
import useUser from "@hooks/useUser";

import { handleConnect, handleLeave } from "src/controller/websocket";
import useNotification from "@hooks/useNotification";

const SocketContext = createContext({
  socket: null,
});

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function SocketProvider ({ children }) {
  const location = useLocation();
  const { user } = useUser();
  const { handleNotification } = useNotification();
  
  const chatName = location.pathname.split("/c/")[1];
  
  const [ socket, setSocket ] = useState(null);

  useEffect(() => {
    if (socket) return;

    setSocket(io(`${import.meta.env.VITE_WS_URL}/chat`, {
      transports: ["websocket"],
      reconnection: false,
      reconnectionAttempts: 1,
      auth: {
        token: `${localStorage.getItem("token")}`,
      },
    }));

    return () => {
      if (socket?.connected) {
        socket.disconnect();
      }
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !user?.id || !chatName) return;
    
    if (socket.currentChat && socket.currentChat !== chatName) {
      handleLeave(socket, socket.currentChat);
    }

    if (socket.connected) {
      handleConnect(socket, chatName);
      socket.currentChat = chatName;
    } else {
      socket.on("connect", () => {
        console.log("socket connected:", socket.id);
        handleConnect(socket, chatName);
        socket.currentChat = chatName;
      });
    }

    socket.on("ERROR", (error) => {
      handleNotification({
        model: "error", 
        message: error.message || "An unexpected error occurred."
      });
    });

    return () => {
      if (socket?.connected && socket.currentChat === chatName) {
        handleLeave(socket, chatName);
        socket.currentChat = null;
      }
      socket.off("connect");
      socket.off("ERROR");
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, chatName, user?.id]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketContext;
