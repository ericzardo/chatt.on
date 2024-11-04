const prisma = require("../lib/prisma")
const jwt = require("jsonwebtoken")
const logger = require("../lib/logger");

const getToken = (socket) => {
  try {
    const token = socket.handshake.auth.token;
    if (token) {
      return token;
    }
  } catch (error) {
    return;
  }
};

const connectionController = async (socket) => {
  try {

    const token = getToken(socket);

    if (!token) {
      logger.warn(`Connection attempt without token from socket: ${socket.id}`);
      socket.disconnect();
      return;
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.$transaction(async (prisma) => {
      return (
        (await prisma.user.findUnique({ where: { id } })) ||
        (await prisma.temporaryUser.findUnique({ where: { id } }))
      );
    });

    if (!user) {
      logger.warn(`No user found: disconnecting socket ${socket.id}`);
      socket.disconnect();
      return;
    }

    logger.info(`${user.username}: connected to ${socket.id}`);

  } catch (error) {
    logger.error(`Invalid connection: ${error.message}`);
    socket.disconnect();
  }
}

module.exports = connectionController;