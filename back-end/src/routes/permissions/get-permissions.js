const { z } = require("zod");
const prisma = require("../../lib/prisma");

const authHandler = require("../../middleware/authHandler");
const permissionHandler = require("../../middleware/permissionHandler");

async function getPermissions(app) {
  app.withTypeProvider().get(
    '/permissions',
    {
      preHandler: [authHandler, permissionHandler("managePermissions")],
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
        const [permissions, totalPermissions] = await Promise.all([
          prisma.permission.findMany({
            skip: (page - 1) * perPage,
            take: perPage,
          }),
          prisma.permission.count(),
        ]);

        return reply.status(200).send({
          permissions,
          totalPermissions,
          currentPage: page,
          totalPages: Math.ceil(totalPermissions / perPage),
        });
      }

      const permissions = await prisma.permission.findMany();
      
      return reply.status(200).send({
        permissions,
        message: "Permissions retrieved successfully"
      });
    },
  )
}

module.exports = getPermissions;