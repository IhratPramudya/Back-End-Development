const ClientError = require('../../customeerror/ClientError');

/* eslint-disable no-underscore-dangle */
class AlbumsLikeHandler {
  constructor(service, albumService) {
    this._service = service;
    this._albumService = albumService;

    this.postLikeAlbumsHandler = this.postLikeAlbumsHandler.bind(this);
    this.getCountLikesALbumsHandler = this.getCountLikesALbumsHandler.bind(this);
  }

  async postLikeAlbumsHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id: albumId } = request.params;

      await this._albumService.getAlbumById(albumId);
      await this._service.likeAlbums(credentialId, albumId);

      const response = h.response({
        status: 'success',
        message: 'Kamu berhasil menyukai albums',
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

  async getCountLikesALbumsHandler(request, h) {
    try {
      const { id: albumId } = request.params;
      const count = await this._service.getLikesCount(albumId);

      const response = h.response({
        status: 'success',
        data: {
          likes: count,
        },
      });
      response.header('X-Data-Source', 'cache');
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
      console.log(error);
      return response;
    }
  }
}

module.exports = AlbumsLikeHandler;
