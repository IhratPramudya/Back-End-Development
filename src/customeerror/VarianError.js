const ClientError = require('./ClientError');

class VarianError extends ClientError {
  constructor(message) {
    super(message, 400);

    this.name = 'VarianError';
  }
}

module.exports = VarianError;
