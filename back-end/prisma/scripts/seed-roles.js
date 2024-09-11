const prisma = require("../../src/lib/prisma");

async function main() {
  await prisma.role.create({
    data: {
      name: 'user',
      color: "red",
      permissions: {},
    },
  });

  await prisma.role.create({
    data: {
      name: 'admin',
      color: "blue",
      permissions: {},
    },
  });

  console.log("\nRoles have been seeded.\n");
}

main();