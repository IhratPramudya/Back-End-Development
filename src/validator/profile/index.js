/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
const InvariantError = require("../../custome_error/InvariantError");

const {
  accessTokenTokenPayloadSchema,
  profilePayloadSchema,
} = require("./schema");

const ProfileValidator = {
  refreshValidation(payload) {
    const validationResult = accessTokenTokenPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  profileValidator(payload) {
    const validationResult = profilePayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ProfileValidator;
