const prisma = require("../../src/lib/prisma");
const bcrypt = require("bcrypt");

async function main() {
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  const admin = await prisma.user.create({
    data: {
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      roles: {
        connect: [
          { name: "admin" },
          { name: "user" }
        ]
      }
    },
  });

  console.log("\nAdmin user has been created: ", admin.id + "\n");
}

main();
