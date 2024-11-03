const { z } = require("zod");
const prisma = require("../../lib/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { NotFoundError } = require("../../errors");


async function AuthLogin(app) {
  app.withTypeProvider().post(
    "/auth/login",
    {
      schema: {
        body: z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        throw new NotFoundError("Incorrect email or password.");
      }

      const isCorrectPassword = bcrypt.compareSync(password, user.password)

      if (!isCorrectPassword) {
        throw new NotFoundError("Incorrect email or password.");
      }

      const accessToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return reply.status(200).send({
        accessToken,
        message: "Login successful"
      });
    },
  )
}

module.exports = AuthLogin;