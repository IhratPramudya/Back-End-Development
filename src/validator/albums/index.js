/* eslint-disable no-underscore-dangle */
const VarianError = require('../../customeerror/VarianError');
const { PayloadAlbumsSchema } = require('./schema');

class AlbumsValidator {
  constructor(albums) {
    this._albums = albums;

    this.validateAlbums = this.validateAlbums.bind(this);
  }

  validateAlbums() {
    const validationResult = PayloadAlbumsSchema.validate(this._albums);
    if (validationResult.error) {
      throw new VarianError(validationResult.error.message);
    }
  }
}

module.exports = AlbumsValidator;
