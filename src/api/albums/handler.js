/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const ClientError = require('../../customeerror/ClientError');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postAlbumsHandler = this.postAlbumsHandler.bind(this);
    this.getAlbumsByIdHandler = this.getAlbumsByIdHandler.bind(this);
    this.putAlbumsByIdHandler = this.putAlbumsByIdHandler.bind(this);
    this.deleteAlbumsByIdHandler = this.deleteAlbumsByIdHandler.bind(this);
    this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
  }

  async postAlbumsHandler(request, h) {
    try {
      const validatorValid = new this._validator(request.payload);
      validatorValid.validateAlbums();
      const { name, year } = request.payload;

      const albumId = await this._service.addAlbums({ name, year });

      const response = h.response({
        status: 'success',
        data: {
          albumId,
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

  async getAlbumsByIdHandler(request, h) {
    try {
      const { id } = request.params;

      const album = await this._service.getAlbumById(id);

      return {
        status: 'success',
        data: {
          album,
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

  async putAlbumsByIdHandler(request, h) {
    try {
      const validatorValid = new this._validator(request.payload);
      validatorValid.validateAlbums();
      const { id } = request.params;
      const { name, year } = request.payload;

      await this._service.putAlbumById(id, name, year);

      const response = h.response({
        status: 'success',
        message: 'Album berhasil di update',
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

  async getAlbumsHandler(request, h) {
    try {
      const album = await this._service.getAllAlbum();

      return {
        status: 'success',
        data: {
          album,
        },
      };
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

  async deleteAlbumsByIdHandler(request, h) {
    try {
      const { id } = request.params;

      await this._service.deleteAlbumById(id);

      const response = h.response({
        status: 'success',
        message: 'Album berhasil di hapus dari database',
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

module.exports = AlbumsHandler;
