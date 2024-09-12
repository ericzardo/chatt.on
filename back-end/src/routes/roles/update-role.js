const { z } = require("zod");
const prisma = require("../../lib/prisma");

const { ForbiddenError, NotFoundError } = require("../../errors")

async function updateProfileUser(app) {
  app.patch(
    "/roles/:roleId",
    {
      preHandler: [require("../../middleware/authHandler")],
      schema: {
        params: z.object({
          roleId: z.string().uuid(),
        }),
        body: z.object({
          name: z.string().min(4),
          color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
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

      const { name, color } = request.body;

      await prisma.role.update({
        where: { id: roleId },
        data: {
          ...(name && { name }),
          ...(color && { color })
        },
      });

      return reply.status(200).send({
        message: "Role permissions updated successfully.",
      });
    }
  );
}

module.exports = updateProfileUser;
