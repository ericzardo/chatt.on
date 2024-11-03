const prisma = require("../lib/prisma")
const jwt = require("jsonwebtoken")

const getToken = (socket) => {
  try {
    const authHeader = socket.handshake.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
  } catch (error) {
    return;
  }
};

const connectionController = async (socket) => {
  try {

    const token = getToken(socket)

    if (!token) {
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
      socket.disconnect();
      return;
    }

  } catch (error) {
    socket.disconnect();
    console.error("Invalid connection:", error.message);
  }
}

module.exports = connectionController;