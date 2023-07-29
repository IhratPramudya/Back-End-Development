const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { service, songService, validator }) => {
    const playlistsHandler = new PlaylistsHandler(service, songService, validator);
    server.route(routes(playlistsHandler));
  },
};
