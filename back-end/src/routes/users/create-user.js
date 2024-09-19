const { z } = require("zod");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const prisma = require("../../lib/prisma");
const transporter = require("../../lib/mailer");
const jwt = require("jsonwebtoken");
const { ClientError } = require("../../errors");

async function sendPasswordResetEmail(username, email, resetToken) {
  const mailOptions = {
    from: `"No-Reply" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Password Reset",
    text: `
      Hello ${username},

      You have been registered on our platform. To reset your password, click the link below:

      ${process.env.BASE_URL}/reset-password/${resetToken}

      The password reset link expires in 1 hour. If you do not reset your password within this time, you will need to use the "Forgot Password" option on the sign-in page to request a new reset.

      Best regards,
      Eric Zardo
    `,
    html: `
      <h1>Hello ${username},</h1>
      <p>You have been registered on our platform. To reset your password, click the link below:</p>
      <p><a href="${process.env.BASE_URL}/reset-password/${resetToken}">Reset Password</a></p>
      <p>The password reset link expires in 1 hour. If you do not reset your password within this time, you will need to use the "Forgot Password" option on the sign-in page to request a new reset.</p>
      <br>
      <p>Best regards,</p>
      <p>Eric Zardo</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new ClientError("Error sending email. Please try again later.");
  }
}

async function createUser(app) {
  app.withTypeProvider().post(
    "/users",
    {
      schema: {
        body: z.object({
          username: z.string().min(3).max(24),
          email: z.string().email().optional(),
          password: z.string().min(6).optional(),
          confirmPassword: z.string().min(6).optional(),
          roles: z.array(z.string()).optional(),
          is_temporary_user: z.boolean().optional(),
        }).refine(data => data.password === data.confirmPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"],
        }),
      },
    },
    async (request, reply) => {
      const { 
        username,
        email = null,
        password,
        roles = [],
      } = request.body

      const existsUserByUsername = await prisma.user.findFirst({
        where: { username }
      })

      if (existsUserByUsername) {
        throw new ClientError("Username already taken.");
      }

      const existsUserByEmail = email && await prisma.user.findFirst({
        where: { email }
      })

      if (existsUserByEmail) {
        throw new ClientError("Email already in use.");
      }

      const defaultRole = await prisma.role.findUnique({
        where: { name: "user" }
      });

      if (!defaultRole) {
        throw new ClientError("Default Role not created.");
      }

      const userRoles = roles.includes(defaultRole.id)
      ? roles
      : [...roles, defaultRole.id];

      let hashedPassword = "";
      const profile_picture_url = `${process.env.R2_PUBLIC_ENDPOINT}/avatar-${Math.floor(Math.random() * 9) + 1}`

      if (!password && email) {
        const generatePassword = uuidv4();
        hashedPassword = await bcrypt.hash(generatePassword, 10);

        const user = await prisma.user.create({
          data: {
            username,
            email,
            password: hashedPassword,
            profile_picture_url,
            roles: {
              connect: userRoles.map((roleId) => ({ id: roleId })),
            },
          },
        });

        const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await sendPasswordResetEmail(username, email, resetToken);
        
        return reply.status(201).send({
          user: user.id,
          message: `User created and password reset email sent.`
        });

      } else {
        hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
          data: {
            username,
            email,
            password: hashedPassword,
            profile_picture_url,
            roles: {
              connect: userRoles.map((roleId) => ({ id: roleId })),
            },
          },
        })

        return reply.status(201).send({
          user: user.id,
          message: `User created successfully`
        });
      }
    },
  )
}

module.exports = createUser;