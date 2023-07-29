const VarianError = require('../../customeerror/VarianError');
const ImageAlbumsSchema = require('./schema');

const UploadsValidator = {
  validateImageAlbums: (header) => {
    const validationResult = ImageAlbumsSchema.validate(header);

    if (validationResult.error) {
      throw new VarianError(validationResult.error.message);
    }
  },
};

module.exports = UploadsValidator;
