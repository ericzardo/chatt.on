const prisma = require("../lib/prisma")
const jwt = require("jsonwebtoken")

const getToken = (socket) => {
  try {
    return socket.handshake.headers.cookie
    ?.split("; ")
    .find((row) => row.startsWith("access-token="))
    ?.split("=")[1];
  } catch (error) {
    return undefined
  }
  
}

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