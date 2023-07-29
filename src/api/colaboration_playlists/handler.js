const ClientError = require('../../customeerror/ClientError');

/* eslint-disable no-underscore-dangle */
class ColaborationPlaylistsHandler {
  constructor(service, playlistService, usersService, validator) {
    this._service = service;
    this._playlistService = playlistService;
    this._validator = validator;
    this._usersService = usersService;

    this.addColaborationPlaylistHandler = this.addColaborationPlaylistHandler.bind(this);
    this.deleteCollaborationsHandler = this.deleteCollaborationsHandler.bind(this);
  }

  async addColaborationPlaylistHandler(request, h) {
    try {
      const validatorResult = new this._validator(request.payload);
      validatorResult.validateColaborationPlaylist();
      const { id: credentialId } = request.auth.credentials;
      const { playlistId, userId } = request.payload;
      await this._usersService.getUsers(userId);
      await this._playlistService.verifyPlaylistUser(playlistId, credentialId);
      const collaborationId = await this._service.addColaboration(playlistId, userId);

      const response = h.response({
        status: 'success',
        data: {
          collaborationId,
        },
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
      return response;
    }
  }

  async deleteCollaborationsHandler(request, h) {
    try {
      const validatorResult = new this._validator(request.payload);
      validatorResult.validateColaborationPlaylist();
      const { id: credentialId } = request.auth.credentials;
      const { playlistId, userId } = request.payload;
      await this._playlistService.verifyPlaylistUser(playlistId, credentialId);
      await this._service.deleteColaborationPlaylist(playlistId, userId);

      const response = h.response({
        status: 'success',
        message: 'Colaborasi berhasil di hapus',
      });
      response.code(200);
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
      return response;
    }
  }
}

module.exports = ColaborationPlaylistsHandler;
