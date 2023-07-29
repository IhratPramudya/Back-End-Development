const ColaborationPlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'colaborationPlaylist',
  version: '1.0.0',
  register: async (server, {
    service, playlistService, usersService, validator,
  }) => {
    const colaborationHandler = new ColaborationPlaylistsHandler(
      service,
      playlistService,
      usersService,
      validator,
    );
    server.route(routes(colaborationHandler));
  },
};
