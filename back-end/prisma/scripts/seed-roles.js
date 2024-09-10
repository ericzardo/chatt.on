const prisma = require("../../src/lib/prisma");

async function main() {
  await prisma.role.create({
    data: {
      name: 'user',
      permissions: {},
    },
  });

  await prisma.role.create({
    data: {
      name: 'admin',
      permissions: {},
    },
  });

  console.log("Roles have been seeded.");
}

main();