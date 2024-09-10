const { z } = require("zod")

const prisma = require("../../lib/prisma")
const { ClientError } = require("../../errors")

async function createTheme(app) {
  app.withTypeProvider().post(
    "/themes",
    {
      preHandler: [require("../../middleware/authHandler")],
      schema: {
        body: z.object({
          name: z.string().min(4),
        }),
      },
    },
    async (request, reply) => {
      const user = request.user;

      if (!user) {
        throw new ForbiddenError("User not authenticated.")
      }

      const { name } = request.body

      const existsTheme = await prisma.theme.findUnique({
        where: { name }
      });

      if (existsTheme) {
        throw new ClientError("Theme already exists.");
      }

      const theme = await prisma.theme.create({
        data: { name },
      })

      return reply.status(201).send({
        theme: theme.id,
        message: `Theme "${theme.id}" created successfully`
      });
    },
  )
}

module.exports = createTheme;