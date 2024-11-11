require('dotenv').config();

const fastify = require("fastify");
const cors = require("@fastify/cors");
const { serializerCompiler, validatorCompiler } = require("fastify-type-provider-zod");
const { corsConfig } = require('./config');

const errorHandler = require("./error-handler");
const registerRoutes = require("./routes")

const websocketHandler = require("./middleware/websocketHandler");
const chatController = require("../src/controllers/chatController");

const configureFastify = (app) => {
  app.register(cors, corsConfig);
  app.setErrorHandler(errorHandler);
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  registerRoutes(app);
};

const runWebSocket = (io) => {
  const chat = io.of("/chat")

  chat.use(websocketHandler);

  chat.on("connection", (socket) => {
    chatController(socket, chat)
  });
}

const runApp = async () => {

  const app = fastify();
  const io = require("./lib/io")(app.server);

  configureFastify(app);
  runWebSocket(io);

  await app.listen({ host: '0.0.0.0', port: process.env.PORT })
    .then(() => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    })
    .catch((error) => {
      console.error("Error starting server:", error);
      process.exit(1);
    })
}

runApp();