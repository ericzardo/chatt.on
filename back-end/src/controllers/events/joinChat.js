const {
  findChatOrUser,
  connectUserToRoom,
  sendChatHistory,
  emitUserStatuses
} = require("./utils/chatHelper")
const logger = require("../../lib/logger");

const joinChat = async (socket, chatName, user) => {
  logger.info(`${socket.id} is attempting to join chat ${chatName}.`);

  try {
    const { chat, targetUser } = await findChatOrUser(chatName);

    if (!chat && !targetUser) {
      logger.warn(`${socket.id} failed to join chat`);
      socket.emit("error", {
        message: "Failed attempt to enter chat."
      })

      return;
    }

    if (targetUser) {
      const privateRoom = [user.username, targetUser.username].sort().join(':');
      connectUserToRoom(socket, privateRoom, user)

      logger.info(`${user.username} connected to private room ${privateRoom}.`);

      sendChatHistory(socket, privateRoom);
      return;
    }

    connectUserToRoom(socket, chatName, user);
    logger.info(`${user.username} connected to chat ${chatName}.`);

    sendChatHistory(socket, chatName);

    await emitUserStatuses(socket, chatName);

  } catch (error) {
    logger.error(`Error: ${user.username} tried to join chat ${chatName} - ${error.message}`);
    socket.emit("error", {
      message: "An error occurred while trying to join the chat."
    });
  }


};

module.exports = joinChat;
