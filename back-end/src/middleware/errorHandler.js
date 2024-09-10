const { ClientError } = require("../errors");

const errorHandler = (error, request, reply) => {
  if (error instanceof ClientError) {
    reply.status(error.statusCode).send({ error: error.message });
    return;
  }
  
  console.error(error);
  reply.status(500).send({ error: "Internal Server Error" });

}

module.exports = errorHandler;
