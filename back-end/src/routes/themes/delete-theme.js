const { z } = require("zod")
const prisma = require("../../lib/prisma")

const { NotFoundError } = require("../../errors")

async function deleteTheme(app) {
  app.withTypeProvider().delete(
    '/themes/:themeId',
    {
      preHandler: [require("../../middleware/authHandler")],
      schema: {
        params: z.object({
          themeId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const user = request.user;

      if (!user) {
        throw new ForbiddenError("User not authenticated.")
      }

      const { themeId } = request.params;

      const theme = await prisma.theme.findUnique({
        where: { id: themeId },
      });

      if (!theme) {
        throw new NotFoundError("Theme does not exist.");
      }

      await prisma.chat.deleteMany({
        where: { theme_id: theme.id },
      });

      await prisma.theme.delete({
        where: { id: theme.id },
      });

      return reply.status(200).send({
        message: `Theme "${theme.id}" deleted`
      });
    },
  )
}

module.exports = deleteTheme;