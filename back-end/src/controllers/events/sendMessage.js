const {
  findChatOrUser,
  sendPrivateMessage,
  sendGroupMessage,
  updateUserChatActivity
} = require("./utils/chatHelper")

const sendMessage = async (socket, chatName, messageInfos, io) => {
  const { user, message: messageContent } = messageInfos;

  if (!user || !messageContent) {
    socket.emit("error", {
      message: "Failed to send message."
    })

    return;
  }

  if (!user.permissions.sendMessages) {
    socket.emit("error", {
      message: "You do not have permission to send messages"
    })

    return;
  }

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
   
    return;
  }

  await sendGroupMessage(socket, chatName, message);

  await updateUserChatActivity(user, chat);

  socket.emit("chatsUpdated");
}

module.exports = sendMessage;