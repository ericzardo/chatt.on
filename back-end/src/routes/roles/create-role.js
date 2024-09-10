const { z } = require("zod")

const prisma = require("../../lib/prisma")
const { ClientError } = require("../../errors")

async function createRole(app) {
  app.withTypeProvider().post(
    "/roles",
    {
      preHandler: [require("../../middleware/authHandler")],
      schema: {
        body: z.object({
          name: z.string().min(4),
          permissions: z.any().optional(),
        }),
      },
    },
    async (request, reply) => {
      const user = request.user;

      if (!user) {
        throw new ForbiddenError("User not authenticated.")
      }

      const { name, permissions } = request.body

      const existsRole = await prisma.role.findUnique({
        where: { name }
      });

      if (existsRole) {
        throw new ClientError("Role already exists.");
      }

      const role = await prisma.role.create({
        data: { 
          name,
          permissions: permissions || {}
        },
      })

      return reply.status(201).send({
        role: role.id,
        message: `Role "${role.id}" created successfully`
      });
    },
  )
}

module.exports = createRole;