const {
  findChatOrUser,
  connectUserToRoom,
  sendChatHistory,
  emitUserStatuses
} = require("./utils/chatHelper")

const joinChat = async (socket, chatName, user) => {
  const { chat, targetUser } = await findChatOrUser(chatName);

  if (!chat && !targetUser) {
    socket.emit("error", {
      message: "Failed attempt to enter chat."
    })

    return;
  }

  if (targetUser) {
    const privateRoom = [user.username, targetUser.username].sort().join(':');
    connectUserToRoom(socket, privateRoom, user)

    sendChatHistory(socket, privateRoom);
    return;
  }

  connectUserToRoom(socket, chatName, user)
  sendChatHistory(socket, chatName);

  await emitUserStatuses(socket, chatName);

};

module.exports = joinChat;
