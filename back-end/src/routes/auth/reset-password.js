const { z } = require("zod");
const prisma = require("../../lib/prisma");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ForbiddenError, NotFoundError } = require("../../errors");

async function resetPassword(app) {
  app.withTypeProvider().post(
    '/reset-password',
    {
      schema: {
        body: z.object({
          password: z.string().min(6).optional(),
          confirmPassword: z.string().min(6).optional(),
          token: z.string(),
        }).refine(data => data.password === data.confirmPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"],
        }),
      },
    },
    async (request, reply) => {
      const { password, token } = request.body;

      if (!token) {
        throw new ForbiddenError("Not authenticated.")
      }

      const { id } = jwt.verify(token, process.env.JWT_SECRET);

      if (!id) {
        throw new ForbiddenError("Invalid or expired token.");
      }

      const user = await prisma.user.findUnique({ where: { id } })

      if (!user) {
        throw new NotFoundError("User not found.")
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.update({
        where: { id },
        data: { password: hashedPassword },
      });

      return reply.status(200).send({
        message: "Password successfully reset. You can now log in with your new password.",
      });
    }
  )
}

module.exports = resetPassword;
