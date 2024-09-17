async function getAvatars(app) {
  app.withTypeProvider().get(
    '/uploads/avatars',
    async (request, reply) => {
      const avatars = [];

      for (let i = 1; i < 9; i++) {
        avatars.push(`${process.env.R2_PUBLIC_ENDPOINT}/avatar-${i}`);
      }

      return reply.status(200).send({
        avatars,
        message: "Roles retrieved successfully"
      });
    },
  )
}

module.exports = getAvatars;