const {
  findChatOrUser,
  emitUserStatuses,
  removeUserFromRoom
} = require("./utils/chatHelper")

const leaveChat = async (socket, chatName, user) => {
  const { chat, targetUser } = await findChatOrUser(chatName);

  if (!chat && !targetUser) {
    socket.emit("error", {
      message: "Failed to exit chat."
    })

    return;
  }

  if (targetUser) {
    const privateRoom = [user.username, targetUser.username].sort().join(':');
    removeUserFromRoom(socket, privateRoom)

    return;
  }

  removeUserFromRoom(socket, chatName)
  await emitUserStatuses(socket, chatName);
}

module.exports = leaveChat;