const { z } = require("zod");
const prisma = require("../../lib/prisma")

const { ForbiddenError } = require("../../errors")

const authHandler = require("../../middleware/authHandler");
const permissionHandler = require("../../middleware/permissionHandler");

async function getRoles(app) {
  app.withTypeProvider().get(
    '/roles/:roleId/permissions',
    {
      preHandler: [authHandler, permissionHandler("manageRoles"), permissionHandler("managePermissions")],
      schema: {
        params: z.object({
          roleId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const user = request.user;

      if (!user) {
        throw new ForbiddenError("User not authenticated.")
      }

      const { roleId } = request.params;

      const permissions = await prisma.rolePermission.findMany({
        where: { roleId: roleId },
        include: {
          permission: true,
        },
      });

      const formattedPermissions = permissions.map(rp => ({
        name: rp.permission.name,
        description: rp.permission.description,
        type: rp.permission.type,
        value: rp.value,
      }));

      return reply.status(200).send({
        permissions: formattedPermissions,
        message: "Role permissions retrieved successfully"
      });
    },
  )
}

module.exports = getRoles;