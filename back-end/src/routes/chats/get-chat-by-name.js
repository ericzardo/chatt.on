const { z } = require("zod");
const prisma = require("../../lib/prisma");

const { NotFoundError } = require("../../errors")


async function getChatByName(app) {
  app.withTypeProvider().get(
    '/chats/:chatName',
    {
      schema: z.object({
        params: z.object({
          chatName: z.string()
        })
      })
    },
    async (request, reply) => {
      const { chatName } = request.params

      const chat = await prisma.chat.findUnique({
        where: {
          name: chatName
        }
      });

      if (!chat) {
        throw new NotFoundError("Chat not found.");
      }

      return reply.status(200).send({
        chat,
        message: "Chat sent successfully"
      });   
    },
  )
}

module.exports = getChatByName;