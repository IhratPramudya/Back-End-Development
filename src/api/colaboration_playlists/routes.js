const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.addColaborationPlaylistHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteCollaborationsHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
