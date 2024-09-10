const authRoutes = require("./auth");
const chatRoutes = require("./chats");
const themeRoutes = require("./themes");
const userRoutes = require("./users");

const getRoles = require("./roles/get-roles");

const registerRoutes = (app) => {
  authRoutes(app);
  chatRoutes(app);
  themeRoutes(app);
  userRoutes(app);

  app.register(getRoles);
};

module.exports = registerRoutes;
