const ConnectionManager = require("../../services/ConnectionManager");

const disconnect = async (socket) => {
  const chatName = ConnectionManager.getChatName(socket);

  if (!chatName) {
    socket.emit("error", {
      message: "Failed to disconnect."
    })

    return;
  }

  ConnectionManager.removeConnection(socket);

  // Send chat connections
  const onlineUsers = ConnectionManager.getOnlineUsers(chatName);
  socket.to(chatName).emit("onlineUsers", onlineUsers);

  // Send offline users
  const offlineUsers = await ConnectionManager.getOfflineUsers(chatName);

  socket.to(chatName).emit("offlineUsers", offlineUsers);
  socket.emit("offlineUsers", offlineUsers);

}

module.exports = disconnect;