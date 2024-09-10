const createTheme = require("./create-theme");
const deleteTheme = require("./delete-theme");
const getThemeByName = require("./get-theme-by-name");
const getThemes = require("./get-themes");

async function themeRoutes(fastify) {
  fastify.register(createTheme);
  fastify.register(deleteTheme);
  fastify.register(getThemeByName);
  fastify.register(getThemes);
}

module.exports = themeRoutes;