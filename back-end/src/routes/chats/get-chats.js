const { z } = require("zod");
const prisma = require("../../lib/prisma");
const ConnectionManager = require("../../services/ConnectionManager")

const { NotFoundError } = require("../../errors");

async function getChats(app) {
  app.withTypeProvider().get(
    '/:themeId/chats',
    {
      schema: {
        params: z.object({
          themeId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { themeId } = request.params;

      const theme = await prisma.theme.findUnique({
        where: { id: themeId },
        include: {
          chats: true,
        }
      });

      if (!theme) {
        throw new NotFoundError("Theme does not exist.");
      }

      const chats = await Promise.all(theme.chats.map(async (chat) => {
        const onlineUsers = ConnectionManager.getOnlineChatUsers(chat.name).length;
        return {
          ...chat,
          online_users: onlineUsers,
        };
      }));

      return reply.status(200).send({
        chats,
        message: "Chats retrieved successfully"
      });
    },
  )
}

module.exports = getChats;