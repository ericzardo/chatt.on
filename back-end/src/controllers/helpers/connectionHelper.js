const logger = require("../../lib/logger");
const ConnectionManager = require("../../services/ConnectionManager");

const connectUserToRoom = async (socket, user, chatName) => {
  ConnectionManager.addConnection(socket, user, chatName);
  socket.join(chatName);
  socket.currentChat = chatName;
  logger.info(`${user.username} joined to ${chatName} room.`);
};

const connectUserToWhisper = async (socket, user, targetUsername) => {
  const target = await ConnectionManager.getTargetUser(socket, targetUsername);

  if (!target) return;

  const sortedUsers = [target.username, user.username].sort();
  const whisperRoomName = `${sortedUsers[0]}=${sortedUsers[1]}`;

  ConnectionManager.addConnection(socket, user, whisperRoomName);
  socket.join(whisperRoomName);
  socket.currentChat = whisperRoomName;

  logger.info(`${user.username} joined whisper room ${whisperRoomName}.`);

  return whisperRoomName;
};

const removeUserFromRoom = (socket, chatName) => {
  ConnectionManager.removeConnection(socket, chatName);
  socket.leave(chatName);
  socket.currentChat = null;
  logger.info(`${socket.id} leaves ${chatName} room.`);
}

module.exports = {
  connectUserToRoom, connectUserToWhisper, removeUserFromRoom
}