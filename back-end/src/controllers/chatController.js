const joinChat = require("./events/joinChat");
const leaveChat = require("./events/leaveChat");
const sendMessage = require("./events/sendMessage");
const startWhisper = require("./events/startWhisper");
const disconnect = require("./events/disconnect");

const chatController = (socket, io) => {
  socket.on("joinChat", (chatName, user) => joinChat(socket, chatName, user));

  socket.on("leaveChat", (chatName, user) => leaveChat(socket, chatName, user));

  socket.on("sendMessage", (chatName, messageInfos) => sendMessage(socket, chatName, messageInfos, io));

  socket.on("startWhisper", (user) => startWhisper(socket, user));

  socket.on("disconnect", () => disconnect(socket));

};

module.exports = chatController;
