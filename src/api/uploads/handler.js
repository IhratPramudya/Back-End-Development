/* eslint-disable no-undef */
const ClientError = require('../../customeerror/ClientError');

/* eslint-disable no-underscore-dangle */
class UploadsHandler {
  constructor(service, albumService, validator) {
    this._service = service;
    this._validator = validator;
    this._albumService = albumService;

    this.postUploadsHandler = this.postUploadsHandler.bind(this);
  }

  async postUploadsHandler(request, h) {
    try {
      const { cover } = request.payload;
      const { id: albumId } = request.params;
      const { name, year } = await this._albumService.getAlbumCover(albumId);
      this._validator.validateImageAlbums(cover.hapi.headers);
      const coverUrl = await this._service.writeFile(cover, cover.hapi);

      await this._albumService.putImageAlbumById(albumId, name, year, `http://${process.env.HOST}:${process.env.PORT}/albums/covers/${coverUrl}`);

      const response = h.response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
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
      console.log(error.message);
      return response;
    }
  }
}

module.exports = UploadsHandler;
