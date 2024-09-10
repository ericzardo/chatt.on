class MessageManager {
  constructor() {
    this.messages = new Map();
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
