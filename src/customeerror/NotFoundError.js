const ClientError = require('./ClientError');

class NotFoundError extends ClientError {
  constructor(message, statusCode) {
    super(message, statusCode);
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
