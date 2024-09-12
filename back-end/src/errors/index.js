class ClientError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ForbiddenError extends ClientError {
  constructor(message = "You don't have permission to perform this action") {
    super(message);
    this.name = "ForbiddenError";
  }
}

class NotFoundError extends ClientError {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

module.exports = {
  ClientError,
  ForbiddenError,
  NotFoundError
};