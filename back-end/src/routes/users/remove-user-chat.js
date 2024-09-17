const { z } = require("zod");
const prisma = require("../../lib/prisma");

const { ForbiddenError, NotFoundError } = require("../../errors");

const authHandler = require("../../middleware/authHandler");

async function removeUserChat(app) {
  app.withTypeProvider().delete(
    '/user-chats/:chatId',
    {
      preHandler: [authHandler],
      schema: {
        params: z.object({
          chatId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const user = request.user;

      if (!user) {
        throw new ForbiddenError("User not authenticated.")
      }

      const { chatId } = request.params;

      const chat = await prisma.chat.findUnique({
        where: { id: chatId }
      })

      if (!chat) {
        throw new NotFoundError("Chat not found.")
      }

      const chatExistsInUser = user.chats.some(c => c.id === chatId);

      if (!chatExistsInUser) {
        throw new NotFoundError("Chat not associated with this user.");
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          chats: {
            disconnect: { id: chatId },
          },
        },
      });

      return reply.status(200).send({
        user: user.id,
        message: `${chat.name} chat removed from ${user.username}`
      });
    },
  )
}

module.exports = removeUserChat;