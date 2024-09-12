const { ClientError, ForbiddenError, NotFoundError } = require('./errors');
const { ZodError } = require("zod")

const errorHandler = (error, request, reply) => {
  if (error instanceof ClientError) {
    return reply.status(400).send({
      message: error.message
    });
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Invalid input",
    });
  }

  if (error instanceof ForbiddenError) {
    return reply.status(403).send({
      message: error.message
    });
  }

  if (error instanceof NotFoundError) {
    return reply.status(404).send({
      message: error.message
    });
  }
  console.log(error);
  return reply.status(500).send({
    message: "Internal server error"
  });
};

module.exports = errorHandler;
