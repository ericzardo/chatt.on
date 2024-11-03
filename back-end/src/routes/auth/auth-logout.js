const prisma = require("../../lib/prisma");
const { ForbiddenError } = require("../../errors");

async function AuthLogout(app) {
  app.post('/auth/logout',
    {
      preHandler: [require("../../middleware/authHandler")],
    },
    async (request, reply) => {

      const user = request.user

      if (!user) {
        throw new ForbiddenError("User not authenticated.")
      }

      if (user?.is_temporary_user) {
        await prisma.user.delete({
          where: { id: user.id },
        });
      }

      return reply.status(200).send({
        message: "Logout successful",
      });
    }
  );
}

module.exports = AuthLogout;
