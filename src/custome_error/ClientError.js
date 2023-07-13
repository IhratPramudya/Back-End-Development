class ClientError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "ClientError";
    this.statusCode = statusCode;
  }
}

module.exports = ClientError;
