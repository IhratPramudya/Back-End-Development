/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const ClientError = require('../../customeerror/ClientError');

class ExportsHandler {
  constructor(service, playlistService, validator) {
    this._service = service;
    this._playlistService = playlistService;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatorExportPlaylist(request.payload);
      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
      await this._playlistService.getPlaylistSongs(playlistId);
      const message = {
        playlistId,
        targetEmail: request.payload.targetEmail,
      };
      await this._service.sendMessage('export:playlist', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.log(error);
      return response;
    }
  }
}

module.exports = ExportsHandler;
