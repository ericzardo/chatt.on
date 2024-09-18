const prisma = require("../../src/lib/prisma");

async function main() {
  await prisma.role.create({
    data: {
      name: "user",
      color: "#7dd3fc",
      level: 1,
      permissions: {
        create: [
          { permission: { connect: { name: "joinRooms" } }, value: true },
          { permission: { connect: { name: "manageRoles" } }, value: false },
          { permission: { connect: { name: "manageRooms" } }, value: false },
          { permission: { connect: { name: "manageUsers" } }, value: false },
          { permission: { connect: { name: "sendMessages" } }, value: true },
          { permission: { connect: { name: "editUserProfiles" } }, value: true },
          { permission: { connect: { name: "editUserRoles" } }, value: false },
          { permission: { connect: { name: "maxChats" } }, value: 3 },
        ]
      }
    },
  });

  await prisma.role.create({
    data: {
      name: "admin",
      color: "#3b82f6",
      level: 1000,
      permissions:  {
        create: [
          { permission: { connect: { name: "joinRooms" } }, value: true },
          { permission: { connect: { name: "manageRoles" } }, value: true },
          { permission: { connect: { name: "manageRooms" } }, value: true },
          { permission: { connect: { name: "manageUsers" } }, value: true },
          { permission: { connect: { name: "sendMessages" } }, value: true },
          { permission: { connect: { name: "editUserProfiles" } }, value: true },
          { permission: { connect: { name: "editUserRoles" } }, value: true },
          { permission: { connect: { name: "maxChats" } }, value: 0 },
        ]
      }
    },
  });

  console.log("\nRoles have been seeded.\n");
}

main();