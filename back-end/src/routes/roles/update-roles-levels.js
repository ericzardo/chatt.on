
const { z } = require("zod");
const prisma = require("../../lib/prisma");

const { ForbiddenError, ClientError } = require("../../errors");

const authHandler = require("../../middleware/authHandler");
const permissionHandler = require("../../middleware/permissionHandler");

async function updateRolesLevels(app) {
  app.put(
    "/roles/levels",
    {
      preHandler: [authHandler, permissionHandler("manageRoles")],
      schema: {
        body: z.object({
          roles: z.array(z.object({
            id: z.string().uuid(),
            name: z.string(),
            color: z.string(),
            permissions: z.object({
              joinRooms: z.boolean(),
              viewRooms: z.boolean(),
              manageRoles: z.boolean(),
              manageRooms: z.boolean(),
              manageUsers: z.boolean(),
              sendMessages: z.boolean(),
              editUserProfiles: z.boolean(),
              viewUserProfiles: z.boolean(),
            }),
            level: z.number().int(),
            users: z.array(z.object({
              id: z.string().uuid(),
              username: z.string(),
              email: z.string().email(),
              password: z.string(),
              profile_picture_url: z.string(),
              created_at: z.string().datetime(),
              updated_at: z.string().datetime(),
              is_temporary_user: z.boolean(),
            })),
          })),
        }),
      },
    },
    async (request, reply) => {
      const user = request.user;

      if (!user) {
        throw new ForbiddenError("User not authenticated.")
      }

      const { roles } = request.body;

      if (!Array.isArray(roles)) {
        throw new ClientError("Invalid input format");
      }

      const existingRoles = await prisma.role.findMany({
        where: { id: { in: roles.map(role => role.id) } },
        select: { id: true, level: true, name: true }
      });

      const fixedRoles = existingRoles.filter(role => role.name === "admin");
      const dynamicRoles = roles.filter(role => !fixedRoles.some(fixedRole => fixedRole.id === role.id));

      const sortedDynamicRoles = dynamicRoles.reverse();

      const existingLevelsMap = new Map(existingRoles.map(role => [role.level, true]));


      const adjustedUpdates = sortedDynamicRoles.map((role, index) => {
        let level = index + 1;
        while (existingLevelsMap.has(level)) {
          level += 1;
        }
        existingLevelsMap.set(level, true);
        return { id: role.id, level };
      });

      await prisma.$transaction(
        adjustedUpdates.map(({ id, level }) =>
          prisma.role.update({
            where: { id },
            data: { level }
          })
        )
      );

      reply.status(200).send({
        message: "Roles hierarchy updated successfully"
      });
    }
  );
}

module.exports = updateRolesLevels;
