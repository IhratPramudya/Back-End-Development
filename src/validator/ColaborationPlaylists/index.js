/* eslint-disable no-underscore-dangle */
const VarianError = require('../../customeerror/VarianError');
const { makeColaborationPlaylistPayload } = require('./schema');

class ColaborationValidatorPlaylist {
  constructor(payload) {
    this._payload = payload;

    this.validateColaborationPlaylist = this.validateColaborationPlaylist.bind(this);
  }

  validateColaborationPlaylist() {
    const validationResult = makeColaborationPlaylistPayload.validate(this._payload);
    if (validationResult.error) {
      throw new VarianError(validationResult.error.message);
    }
  }
}

module.exports = ColaborationValidatorPlaylist;
