/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
const InvariantError = require("../../custome_error/InvariantError");

const {
  organizationPayloadSchema,
  tokenKelasPayloadSchema
} = require("./schema");

const ProfileValidator = {
  organizationValidation(payload) {
    const validationResult = organizationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  tokenKelasValidator(payload) {
    const validationResult = tokenKelasPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ProfileValidator;
