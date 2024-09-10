const { z } = require("zod");
const prisma = require("../../lib/prisma");

const { NotFoundError } = require("../../errors")


async function getThemeByName(app) {
  app.withTypeProvider().get(
    '/themes/:themeName',
    {
      schema: z.object({
        params: z.object({
          themeName: z.string()
        })
      })
    },
    async (request, reply) => {
      const { themeName } = request.params

      const theme = await prisma.theme.findUnique({
        where: {
          name: themeName
        }
      });

      if (!theme) {
        throw new NotFoundError("Theme not found.");
      }

      return reply.status(200).send({
        theme,
        message: "Theme retrieved successfully."
      });
    },
  )
}

module.exports = getThemeByName;