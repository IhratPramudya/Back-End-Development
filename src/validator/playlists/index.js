/* eslint-disable no-underscore-dangle */
const VarianError = require('../../customeerror/VarianError');
const { addPlaylistsPayloadSchema, addSongsPlaylistsPayloadSchema } = require('./schema');

class PlaylistsValidator {
  constructor(payload) {
    this._payload = payload;
    this.addPlaylistValidate = this.addPlaylistValidate.bind(this);
    this.songsValidate = this.songsValidate.bind(this);
  }

  addPlaylistValidate() {
    const validateResult = addPlaylistsPayloadSchema.validate(this._payload);
    if (validateResult.error) {
      throw new VarianError(validateResult.error.message);
    }
  }

  songsValidate() {
    const validateResult = addSongsPlaylistsPayloadSchema.validate(this._payload);
    if (validateResult.error) {
      throw new VarianError(validateResult.error.message);
    }
  }
}

module.exports = PlaylistsValidator;
