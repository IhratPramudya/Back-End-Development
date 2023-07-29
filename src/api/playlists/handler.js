/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const ClientError = require('../../customeerror/ClientError');

class PlaylistsHandler {
  constructor(service, songService, validator) {
    this._service = service;
    this._serviceSongs = songService;
    this._validator = validator;

    this.postAddPlaylistsHandler = this.postAddPlaylistsHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.postAddSongsPlaylist = this.postAddSongsPlaylist.bind(this);
    this.getPlaylistAndlistSongsHandler = this.getPlaylistAndlistSongsHandler.bind(this);
    this.deleteSongPlaylistHandler = this.deleteSongPlaylistHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    this.getActivitiesHandler = this.getActivitiesHandler.bind(this);
  }

  async postAddPlaylistsHandler(request, h) {
    try {
      const validatorResult = new this._validator(request.payload);
      validatorResult.addPlaylistValidate();

      const { id: credentialId } = request.auth.credentials;
      const playlistId = await this._service.addPlaylists(request.payload, credentialId);

      const response = h.response({
        status: 'success',
        message: 'Playlists berhasil di tambahkan',
        data: {
          playlistId,
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

  async postAddSongsPlaylist(request, h) {
    try {
      const validatorResult = new this._validator(request.payload);
      validatorResult.songsValidate();
      const { id: credentialId } = request.auth.credentials;

      const { id: playlistId } = request.params;

      await this._service.verifyPlaylistAccess(playlistId, credentialId);
      const { songId } = request.payload;
      await this._serviceSongs.getByIdSongs(songId);

      await this._service.addSongToPlaylist(songId, playlistId, credentialId);

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil di tambahkan ke playlist',
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

  async getPlaylistAndlistSongsHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id: playlistId } = request.params;
      await this._service.verifyPlaylistAccess(playlistId, credentialId);
      const playlist = await this._service.getPlaylistSongs(playlistId);

      const response = h.response({
        status: 'success',
        data: {
          playlist,
        },
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

  async getPlaylistsHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const playlists = await this._service.getAllPlaylists(credentialId);
      const response = h.response({
        status: 'success',
        data: {
          playlists,
        },
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

  async getActivitiesHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id: playlist_Id } = request.params;
      await this._service.verifyPlaylistUser(playlist_Id, credentialId);
      const { playlistId, activities } = await this._service.getActivitiesPlaylist(playlist_Id);

      const response = h.response({
        status: 'success',
        data: {
          playlistId,
          activities,
        },
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

  async deletePlaylistHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id } = request.params;
      const { id: playlistId } = await this._service.verifyPlaylistUser(id, credentialId);
      await this._service.deletePlaylist(playlistId);
      const response = h.response({
        status: 'success',
        message: 'Playlist Berhasil dihapus',
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

  async deleteSongPlaylistHandler(request, h) {
    try {
      const validatorResult = new this._validator(request.payload);
      validatorResult.songsValidate();
      const { id: credentialId } = request.auth.credentials;
      const { id: playlistId } = request.params;
      const { songId } = request.payload;
      await this._service.verifyPlaylistAccess(playlistId, credentialId);
      await this._service.deleteSongsPlaylist(credentialId, playlistId, songId);

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
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

module.exports = PlaylistsHandler;
