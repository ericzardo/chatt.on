const ConnectionManager = require("../../services/ConnectionManager");
const MessageManager = require("../../services/MessageManager");

const sendChatHistory = (socket, chatName) => {
  const history = MessageManager.getMessages(chatName) || [];
  socket.emit("CHAT_HISTORY", history);
};

const sendUserStatuses = async (socket, chatName) => {
  const onlineUsers = ConnectionManager.getOnlineChatUsers(chatName) || [];
  socket.to(chatName).emit("ONLINE_USERS", onlineUsers);
  socket.emit("ONLINE_USERS", onlineUsers);

  const offlineUsers = await ConnectionManager.getOfflineUsers(chatName) || [];
  socket.to(chatName).emit("OFFLINE_USERS", offlineUsers);
  socket.emit("OFFLINE_USERS", offlineUsers);
};

module.exports = { sendChatHistory, sendUserStatuses }