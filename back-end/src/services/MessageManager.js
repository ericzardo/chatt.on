class MessageManager {
  constructor() {
    this.messages = new Map();
  }

  validateMessage = (user, message, socket) => {
    if (!user || !message) {
      socket.emit("ERROR", { message: "Failed to send message." });
      return false;
    }
    if (!user.permissions.sendMessages) {
      socket.emit("ERROR", { message: "You do not have permission to send messages" });
      return false;
    }
    return true;
  }

  addMessage(chatName, message) {
    if (!this.messages.has(chatName)) {
      this.messages.set(chatName, []);
    }

    const chatMessages = this.messages.get(chatName);
    chatMessages.push(message);

    this.messages.set(chatName, chatMessages);
  }

  getMessages(chatName) {
    return this.messages.get(chatName) || [];
  }

  clearChat(chatName) {
    this.messages.delete(chatName);
  }

}

module.exports = new MessageManager();
