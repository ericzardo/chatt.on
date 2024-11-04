const {
  findChatOrUser,
  emitUserStatuses,
  removeUserFromRoom
} = require("./utils/chatHelper");
const logger = require("../../lib/logger");

const leaveChat = async (socket, chatName, user) => {
  logger.info(`${socket.id} is attempting to leave chat ${chatName}.`);

  try {
    const { chat, targetUser } = await findChatOrUser(chatName);

    if (!chat && !targetUser) {
      logger.warn(`${socket.id} failed to exit chat`);
      socket.emit("error", {
        message: "Failed to exit chat."
      })

      return;
    }

    if (targetUser) {
      const privateRoom = [user.username, targetUser.username].sort().join(':');

      removeUserFromRoom(socket, privateRoom);
      logger.info(`${user.username} left private room with ${targetUser.username}.`);

      return;
    }

    removeUserFromRoom(socket, chatName)
    await emitUserStatuses(socket, chatName);

    logger.info(`${user.username} left chat ${chatName}.`);
  } catch (error) {
    logger.error(`Error: ${socket.id} tried to leave chat ${chatName} - ${error.message}`);
    socket.emit("error", {
      message: "An error occurred while trying to leave the chat."
    });
  }


}

module.exports = leaveChat;