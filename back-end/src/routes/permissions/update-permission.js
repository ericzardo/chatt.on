const { z } = require("zod");
const prisma = require("../../lib/prisma");

const authHandler = require("../../middleware/authHandler");
const permissionHandler = require("../../middleware/permissionHandler");

async function updatePermission(app) {
  app.withTypeProvider().patch(
    '/permissions/:permissionId',
    {
      preHandler: [authHandler, permissionHandler("managePermissions")],
      schema: {
        params: z.object({
          permissionId: z.string().uuid(),
        }),
        body: z.object({
          name: z.string().min(4).optional(),
          type: z.string().optional(),
          description: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const { permissionId } = request.params;
      const { name, type, description } = request.body;

      const permission = await prisma.permission.update({
        where: { id: permissionId },
        data: {
          ...(name && { name }),
          ...(type && { type }),
          ...(description && { description }),
        },
      });

      if (!permission) {
        throw new NotFoundError("Permission not found.");
      }

      return reply.status(200).send({
        permission,
        message: "Permission updated successfully",
      });
    },
  );
}

module.exports = updatePermission;
