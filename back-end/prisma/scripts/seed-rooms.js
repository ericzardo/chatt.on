const prisma = require("../../src/lib/prisma");

async function main() {
  await prisma.theme.create({
    data: {
      name: "Programming",
      number_of_chats: 2,
      chats: {
        create: [
          {
            name: "reactjs",
            banner_image_url: "https://example.com/react-banner.png",
            description: "Discuss all things ReactJS",
            participant_count: 0
          },
          {
            name: "node",
            banner_image_url: "https://example.com/node-banner.png",
            description: "Discuss all things Node.js",
            participant_count: 0
          }
        ]
      }
    },
  });

  console.log("\nRooms have been seeded.\n");
}

main();
