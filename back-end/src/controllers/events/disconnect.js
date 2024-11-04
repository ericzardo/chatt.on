const ConnectionManager = require("../../services/ConnectionManager");

const disconnect = async (socket) => {
  logger.info(`${socket.id} is attempting to disconnect.`);

  try {
    const chatName = ConnectionManager.getChatName(socket);

    if (!chatName) {
      logger.warn(`${socket.id} failed to disconnect`);
      socket.emit("error", {
        message: "Failed to disconnect."
      })

      return;
    }

    ConnectionManager.removeConnection(socket);
    logger.info(`${socket.id} disconnected from chat ${chatName}.`);

    // Send chat connections
    const onlineUsers = ConnectionManager.getOnlineUsers(chatName);
    socket.to(chatName).emit("onlineUsers", onlineUsers);

    // Send offline users
    const offlineUsers = await ConnectionManager.getOfflineUsers(chatName);

    socket.to(chatName).emit("offlineUsers", offlineUsers);
    socket.emit("offlineUsers", offlineUsers);
  } catch (error) {
    logger.error(`Error: ${socket.id} disconnection - ${error.message}`);
    socket.emit("error", {
      message: "An error occurred while disconnecting."
    });
  }



}

module.exports = disconnect;