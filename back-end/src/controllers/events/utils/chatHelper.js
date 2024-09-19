const prisma = require("../../../lib/prisma");
const ConnectionManager = require("../../../services/ConnectionManager");
const MessageManager = require("../../../services/MessageManager");
const { ClientError } = require("../../../errors");

const findChatOrUser = async (roomName) => {
  const data = {
    chat: null,
    targetUser: null
  }

  const chat = await prisma.chat.findUnique({ where: { name: roomName } });
  if (chat) {
    data.chat = chat;
    return data;
  }

  const targetUser = await prisma.user.findUnique({
    where: {
      username: roomName
    },
    include: {
      roles: true
    }
  });
  if (targetUser) {
    data.targetUser = targetUser;
    return data;
  }

  return data;
};

const findUserByUsername = async (username) => {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      roles: true
    }
  });

  return user
}

const connectUserToRoom = (socket, roomName, user) => {
  socket.join(roomName);
  ConnectionManager.addConnection(socket, roomName, user);
};

const removeUserFromRoom = (socket, roomName) => {
  socket.leave(roomName);
  ConnectionManager.removeConnection(socket);
}

const sendChatHistory = (socket, roomName) => {
  const chatHistory = MessageManager.getMessages(roomName) || [];
  socket.emit("chatHistory", chatHistory);
};

const emitUserStatuses = async (socket, roomName) => {
  const onlineUsers = ConnectionManager.getOnlineUsers(roomName) || [];
  socket.to(roomName).emit("onlineUsers", onlineUsers);
  socket.emit("onlineUsers", onlineUsers);

  const offlineUsers = await ConnectionManager.getOfflineUsers(roomName);
  socket.to(roomName).emit("offlineUsers", offlineUsers);
  socket.emit("offlineUsers", offlineUsers);
};

const sendPrivateMessage = async (socket, privateRoom, message, io) => {
  const targetSocket = ConnectionManager.getSocketUser(message.targetUser, io);
  if (!targetSocket) return;

  MessageManager.addMessage(privateRoom, message);
  socket.to(privateRoom).emit("receiveMessage", message);
  socket.emit("receiveMessage", message);
  targetSocket.emit("receiveWhisper", { targetUser: message.user });
  
};

const sendGroupMessage = async (socket, chatName, message) => {
  MessageManager.addMessage(chatName, message);
  socket.to(chatName).emit("receiveMessage", message);
  socket.emit("receiveMessage", message);
};

const updateUserChatActivity = async (user, chat) => {
  try {
    if (user?.is_temporary_user) return;
    
    await prisma.userChatActivity.update({
      where: {
        user_id_chat_id: {
          user_id: user.id,
          chat_id: chat.id,
        },
      },
      data: { last_active: new Date() },
    });
  } catch (error) {
    throw new ClientError("Error updating user chat activity")
  }
  
};

const isUserReadyToStartWhisper = (user) => {
  if (!user) return false;

  const onlineUsers = ConnectionManager.getOnlineUsers(user.username);
  
  for (const [roomName, usersList] of Object.entries(onlineUsers)) {

    usersList.map(currentUser => {
      if (currentUser.id === user.id ) return true;
    })
  }

  return false;
}

module.exports = { 
  findChatOrUser,
  findUserByUsername,
  connectUserToRoom,
  sendChatHistory,
  emitUserStatuses,
  removeUserFromRoom,
  sendPrivateMessage,
  sendGroupMessage,
  updateUserChatActivity,
  isUserReadyToStartWhisper
};
