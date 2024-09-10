const { z } = require("zod")

const prisma = require("../../lib/prisma")

const { ClientError } = require("../../errors")

async function createChat(app) {
  app.withTypeProvider().post(
    "/:themeId/chats",
    {
      preHandler: [require("../../middleware/authHandler")],
      schema: {
        body: z.object({
          name: z.string().min(4),
          bannerImageURL: z.string().optional().default(""),
          description: z.string().optional().default(""),
        }),
        params: z.object({
          themeId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
        const { name, bannerImageURL, description } = request.body;
        const { themeId } = request.params;

        if (!themeId) {
          throw new ForbiddenError("Theme ID is required.")
        }

        const theme = await prisma.theme.findUnique({
          where: { id: themeId },
          include: {
            chats: true
          }
        });

        if (!theme) {
          throw new NotFoundError("Theme not found.")
        }

        const existsChat = theme.chats.find(chat => chat.name === name);

        
        if (existsChat) {
          throw new ClientError("Chat already exists.");
        }

        const [chat] = await prisma.$transaction([
          prisma.chat.create({
            data: {
              name,
              banner_image_url: bannerImageURL,
              description,
              theme: {
                connect: { id: theme.id }
              }
            }
          }),
          prisma.theme.update({
            where: { id: theme.id },
            data: {
              number_of_chats: {
                increment: 1,
              }
            }
          })
        ]);

        return reply.status(201).send({
          chat: chat.id,
          message: `Chat "${chat.id}" created`
        });
    },
  )
}

module.exports = createChat;