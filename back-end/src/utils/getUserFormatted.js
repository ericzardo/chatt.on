const prisma = require("../lib/prisma");
const logger = require("../lib/logger");
const { ForbiddenError } = require("../errors")

const getUserFormatted = async (id) => {
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

  user.chats.sort((a, b) => {
    const aLastActive = a.UserChatActivity.sort((activityA, activityB) => new Date(activityB.last_active) - new Date(activityA.last_active))[0]?.last_active || new Date(0);
    const bLastActive = b.UserChatActivity.sort((activityA, activityB) => new Date(activityB.last_active) - new Date(activityA.last_active))[0]?.last_active || new Date(0);
    return new Date(bLastActive) - new Date(aLastActive);
  });

  const highestRole = user.roles.reduce((max, role) => (role.level > max.level ? role : max), { level: -1 });

  if (!highestRole) {
    logger.warn(`${user.username} has no role with permissions assigned.`);
    throw new ForbiddenError("No role with permissions assigned.");
  }

  user.permissions = highestRole.permissions.reduce((perms, rolePerm) => {
    perms[rolePerm.permission.name] = rolePerm.value;
    return perms;
  }, {});

  return user;
}

module.exports = getUserFormatted;