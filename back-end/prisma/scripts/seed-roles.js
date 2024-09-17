const prisma = require("../../src/lib/prisma");

async function main() {
  await prisma.role.create({
    data: {
      name: 'user',
      color: "#7dd3fc",
      level: 1,
      permissions:  {
				joinRooms: true,
				manageRoles: false,
				manageRooms: false,
				manageUsers: false,
				sendMessages: true,
				editUserProfiles: true,
        editUserRoles: true,
				maxChats: 3
			},
    },
  });

  await prisma.role.create({
    data: {
      name: 'admin',
      color: "#3b82f6",
      level: 1000,
      permissions:  {
				joinRooms: true,
				manageRoles: true,
				manageRooms: true,
				manageUsers: true,
				sendMessages: true,
				editUserProfiles: true,
        editUserRoles: true,
				maxChats: 0
			},
    },
  });

  console.log("\nRoles have been seeded.\n");
}

main();