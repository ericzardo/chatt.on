const { sendChatHistory, sendUserStatuses } = require("./helpers/chatHelper");
const { connectUserToRoom, connectUserToWhisper, removeUserFromRoom } = require("./helpers/connectionHelper");
const { sendMessage } = require("./helpers/messagesHelper");
const { updateUserChatActivity } = require("./helpers/userHelper");
const { sendPrivateMessage, startWhisper } = require("./helpers/whisperHelper");

module.exports = (socket, io) => {
  socket.on("JOIN_CHAT", async ({ chatName }) => {
    const user = socket.user;

    const isWhisperRoom = chatName.startsWith("@");

    if (isWhisperRoom) {
      const targetUsername = chatName.slice(1);

      const whisperRoomName = await connectUserToWhisper(socket, user, targetUsername)

      await sendUserStatuses(socket, whisperRoomName);
      sendChatHistory(socket, whisperRoomName);

      return
    }

    connectUserToRoom(socket, user, chatName)

    await sendUserStatuses(socket, chatName);

    sendChatHistory(socket, chatName);
  });

  socket.on("LEAVE_CHAT", async ({ chatName }) => {
    removeUserFromRoom(socket, chatName)

    await sendUserStatuses(socket, chatName);
  });

  socket.on("SEND_MESSAGE", async ({ message, chatName }) => {
    const user = socket.user;

    const isWhisperRoom = chatName.startsWith("@");

    if (isWhisperRoom) {
      const targetUsername = chatName.slice(1);
      const infos = { from: user, toUsername: targetUsername }

      sendPrivateMessage(socket, infos, message, io);

      return;
    }

    sendMessage(socket, { user, message, chatName });

    await updateUserChatActivity(user, chatName);

    socket.emit("CHATS_UPDATED");
  })

  socket.on("WHISPER_START", ({ targetUser }) => {
    startWhisper(socket, targetUser);
  })

  socket.on("disconnect", () => {
    removeUserFromRoom(socket, socket?.currentChat);
  });
};