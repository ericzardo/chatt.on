const {
  findChatOrUser,
  sendPrivateMessage,
  sendGroupMessage,
  updateUserChatActivity
} = require("./utils/chatHelper")
const logger = require("../../lib/logger");

const sendMessage = async (socket, chatName, messageInfos, io) => {
  logger.info(`${socket.id} is attempting to send a message to ${chatName}.`);

  const { user, message: messageContent } = messageInfos;

  if (!user || !messageContent) {
    logger.warn(`Failed to send message from socket ${socket.id}: Missing user or message content.`);
    socket.emit("error", {
      message: "Failed to send message."
    })

    return;
  }

  if (!user.permissions.sendMessages) {
    logger.warn(`${socket.username} attempted to send a message without permission.`);
    socket.emit("error", {
      message: "You do not have permission to send messages"
    })

    return;
  }

  try {
    const { chat, targetUser } = await findChatOrUser(chatName);

    const message = {
      user,
      targetUser,
      message: messageContent,
      timestamp: new Date(),
    };

    if (targetUser) {
      const privateRoom = [user.username, targetUser.username].sort().join(':');

      await sendPrivateMessage(socket, privateRoom, message, io);
      logger.info(`Private message from ${user.username} to ${targetUser.username} sent.`);

      return;
    }

    await sendGroupMessage(socket, chatName, message);
    logger.info(`Group message from ${user.username} to chat ${chatName} sent.`);

    await updateUserChatActivity(user, chat);

    socket.emit("chatsUpdated");

  } catch (error) {
    logger.error(`Error: ${socket.id} sending message to chat ${chatName} - ${error.message}`);
    socket.emit("error", {
      message: "An error occurred while sending the message."
    });
  }
}

module.exports = sendMessage;