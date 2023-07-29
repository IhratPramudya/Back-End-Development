const VarianError = require('../../customeerror/VarianError');
const ExportPlaylistSchema = require('./schema');

const ExportValidator = {
  validatorExportPlaylist: (payload) => {
    const validationResult = ExportPlaylistSchema.validate(payload);

    if (validationResult.error) {
      throw new VarianError(validationResult.error.message);
    }
  },
};

module.exports = ExportValidator;
