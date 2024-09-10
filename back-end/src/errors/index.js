class ClientError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ForbiddenError extends ClientError {
  constructor(message = "You don't have permission to perform this action") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

class NotFoundError extends ClientError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

module.exports = {
  ClientError,
  ForbiddenError,
  NotFoundError
};
