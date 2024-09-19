const getRples = require("./get-roles");
const deleteRole = require("./delete-role");
const createRole = require("./create-role");
const updateRolePermission = require("./update-role-permissions");
const updateRole = require("./update-role");
const updateRolesLevels = require("./update-roles-levels");
const getRolesPermissions = require("./get-roles-permissions");

async function roleRoutes(fastify) {
  fastify.register(getRples);
  fastify.register(deleteRole);
  fastify.register(createRole);
  fastify.register(updateRole);
  fastify.register(updateRolePermission);
  fastify.register(updateRolesLevels);
  fastify.register(getRolesPermissions);
}

module.exports = roleRoutes;