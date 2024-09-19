const { z } = require("zod");
const prisma = require("../../lib/prisma");

const { ForbiddenError, NotFoundError } = require("../../errors");

const authHandler = require("../../middleware/authHandler");
const permissionHandler = require("../../middleware/permissionHandler");

async function updateProfileUser(app) {
  app.patch(
    "/roles/:roleId/permissions",
    {
      preHandler: [authHandler, permissionHandler("manageRoles"), permissionHandler("managePermissions")],
      schema: {
        params: z.object({
          roleId: z.string().uuid(),
        }),
        body: z.record(
          z.union([z.boolean(), z.number()])
        ),
      },
    },
    async (request, reply) => {
      const user = request.user;

      if (!user) {
        throw new ForbiddenError("User not authenticated.")
      }

      const { roleId } = request.params

      const role = await prisma.role.findUnique({
        where: { id: roleId },
        include: {
          permissions: true
        }
      })

      if (!role) {
        throw new NotFoundError("Role does not exist.");
      }

      const newPermissions = request.body || {};

      for (const [permissionName, value] of Object.entries(newPermissions)) {
        const permission = await prisma.permission.findUnique({
          where: { name: permissionName },
        });

        if (!permission) {
          continue;
        }

        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId,
              permissionId: permission.id
            }
          },
          update: {
            value,
          },
          create: {
            roleId,
            permissionId: permission.id,
            value: value,
          },
        });
      }


      return reply.status(200).send({
        message: "Role permissions updated successfully.",
      });
    }
  );
}

module.exports = updateProfileUser;
