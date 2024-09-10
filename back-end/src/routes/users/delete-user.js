const { z } = require("zod");
const prisma = require("../../lib/prisma")

const { ForbiddenError, NotFoundError } = require("../../errors");

async function deleteUser(app) {
  app.withTypeProvider().delete(
    '/users/:userId',
    {
      preHandler: [require("../../middleware/authHandler")],
      schema: {
        params: z.object({
          userId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const user = request.user;

      if (!user) {
        throw new ForbiddenError("User not authenticated.")
      }

      const { userId } = request.params;

      const userToDelete = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: true,
        }
      });

      if (!userToDelete) {
        throw new NotFoundError("User does not exist.");
      }

      const isUserAdmin = userToDelete.roles.find(role => role.name === "admin");

      if (isUserAdmin) {
        throw new ForbiddenError("Can't delete an administrator");
      }

      await prisma.user.delete({
        where: { id: userToDelete.id },
      });

      return reply.status(200).send({
        message: `User "${user.id}" deleted`
      });
    },
  )
}

module.exports = deleteUser;