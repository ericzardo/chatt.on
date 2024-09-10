const createChat = require("./create-chat");
const deleteChat = require("./delete-chat");
const getChatByName = require("./get-chat-by-name");
const getChats = require("./get-chats");

async function chatRoutes(fastify) {
  fastify.register(createChat);
  fastify.register(deleteChat);
  fastify.register(getChatByName);
  fastify.register(getChats);
}

module.exports = chatRoutes;