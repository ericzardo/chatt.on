const getRples = require("./get-roles");
const deleteRole = require("./delete-role");
const createRole = require("./create-role");

async function roleRoutes(fastify) {
  fastify.register(getRples);
  fastify.register(deleteRole);
  fastify.register(createRole);
}

module.exports = roleRoutes;