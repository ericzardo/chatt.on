const { z } = require("zod")
const prisma = require("../../lib/prisma")

const { NotFoundError } = require("../../errors")

async function deleteRole(app) {
  app.withTypeProvider().delete(
    '/roles/:roleId',
    {
      preHandler: [require("../../middleware/authHandler")],
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

      const role = await prisma.role.findUnique({
        where: { id: roleId },
      });

      if (!role) {
        throw new NotFoundError("Role does not exist.");
      }

      await prisma.role.delete({
        where: { id: role.id },
      });

      return reply.status(200).send({
        message: `Role "${role.id}" deleted`
      });
    },
  )
}

module.exports = deleteRole;