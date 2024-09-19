const { ForbiddenError } = require("../errors");

function permissionHandler(requiredPermission) {
  return async (request, reply) => {
    const user = request.user;

    if (!user || !user.permissions) {
      throw new ForbiddenError("Not authenticated.");
    }

    const permissionValue = user.permissions[requiredPermission];

    if (typeof permissionValue === "boolean" && !permissionValue) {
      throw new ForbiddenError(`You do not have permission to ${requiredPermission}.`);
    }

    if (typeof permissionValue === "number" && permissionValue < 0) {
      throw new ForbiddenError(`Your plan does not allow ${requiredPermission}.`);
    }
  };
}

module.exports = permissionHandler;