const handleConnect = (socket, chatName) => {
  socket.emit("JOIN_CHAT", { chatName });
};

const handleLeave = (socket, chatName) => {
  socket.emit("LEAVE_CHAT", { chatName });
};

const handleSendMessage = (socket, message, chatName) => {
  socket.emit("SEND_MESSAGE", { message, chatName });
};

export { handleConnect, handleLeave, handleSendMessage };