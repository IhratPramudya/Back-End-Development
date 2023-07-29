/* eslint-disable no-underscore-dangle */
const VarianError = require('../../customeerror/VarianError');
const { payloadSongsSchema, payloadTitleSongsSchema } = require('./schema');

class SongsValidator {
  constructor(songs) {
    this._songs = songs;

    this.validateSongs = this.validateSongs.bind(this);
    this.validateTitleSongs = this.validateTitleSongs.bind(this);
  }

  validateSongs() {
    const validateResult = payloadSongsSchema.validate(this._songs);
    if (validateResult.error) {
      throw new VarianError(validateResult.error.message);
    }
  }

  validateTitleSongs() {
    const validateResult = payloadTitleSongsSchema.validate(this._songs);
    if (validateResult.error) {
      throw new VarianError(validateResult.error.message);
    }
  }
}

module.exports = SongsValidator;
