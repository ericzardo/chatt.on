const { ForbiddenError } = require("../../errors");

async function AuthUser(app) {
  app.withTypeProvider().get(
    "/auth/user",
    {
      preHandler: [require("../../middleware/authHandler")],
    },
    async (request, reply) => {
      const user = request.user;

      if (!user) {
        throw new ForbiddenError("User not authenticated.")
      }

      user.chats.sort((a, b) => {
        const aLastActive = a.UserChatActivity[0]?.last_active || new Date(0);
        const bLastActive = b.UserChatActivity[0]?.last_active || new Date(0);
        return bLastActive - aLastActive;
      });

      return reply.status(200).send(user);
    },
  )
}

module.exports = AuthUser;