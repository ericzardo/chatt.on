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
      const { page, per_page } = request.query;

      // Check if pagination was requested
      const isPaginated = page && per_page;

      if (isPaginated) {
        const users = await prisma.user.findMany({
          skip: (page - 1) * per_page,
          take: per_page,
          orderBy: { username: 'asc' },
          include: {
            roles: true,
            chats: true,
          }
        });

        return {
          themes,
          totalThemes: users.length,
          currentPage: page,
          totalPages: Math.ceil(totalThemes / per_page),
        };
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