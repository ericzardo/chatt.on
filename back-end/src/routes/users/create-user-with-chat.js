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
          is_temporary_user: z.boolean().default(true),
        })
      },
    },
    async (request, reply) => {
      const { chatId } = request.params;
      const { username, is_temporary_user } = request.body;

      const existsUserByUsername = await prisma.user.findFirst({
        where: { username }
      })

      if (existsUserByUsername) {
        throw new ClientError("Username already taken.");
      }

      const defaultRole = await prisma.role.findUnique({
        where: { name: "user" }
      });

      if (!defaultRole) {
        throw new ClientError("Default Role not created.");
      }

      const user = await prisma.$transaction(async prisma => {
        const user = await prisma.user.create({
          data: {
            username,
            password: "",
            is_temporary_user,
            roles: {
              connect: defaultRole,
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

      const accessToken = jwt.sign(
        { id: user.id, is_temporary_user: true },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      reply.setCookie('access-token', accessToken, { 
        maxAge: 3600000,
        path: "/"
      });

      return reply.status(201).send({
        user: user.id,
        message: `User created and connected to chat successfully.`,
      });
    }
  );
}

module.exports = createUserWithChat;
