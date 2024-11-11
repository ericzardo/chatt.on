const logger = require("../../lib/logger");
const ConnectionManager = require("../../services/ConnectionManager");
const MessageManager = require("../../services/MessageManager");

const { connectUserToWhisper } = require("./connectionHelper")

const sendPrivateMessage = async (socket, infos, message, io) => {
  const { from: user, toUsername: targetUsername } = infos;

  const isValidMessage = MessageManager.validateMessage(user, message, socket)

  if (!isValidMessage) return;

  const whisperRoomName = await connectUserToWhisper(socket, user, targetUsername);

  const targetSocket = await ConnectionManager.getTargetSocket(targetUsername, socket, io)

  if (!targetSocket) return;

  const messageInfos = {
    user,
    message,
    timestamp: new Date(),
  };

  socket.to(whisperRoomName).emit("RECEIVE_MESSAGE", messageInfos);
  socket.emit("RECEIVE_MESSAGE", messageInfos);

  targetSocket.emit("RECEIVE_WHISPER", { user })

  MessageManager.addMessage(whisperRoomName, messageInfos);
  logger.info(`${user.username} send '${message}' message in ${whisperRoomName}.`);
}

const startWhisper = (socket, target) => {
  const [chat, user] = [socket.currentChat, socket.user];
  const targetUser = ConnectionManager.findTargetChatUser(chat, target);

  if (!targetUser) {
    logger.warn(`${user.username} can't start whisper`);
    socket.emit("ERROR", {
      message: "It's impossible to talk to this user right now"
    })
    return;
  }

  const onlineUser = ConnectionManager.getOnlineUser(socket, targetUser);

  if (!onlineUser) {
    logger.warn(`${user.username} tried to whisper to offline user ${targetUser.username}.`);
    socket.emit("error", {
      message: "It is not possible to talk to a user offline"
    });
    return;
  }

  socket.emit("WHISPER_START", { target: onlineUser })

}

module.exports = { sendPrivateMessage, startWhisper }