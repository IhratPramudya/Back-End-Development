/* eslint-disable no-underscore-dangle */
const InvariantError = require("../../custome_error/InvariantError");

const {
  userPayloadSchema,
  loginPayloadSchema,
  refreshTokenPayloadSchema,
} = require("./schema");

class AuthenticationsValidator {
  constructor(users) {
    this._users = users;
    this.validateUser = this.validateUser.bind(this);
    this.loginValidateUser = this.loginValidateUser.bind(this);
    this.refreshValidation = this.refreshValidation.bind(this);
  }

  validateUser() {
    const validationResult = userPayloadSchema.validate(this._users);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }

  loginValidateUser() {
    const validationResult = loginPayloadSchema.validate(this._users);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }

  refreshValidation() {
    const validationResult = refreshTokenPayloadSchema.validate(this._users);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
}

module.exports = AuthenticationsValidator;
