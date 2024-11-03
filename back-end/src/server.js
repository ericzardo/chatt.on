require('dotenv').config();

const fastify = require("fastify");
const cors = require("@fastify/cors");
const { serializerCompiler, validatorCompiler } = require("fastify-type-provider-zod");
const { corsConfig } = require('./config');

const errorHandler = require("./error-handler");
const registerRoutes = require("./routes")

const connectionController = require("./controllers/connectionController");
const chatController = require("./controllers/chatController");


const configureFastify = (app) => {
  app.register(cors, corsConfig);
  app.setErrorHandler(errorHandler);
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  registerRoutes(app);
};

const runWebSocket = (server) => {
  const io = require("./lib/io")(server);

  io.of("/chat").on("connection", (socket) => {
    connectionController(socket);
    chatController(socket, io);
  })
}

const runApp = async () => {

  const app = fastify();

  configureFastify(app);

  await app.listen({ port: process.env.PORT })
    .then(() => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);

      runWebSocket(app.server);
    })
    .catch((error) => {
      console.error("Error starting server:", error);
      process.exit(1);
    })
}

runApp();