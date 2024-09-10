const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const { ForbiddenError, NotFoundError, ClientError } = require("../errors");

async function authHandler(request) {
  try {
    const token = request.cookies["access-token"];

    if (!token) {
      throw new ForbiddenError("Not authenticated.");
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        roles: true,
        chats: {
          include: {
            UserChatActivity: true
          }
        } 
      }
    })

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    request.user = user;

  } catch (error) {
    throw new ClientError("Invalid or missing token.")
  }
}

module.exports = authHandler;
