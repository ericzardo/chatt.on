const { z } = require("zod");
const jwt = require("jsonwebtoken");
const prisma = require("../../lib/prisma");
const transporter = require("../../lib/mailer")
const { NotFoundError, ClientError } = require("../../errors");

async function sendForgotPasswordEmail(email, resetPasswordUrl) {
  const mailOptions = {
    from: `"No-Reply" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Password Reset Request",
    text: `
      You requested a password reset. Click the link below to reset your password:
      ${resetPasswordUrl}
      This link will expire in 15 minutes.
    `,
    html: `
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetPasswordUrl}">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new ClientError("Error sending email. Please try again later.");
  }
}

async function forgotPassword(app) {
  app.withTypeProvider().post(
    "/forgot-password",
    {
      schema: {
        body: z.object({
          email: z.string().email(),
        }),
      },
    },
    async (request, reply) => {
      const { email } = request.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new NotFoundError("No account found with that email.");
      }

      const accessToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      const resetPasswordUrl = `${process.env.BASE_URL}/reset-password/${accessToken}`;
      await sendForgotPasswordEmail(email, resetPasswordUrl);

      await transporter.sendMail(mailOptions);

      return reply.status(200).send({
        message: "Password reset link sent to your email.",
      });    
    }
  );
}

module.exports = forgotPassword;
