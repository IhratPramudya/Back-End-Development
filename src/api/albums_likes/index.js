const AlbumsLikeHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albumsLike',
  version: '1.0.0',
  register: async (server, { service, albumService }) => {
    const albumsLikeHandler = new AlbumsLikeHandler(service, albumService);
    server.route(routes(albumsLikeHandler));
  },
};
