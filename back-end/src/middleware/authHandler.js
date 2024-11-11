const jwt = require("jsonwebtoken");
const logger = require("../lib/logger");
const { ForbiddenError, NotFoundError, ClientError } = require("../errors");
const getUserFormatted = require("../utils/getUserFormatted")

async function authHandler(request) {

  try {
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ForbiddenError("Not authenticated.");
    }

    const token = authHeader.split(' ')[1];

    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await getUserFormatted(id);
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    request.user = user;

  } catch (error) {
    logger.error(`Error during authentication: ${error.message}`);
    throw new ClientError("Invalid or missing token.")
  }
}

module.exports = authHandler;
