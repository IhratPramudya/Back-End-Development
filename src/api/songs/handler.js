/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */

const ClientError = require('../../customeerror/ClientError');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongsHandler = this.postSongsHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongsByIdHandler = this.getSongsByIdHandler.bind(this);
    this.getSongsByTitleHandler = this.getSongsByTitleHandler.bind(this);
    this.putSongsByIdHandler = this.putSongsByIdHandler.bind(this);
    this.deleteSongsByIdHandler = this.deleteSongsByIdHandler.bind(this);
  }

  async postSongsHandler(request, h) {
    try {
      const validatorResult = new this._validator(request.payload);
      validatorResult.validateSongs();
      const {
        title, year, genre, performer, duration, albumId,
      } = request.payload;

      const songId = await this._service.addSongs({
        title, year, genre, performer, duration, albumId,
      });

      const response = h.response({
        status: 'success',
        data: {
          songId,
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

  async getSongsHandler(request, h) {
    try {
      const songs = await this._service.getAllSongs();
      return {
        status: 'success',
        data: {
          songs,
        },
      };
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

  async getSongsByIdHandler(request, h) {
    try {
      const { id } = request.params;

      const song = await this._service.getByIdSongs(id);
      const response = h.response({
        status: 'success',
        data: {
          song,
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

  async getSongsByTitleHandler(request, h) {
    try {
      const validatorResult = new this._validator(request.query);
      validatorResult.validateTitleSongs();

      const songs = await this._service.getTitleUser(request.query);

      const response = h.response({
        status: 'success',
        data: {
          songs,
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

  async putSongsByIdHandler(request, h) {
    try {
      const validatorResult = new this._validator(request.payload);
      validatorResult.validateSongs();
      const { id } = request.params;
      await this._service.editSongsById(id, request.payload);
      const response = h.response({
        status: 'success',
        message: 'Data berhasil diupdate',
      });
      response.code(200);
      return response;
    } catch (error) {
      console.log(error.message);
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

  async deleteSongsByIdHandler(request, h) {
    try {
      const { id } = request.params;

      const result = await this._service.deleteSongsById(id);
      const response = h.response({
        status: 'success',
        message: 'Data berhasil dihapus',
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

module.exports = SongsHandler;
