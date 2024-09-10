const prisma = require("../lib/prisma");
const { ClientError } = require("../errors")

class ConnectionManager {
  constructor() {
    this.connections = new Map();
  }

  addConnection(socket, chatName, user) {
    if (!this.connections.has(chatName)) {
      this.connections.set(chatName, []);
    }

    const usersInChat = this.connections.get(chatName);
    usersInChat.push({ socket_id: socket.id, ...user });

    this.connections.set(chatName, usersInChat);
  }

  removeConnection(socket) {

    for (const [chatName, users] of this.connections.entries()) {

      const updatedUsers = users.filter(user => user.socket_id !== socket.id);
      this.connections.set(chatName, updatedUsers);

      if (updatedUsers.length === 0) {
        this.connections.delete(chatName);
      }
    }
  }

  getOnlineUsers(chatName) {
    return this.connections.get(chatName) || [];
  }

  async getOfflineUsers(chatName) {
    const allUsers = await this.getAllUsersInChat(chatName);
    const onlineUsers = this.getOnlineUsers(chatName);

    const offlineUsers = allUsers.filter(user => {

      const isOnline = onlineUsers.some(onlineUser => onlineUser.id === user.id);

      return !isOnline && !user.is_temporary_user;
    });

    return offlineUsers || [];
  }

  async getAllUsersInChat (chatName) {
    try {
      return await prisma.user.findMany({
        where: {
          chats: {
            some: {
              name: chatName,
            },
          },
        },
        include: {
          roles: true,
        },
      });
    } catch (error) {
      throw new ClientError("Error fetching users from the database");
    }
    
  }

  getChatName(socket) {
    for (const [chatName, users] of this.connections.entries()) {
      if (users.some(user => user.socket_id === socket.id)) {
        return chatName;
      }
    }
    return null;
  }

  getSocketUser(user, io) {
    for (const users of this.connections.values()) {
      const existUser = users.find(activeUser => activeUser.username === user.username);

      if (existUser) {
        return io.of("/chat").sockets.get(existUser.socket_id);
      }
    }
    return null;
  }
}

module.exports = new ConnectionManager();
