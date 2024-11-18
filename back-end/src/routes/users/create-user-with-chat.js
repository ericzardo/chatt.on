const { z } = require("zod");
const prisma = require("../../lib/prisma");
const jwt = require("jsonwebtoken");
const { ClientError } = require("../../errors")

async function createUserWithChat(app) {
  app.withTypeProvider().post(
    "/users/:chatId",
    {
      schema: {
        params: z.object({
          chatId: z.string().uuid(),
        }),
        body: z.object({
          username: z.string(),
          selectedAvatar: z.number(),
          is_temporary_user: z.boolean().default(true),
        })
      },
    },
    async (request, reply) => {
      console.log("Rota /users/:chatId foi atingida");
      const { chatId } = request.params;
      const { username, is_temporary_user, selectedAvatar } = request.body;

      console.log("Checking if username exists");
      const existsUserByUsername = await prisma.user.findFirst({
        where: { username }
      })

      if (existsUserByUsername) {
        throw new ClientError("Username already taken.");
      }

      console.log("Checking if default user role exists");
      const defaultRole = await prisma.role.findUnique({
        where: { name: "user" }
      });

      if (!defaultRole) {
        throw new ClientError("Default Role not created.");
      }

      console.log("Creating user on database and connecting on chat");
      const user = await prisma.$transaction(async prisma => {
        const user = await prisma.user.create({
          data: {
            username,
            password: "",
            is_temporary_user,
            profile_picture_url: `${process.env.R2_PUBLIC_ENDPOINT}/avatar-${selectedAvatar + 1 || 1}`,
            roles: {
              connect: {
                id: defaultRole.id,
              },
            },
          },
        })

        await prisma.user.update({
          where: { id: user.id },
          data: {
            chats: {
              connect: { id: chatId },
            },
          },
        });

        return user;
      })

      if (!user) {
        throw new ClientError("Failed to create a user");
      }

      console.log("Creating access token and sending on response");
      const accessToken = jwt.sign(
        { id: user.id, is_temporary_user: true },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return reply.status(201).send({
        user: user.id,
        accessToken,
        message: `User created and connected to chat successfully.`,
      });
    }
  );
}

module.exports = createUserWithChat;
