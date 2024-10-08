const { z } = require("zod");
const prisma = require("../../lib/prisma");

const authHandler = require("../../middleware/authHandler");
const permissionHandler = require("../../middleware/permissionHandler");

async function getUsers(app) {
  app.withTypeProvider().get(
    '/users',
    {
      preHandler: [authHandler, permissionHandler("manageUsers")],
      schema: {
        querystring: z.object({
          page: z.preprocess((val) => (val ? parseInt(val, 10) : 1), z.number().min(1).default(1)),
          perPage: z.preprocess((val) => (val ? parseInt(val, 10) : 20), z.number().min(1).max(100).default(20)),
        }),
      },
    },
    async (request, reply) => {
      const { page, perPage } = request.query;

      // Check if pagination was requested
      const isPaginated = page && perPage;

      if (isPaginated) {
        const [users, totalUsers] = await Promise.all([
          prisma.user.findMany({
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: { username: 'asc' },
            include: {
              roles: true,
              chats: true,
            }
          }),
          prisma.permission.count(),
        ]);

        return reply.status(200).send({
          users,
          totalUsers,
          currentPage: page,
          totalPages: Math.ceil(totalUsers / perPage),
        });
      }

      const users = await prisma.user.findMany({
        orderBy: { username: 'asc' },
        include: {
          roles: {
            orderBy: { name: 'asc' },
          },
          chats: {
            orderBy: { name: 'asc' },
          }
        }
      });
      
      return reply.status(200).send({
        users,
        message: "Users retrieved successfully"
      });
    },
  )
}

module.exports = getUsers;