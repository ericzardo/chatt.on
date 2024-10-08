const prisma = require("../../lib/prisma")


async function getRoles(app) {
  app.withTypeProvider().get(
    '/roles',
    async (request, reply) => {
      const roles = await prisma.role.findMany({
        include: { users: true },
        orderBy: { level: 'desc' },
      });

      return reply.status(200).send({
        roles,
        message: "Roles retrieved successfully"
      });
    },
  )
}

module.exports = getRoles;