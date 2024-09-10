const addUserChat = require("./add-user-chat");
const createUser = require("./create-user");
const createUserWithChat = require("./create-user-with-chat");
const deleteUser = require("./delete-user");
const getUsers = require("./get-users");
const removeUserChat = require("./remove-user-chat");
const updateProfileUser = require("./update-profile-user");
const updateUserRoles = require("./update-user-roles");

async function userRoutes(fastify) {
  fastify.register(addUserChat);
  fastify.register(createUser);
  fastify.register(createUserWithChat);
  fastify.register(deleteUser);
  fastify.register(getUsers);
  fastify.register(removeUserChat);
  fastify.register(updateProfileUser);
  fastify.register(updateUserRoles);
}

module.exports = userRoutes;