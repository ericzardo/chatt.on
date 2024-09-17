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

    const highestRole = user.roles.reduce((max, role) => (role.level > max.level ? role : max), { level: -1 });
    
    if (highestRole) {
      user.permissions = highestRole.permissions;
    } else {
      user.permissions = {
				joinRooms: true,
				manageRoles: false,
				manageRooms: false,
				manageUsers: false,
				sendMessages: true,
				editUserProfiles: true,
        editUserRoles: false,
        maxChats: 3
			};
    }

    request.user = user;
  } catch (error) {
    throw new ClientError("Invalid or missing token.")
  }
}

module.exports = authHandler;
