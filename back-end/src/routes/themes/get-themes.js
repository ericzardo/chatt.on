
const prisma = require("../../lib/prisma");


async function getThemes(app) {
  app.withTypeProvider().get(
    '/themes',
    async (request, reply) => {
      const themes = await prisma.theme.findMany();

      return reply.status(200).send({
        themes,
        message: "Themes retrieved successfully"
      });
    },
  )
}

module.exports = getThemes;