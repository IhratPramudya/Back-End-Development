const InvariantError = require("../../custome_error/InvariantError");
const ImageOrganizationSchema = require("./schema");

const UploadsValidator = {
  validateOrganizationImage: (header) => {
    const validationResult = ImageOrganizationSchema.validate(header);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UploadsValidator;
