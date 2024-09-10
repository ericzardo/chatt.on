const authRoutes = require("./auth");
const chatRoutes = require("./chats");
const themeRoutes = require("./themes");
const userRoutes = require("./users");
const roleRoutes = require("./roles")

const registerRoutes = (app) => {
  authRoutes(app);
  chatRoutes(app);
  themeRoutes(app);
  userRoutes(app);
  roleRoutes(app)
}

module.exports = registerRoutes;
