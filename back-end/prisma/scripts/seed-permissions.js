const prisma = require("../../src/lib/prisma");
const bcrypt = require("bcrypt");

async function main() {
  await prisma.permission.createMany({
    data: [
      { 
        name: "joinRooms",
        type: "boolean",
        description: "Allows users to join or leave channels."
      },
      { 
        name: "manageRoles",
        type: "boolean",
        description: "Allows users to create, edit, or delete roles and permissions."
      },
      {
        name: "manageRooms",
        type: "boolean",
        description: "Allows users to create, edit, or delete themes and chats."
      },
      { 
        name: "manageUsers",
        type: "boolean",
        description: "Allows users to create, edit, or delete users"
      },
      {
        name: "managePermissions",
        type: "boolean",
        description:  "Allows users to create, edit, or delete permissions"
      },
      {
        name: "sendMessages",
        type: "boolean",
        description: "Allows users to send messages in channels or direct messages."
      },
      {
        name: "editUserProfiles",
        type: "boolean",
        description: "Allows users to edit their own profiles."
      },
      {
        name: "editUserRoles",
        type: "boolean",
        description: "Allow the user to modify the roles assigned to other users."
      },
      {
        name: "maxChats",
        type: "number",
        description: "Sets the maximum number of chats a user can join."
      },
    ],
  });

  console.log("\n Permissions has been created \n");
}

main();
