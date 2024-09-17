const { z } = require("zod");
const prisma = require("../../lib/prisma");

const { ForbiddenError, NotFoundError } = require("../../errors");

const authHandler = require("../../middleware/authHandler");
const permissionHandler = require("../../middleware/permissionHandler");

async function updateProfileUser(app) {
  app.patch(
    "/roles/:roleId/permissions",
    {
      preHandler: [authHandler, permissionHandler("manageRoles")],
      schema: {
        params: z.object({
          roleId: z.string().uuid(),
        }),
        body: z.object({
          viewRooms: z.boolean().optional(),
          joinRooms: z.boolean().optional(),
          sendMessages: z.boolean().optional(),
          viewUserProfiles: z.boolean().optional(),
          editUserProfiles: z.boolean().optional(),
          manageUsers: z.boolean().optional(),
          manageRooms: z.boolean().optional(),
          manageRoles: z.boolean().optional(),
        }),
      },
    },
    async (request, reply) => {
      const user = request.user;

      if (!user) {
        throw new ForbiddenError("User not authenticated.")
      }

      const { roleId } = request.params

      const role = await prisma.role.findUnique({
        where: {id: roleId}
      })

      if (!role) {
        throw new NotFoundError("Role does not exist.");
      }

      const permissions = request.body;

      await prisma.role.update({
        where: { id: roleId },
        data: {
          permissions: {
            ...permissions
          },
        },
      });

      return reply.status(200).send({
        message: "Role permissions updated successfully.",
      });
    }
  );
}

module.exports = updateProfileUser;
