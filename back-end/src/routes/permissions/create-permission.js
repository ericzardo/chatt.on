const { z } = require("zod");
const prisma = require("../../lib/prisma");

const { ClientError } = require("../../errors");

const authHandler = require("../../middleware/authHandler");
const permissionHandler = require("../../middleware/permissionHandler");

async function createPermission(app) {
  app.withTypeProvider().post(
    "/permissions",
    {
      preHandler: [authHandler, permissionHandler("managePermissions")],
      schema: {
        body: z.object({
          name: z.string().min(4),
          type: z.enum(["boolean", "number"]).optional().default("boolean"),
          description: z.string().optional().default(""),
        }),
      },
    },
    async (request, reply) => {
      const { name, type, description } = request.body;

      const existingPermission = await prisma.permission.findUnique({
        where: { name },
      });

      if (existingPermission) {
        throw new ClientError("Permission already exists.");
      }

      const permission = await prisma.permission.create({
        data: { name, type, description },
      });

      if (!permission) {
        throw new ClientError("Failed to create permission.");
      }

      const roles = await prisma.role.findMany();

      await Promise.all(
        roles.map(async (role) => {
          await prisma.rolePermission.create({
            data: {
              roleId: role.id,
              permissionId: permission.id,
              value: type === "boolean" ? false : 0,
            },
          });
        })
      );
      
      return reply.status(201).send({
        permission: permission.id,
        message: `Permission "${permission.name}" created.`,
      });
    },
  )
}

module.exports = createPermission;