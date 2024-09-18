const { z } = require("zod");
const prisma = require("../../lib/prisma")

const { ForbiddenError, NotFoundError } = require("../../errors");

const authHandler = require("../../middleware/authHandler");
const permissionHandler = require("../../middleware/permissionHandler");

async function deleteUser(app) {
  app.withTypeProvider().delete(
    '/permissions/:permissionId',
    {
      preHandler: [authHandler, permissionHandler("managePermissions")],
      schema: {
        params: z.object({
          permissionId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const user = request.user;

      if (!user) {
        throw new ForbiddenError("User not authenticated.")
      }

      const { permissionId } = request.params;

      const permissionToDelete = await prisma.permission.findUnique({
        where: { id: permissionId },
      });

      if (!permissionToDelete) {
        throw new NotFoundError("Permission does not exist.");
      }

      await prisma.rolePermission.deleteMany({
        where: { permissionId: permissionId },
      });

      await prisma.permission.delete({
        where: { id: permissionId },
      });

      return reply.status(200).send({
        message: `Permission "${permissionToDelete.name}" deleted successfully.`,
      });
    },
  )
}

module.exports = deleteUser;