const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const logger = require("../lib/logger");
const getUserFormatted = require("../utils/getUserFormatted");

const websocketHandler = async (socket, next) => {
  if (socket.authenticated) {
    return next();
  }
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      logger.warn(`Connection attempt without token from socket: ${socket.id}`);
      return next(new Error("Not authenticated."));
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    let user = await getUserFormatted(id);

    if (!user) {
      user = await prisma.temporaryUser.findUnique({ where: { id } })
    }

    if (!user) {
      logger.warn(`No user found: disconnecting socket ${socket.id}`);
      return next(new Error("Not authenticated."));
    }

    logger.info(`${user.username} connected to ${socket.id}`);
    socket.user = user;
    socket.authenticated = true;
    next();
  } catch (err) {
    return next(new Error("Not authenticated."));
  }
}

module.exports = websocketHandler;