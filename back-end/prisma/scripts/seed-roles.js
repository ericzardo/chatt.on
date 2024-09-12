const prisma = require("../../src/lib/prisma");

async function main() {
  await prisma.role.create({
    data: {
      name: 'user',
      color: "#7dd3fc",
      level: 1,
      permissions:  {
				joinRooms: true,
				viewRooms: true,
				manageRoles: false,
				manageRooms: false,
				manageUsers: false,
				sendMessages: true,
				editUserProfiles: true,
				viewUserProfiles: true
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
				viewRooms: true,
				manageRoles: true,
				manageRooms: true,
				manageUsers: true,
				sendMessages: true,
				editUserProfiles: true,
				viewUserProfiles: true
			},
    },
  });

  console.log("\nRoles have been seeded.\n");
}

main();