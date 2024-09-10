const { z } = require("zod")

const prisma = require("../../lib/prisma")
const { ForbiddenError, NotFoundError } = require("../../errors");

async function deleteChat(app) {
  app.withTypeProvider().delete(
    "/:themeId/chats/:chatId",
    {
      preHandler: [require("../../middleware/authHandler")],
      schema: {
        params: z.object({
          themeId: z.string().uuid(),
          chatId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const user = request.user;

      if (!user) {
        throw new ForbiddenError("User not authenticated.")
      }

      const { themeId, chatId } = request.params;

      const [theme, chat] = await prisma.$transaction([
        prisma.theme.findUnique({
          where: { id: themeId },
          include: {
            chats: true,
          },
        }),
        prisma.chat.findUnique({
          where: { id: chatId },
        }),
      ]);

      if (!theme) {
        throw new NotFoundError("Theme does not exist.");
      }

      if (!chat) {
        throw new NotFoundError("Chat not found.");
      }

      if (!theme.chats.some(c => c.id === chatId)) {
        throw new NotFoundError("Chat not found in this theme.");
      }

      await prisma.$transaction([
        prisma.chat.delete({
          where: { id: chatId },
        }),
        prisma.theme.update({
          where: { id: themeId },
          data: {
            number_of_chats: {
              decrement: 1,
            },
          },
        }),
      ]);

      return reply.status(200).send({
        message: `Chat "${chat.id}" deleted successfully`
      });
    },
  )
}

module.exports = deleteChat;