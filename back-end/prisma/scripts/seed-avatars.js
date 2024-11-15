require("dotenv").config();

const path = require("path");
const fs = require("fs");
const r2 = require("../../src/lib/r2");
const { PutObjectCommand } = require('@aws-sdk/client-s3');

function isValidImage(file) {
  const validExtensions = ['.webp'];
  const ext = path.extname(file).toLowerCase();
  return validExtensions.includes(ext);
}

async function main() {
  const avatarsDir = path.join(__dirname, "../../public/avatars");

  const files = fs.readdirSync(avatarsDir);

  let i = 1;
  for (const file of files) {
    if (!isValidImage(file)) {
      console.log(`Skipping non-image file: ${file}`);
      continue;
    }

    const filePath = path.join(avatarsDir, file);
    const fileStream = fs.createReadStream(filePath);

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: `avatar-${i}`,
      Body: fileStream,
      ContentType: 'image/webp',
    });

    i++;

    try {
      await r2.send(command);
      console.log(`Uploaded ${file} successfully.`);
    } catch (err) {
      console.error(`Failed to upload ${file}:`, err);
    }
  }
}

main();