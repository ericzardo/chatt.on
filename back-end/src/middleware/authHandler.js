const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const logger = require("../lib/logger");
const { ForbiddenError, NotFoundError, ClientError } = require("../errors");

async function authHandler(request) {

  try {
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn("Authentication failed: No token or malformed token.");
      throw new ForbiddenError("Not authenticated.");
    }

    const token = authHeader.split(' ')[1];

    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        },
        chats: {
          include: {
            UserChatActivity: true
          }
        }
      }
    })

    if (!user) {
      logger.warn(`User not found.`);
      throw new NotFoundError("User not found.");
    }

    const highestRole = user.roles.reduce((max, role) => (role.level > max.level ? role : max), { level: -1 });

    if (!highestRole) {
      logger.warn(`${user.username} has no role with permissions assigned.`);
      throw new ForbiddenError("No role with permissions assigned.");
    }

    user.permissions = highestRole.permissions.reduce((perms, rolePerm) => {
      perms[rolePerm.permission.name] = rolePerm.value;
      return perms;
    }, {});

    request.user = user;
    logger.info(`${user.username} authenticated.`);
  } catch (error) {
    logger.error(`Unexpected error during authentication: ${error.message}`);
    throw new ClientError("Invalid or missing token.")
  }
}

module.exports = authHandler;
