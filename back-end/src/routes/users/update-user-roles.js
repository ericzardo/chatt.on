const { z } = require("zod");
const prisma = require("../../lib/prisma");

const { NotFoundError, ClientError } = require("../../errors");

const authHandler = require("../../middleware/authHandler");
const permissionHandler = require("../../middleware/permissionHandler");

async function updateUserRoles(app) {
  app.put(
    "/users/:userId/roles",
    {
      preHandler: [authHandler, permissionHandler("editUserRoles")],
      schema: {
        params: z.object({
          userId: z.string().uuid(),
        }),
        body: z.object({
          roles: z.array(z.object({
            id: z.string().uuid(),
            name: z.string(),
            permissions: z.any()
          }))
        }),
      },
    },
    async (request, reply) => { 
      const { userId } = request.params;
      const { roles } = request.body;

      console.log(request.body)

      if (!Array.isArray(roles)) {
        throw new ClientError("Invalid roles format")
      }

      if (!roles.every(role => role.id)) {
        throw new ClientError("Each role must have an ID");
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError("User does not exist.");
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          roles: {
            set: roles.map(role => ({ id: role.id })),
          },
        },
      });

      return reply.status(200).send({
        message: "User roles updated successfully"
      });
    }
  );
}

module.exports = updateUserRoles;
