const prisma = require("../lib/prisma");

class ConnectionManager {
  constructor() {
    this.connections = new Map();
  }

  addConnection(socket, user, chatName) {
    if (!this.connections.has(chatName)) {
      this.connections.set(chatName, []);
    }
    const usersInChat = this.connections.get(chatName);

    const existUser = usersInChat.findIndex(
      (connectedUser) => connectedUser.id === user.id
    );

    if (existUser !== -1) {
      usersInChat.splice(existUser, 1);
    }

    usersInChat.push({ socket_id: socket.id, ...user });

    this.connections.set(chatName, usersInChat);
  }

  removeConnection(socket, chatName) {
    if (!this.connections.has(chatName)) return

    const usersInChat = this.connections.get(chatName);
    const updatedUsersInChat = usersInChat.filter(user => user.socket_id !== socket.id);

    if (updatedUsersInChat.length > 0) {
      this.connections.set(chatName, updatedUsersInChat);
    } else {
      this.connections.delete(chatName);
    }
  }

  getOnlineChatUsers(chatName) {
    return this.connections.get(chatName) || [];
  }

  async getOfflineUsers(chatName) {
    const allUsers = await this.getAllUsersInChat(chatName);
    const onlineUsers = this.getOnlineChatUsers(chatName);

    const offlineUsers = allUsers.filter(user => {

      const isOnline = onlineUsers.some(onlineUser => onlineUser.id === user.id);

      return !isOnline && !user.is_temporary_user;
    });

    return offlineUsers || [];
  }

  async getAllUsersInChat(chatName) {
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
  }

  findTargetChatUser(chatName, target) {
    const user = this.connections.get(chatName).find(user => user.id === target.id);
    return user
  }

  async getTargetUser(socket, username) {
    const target = await prisma.user.findUnique({
      where: { username }
    })

    if (!target) {
      socket.emit("ERROR", {
        message: "This user can't receive whispers right now."
      })
      return;
    }

    return target
  }

  getOnlineUser(socket, target) {
    for (const [_, usersInChat] of this.connections.entries()) {
      const user = usersInChat.find(user => user.id === target.id);
      if (user) {
        return user
      }
    }
    socket.emit("ERROR", {
      message: `${target.username} is not online.`
    });
    return;
  }

  async getTargetSocket(username, socket, io) {

    const target = await this.getTargetUser(socket, username)

    if (!target) return;

    const targetUser = await this.getOnlineUser(socket, target);
    if (!targetUser) return;

    for (const users of this.connections.values()) {
      const existUser = users.find(activeUser => activeUser.username === targetUser.username);

      if (existUser) {
        return io.sockets.get(existUser.socket_id);
      }
    }

    socket.emit("ERROR", {
      message: `${targetUser.username} can't receive whispers right now.`
    })
  }
}

module.exports = new ConnectionManager();
