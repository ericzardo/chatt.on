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

    try {
      const ws = io(`${import.meta.env.VITE_WS_URL}/chat`, {
        transports: ["websocket", "polling"],
        auth: {
          token: `${localStorage.getItem("token")}`,
        },
      });

      const isWhisperChat = chatName.startsWith("@");

      ws.on("connect", () => {
        console.log("Conectado ao WebSocket via Socket.IO");
        ws.emit("joinChat", isWhisperChat ? chatName.slice(1) : chatName, user);
        setIsSocketConnected(true);
        setSocket(ws);
      });

      ws.on("disconnect", () => {
        console.log("Desconectado do WebSocket");
        setIsSocketConnected(false);
        setSocket(null);
      });

      ws.on("error", (error) => {
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
    } catch (error) {
      console.error("Erro ao conectar ao WebSocket:", error);
      handleNotification({
        model: "error",
        message: "Failed to connect to WebSocket.",
      });
    }
  }, [chatName, user, handleNotification]);

  return (
    <SocketContext.Provider value={{ socket, setSocket, isSocketConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketContext;
