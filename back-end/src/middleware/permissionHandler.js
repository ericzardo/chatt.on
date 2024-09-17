const { ForbiddenError } = require("../errors");

function permissionHandler(requiredPermission) {
  return async (request, reply) => {
    const user = request.user;

    if (!user || !user.permissions) {
      throw new ForbiddenError("Not authenticated.");
    }

    if (!user.permissions[requiredPermission]) {
      throw new ForbiddenError(`You do not have permission to ${requiredPermission}.`);
    }
  };
}

module.exports = permissionHandler;