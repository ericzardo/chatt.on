const { z } = require("zod");
const prisma = require("../../lib/prisma");

const { ClientError } = require("../../errors");

const authHandler = require("../../middleware/authHandler");
const permissionHandler = require("../../middleware/permissionHandler");

async function createRole(app) {
  app.withTypeProvider().post(
    "/roles",
    {
      preHandler: [authHandler, permissionHandler("manageRoles")],
      schema: {
        body: z.object({
          name: z.string().min(4),
          color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
          level: z.number(),
          permissions: z.any().optional(),
        }),
      },
    },
    async (request, reply) => {
      const user = request.user;

      if (!user) {
        throw new ForbiddenError("User not authenticated.")
      }

      const { name, permissions, color, level } = request.body

      const existsRole = await prisma.role.findUnique({
        where: { name }
      });

      if (existsRole) {
        throw new ClientError("Role already exists.");
      }

      const existsRoleColor = await prisma.role.findUnique({
        where: { color }
      });

      if (existsRoleColor) {
        throw new ClientError("There is already a role with this color.");
      }

      let finalPermissions = permissions || {};

      const previousRole = await prisma.role.findFirst({
        where: { level: level - 1 <= 1 ? 1 : level - 1 },
        orderBy: { level: 'desc' },
      });

      if (!previousRole) {
        finalPermissions = {
          joinRooms: true,
          viewRooms: true,
          manageRoles: false,
          manageRooms: false,
          manageUsers: false,
          sendMessages: true,
          editUserProfiles: true,
          viewUserProfiles: true
        };
      } else {
        finalPermissions = previousRole?.permissions || {}
      }

      const role = await prisma.role.create({
        data: { 
          name,
          color,
          level,
          permissions: finalPermissions
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