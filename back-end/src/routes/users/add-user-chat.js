const { z } = require("zod");
const prisma = require("../../lib/prisma");

const { ForbiddenError, NotFoundError } = require("../../errors");

const authHandler = require("../../middleware/authHandler");
const permissionHandler = require("../../middleware/permissionHandler");

async function addUserChat(app) {
  app.withTypeProvider().post(
    '/user-chats/:chatId',
    {
      preHandler: [authHandler, permissionHandler("joinRooms"), permissionHandler("maxChats")],
      schema: {
        params: z.object({
          chatId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { chatId } = request.params;
      const user = request.user;

      if (!user) {
        throw new ForbiddenError("User not authenticated.")
      }

      if (!chatId) {
        throw new ForbiddenError("Chat ID is required.")
      }

      const chat = await prisma.chat.findUnique({
        where: { id: chatId }
      })

      if (!chat) {
        throw new NotFoundError("Chat not found.")
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          chats: {
            connect: { id: chatId },
          },
        },
      });

      await prisma.userChatActivity.upsert({
        where: {
          user_id_chat_id: {
            user_id: user.id,
            chat_id: chatId,
          }
        },
        update: { last_active: new Date() },
        create: {
          user_id: user.id,
          chat_id: chatId,
          last_active: new Date(),
        },
      })

      return reply.status(200).send({
        user: user.id,
        message: `${chat.name} chat added to ${user.username}`
      });
    },
  )
}

module.exports = addUserChat;