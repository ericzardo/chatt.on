const { z } = require("zod");
const prisma = require("../../lib/prisma");
const { ForbiddenError } = require("../../errors")

async function updateProfileUser(app) {
  app.patch(
    "/users/profile",
    {
      preHandler: [require("../../middleware/authHandler")],
      schema: {
        body: z.object({
          username: z.string().min(3).max(24).optional(),
          profile_picture_url: z.string().url().optional(),
          email: z.string().email().optional(),
        }),
      },
    },
    async (request, reply) => {
      const user = request.user;

      if (!user) {
        throw new ForbiddenError("User not authenticated.")
      }

      const { username, profile_picture_url, email } = request.body;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          ...(username && { username }),
          ...(profile_picture_url && { profile_picture_url }),
          ...(email && { email }),
        },
      });

      return reply.status(200).send({
        user,
        message: "Profile updated successfully",
      });
    }
  );
}

module.exports = updateProfileUser;
