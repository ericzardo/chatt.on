const getPermissions = require("./get-permissions");
const createPermission = require("./create-permission");
const deletePermission = require("./delete-permission");
const updatePermission = require("./update-permission")

async function permissionRoutes(fastify) {
  fastify.register(getPermissions);
  fastify.register(createPermission);
  fastify.register(deletePermission);
  fastify.register(updatePermission);
}

module.exports = permissionRoutes;