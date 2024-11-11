const logger = require("../../lib/logger");
const MessageManager = require("../../services/MessageManager");

const sendMessage = async (socket, { user, message, chatName }) => {
  const isValidMessage = MessageManager.validateMessage(user, message, socket)

  if (!isValidMessage) return;

  const messageInfos = {
    user,
    message,
    timestamp: new Date(),
  };

  socket.to(chatName).emit("RECEIVE_MESSAGE", messageInfos)
  socket.emit("RECEIVE_MESSAGE", messageInfos)

  MessageManager.addMessage(chatName, messageInfos);
  logger.info(`${user.username} send '${message}' message in ${chatName}.`);
}

module.exports = {
  sendMessage
}