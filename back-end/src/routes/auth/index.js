const authLogin = require("./auth-login");
const authUser = require("./auth-user");
const authLogout = require("./auth-logout");

const forgotPassword = require("./forgot-password");
const resetPassword = require("./reset-password")

async function authRoutes(fastify) {
  fastify.register(authLogin);
  fastify.register(authUser);
  fastify.register(authLogout);
  fastify.register(forgotPassword);
  fastify.register(resetPassword);
}

module.exports = authRoutes;