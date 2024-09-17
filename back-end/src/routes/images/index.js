const uploadImage = require("./upload-image");
const getAvatars = require("./get-avatars");

async function imagesRoutes(fastify) {
  fastify.register(uploadImage);
  fastify.register(getAvatars);
}

module.exports = imagesRoutes;