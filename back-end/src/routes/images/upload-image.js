const { z } = require("zod");
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { randomUUID } = require("node:crypto")
const r2 = require("../../lib/r2");
const { ClientError, ForbiddenError } = require("../../errors");

async function uploadImage(app) {
  app.withTypeProvider().post(
    "/uploads",
    {
      preHandler: [require("../../middleware/authHandler")],
      schema: {
        body: z.object({
          fileName: z.string(),
          fileType: z.string(),
          fileSize: z.number(),
          userId: z.string().uuid().optional(),
          chatId: z.string().uuid().optional(),
        }),
      },
    },
    async (request, reply) => {
      const user = request.user;

      if (!user) {
        throw new ForbiddenError("User not authenticated.")
      }

      const { fileName, fileType, fileSize, userId, chatId } = request.body

      if (!fileName || !fileType) {
        throw new ClientError("File name and file type are required.");
      }

      const fileKey = randomUUID().concat("-").concat(fileName)

      const signedUrl = await getSignedUrl(r2,
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: fileKey,
          ContentType: fileType,
        }),
        {expiresIn: 600 }
      )

      if (!signedUrl) {
        throw new ClientError("Unable to upload the image.");
      }

      const imageUrl = `${process.env.R2_PUBLIC_ENDPOINT}/${fileKey}`;

      return reply.status(201).send({
        signedUrl: signedUrl,
        imageUrl,
        message: `Pre signed url generated successfully.`
      });
    },
  )
}

module.exports = uploadImage;