const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUsersHandler,
  },
  {
    method: 'POST',
    path: '/authentications',
    handler: handler.postAuthenticationsLoginHandler,
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: handler.putAuthenticationsRefreshTokenHandler,
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: handler.deleteAuthenticationsHandler,
  },
  {
    method: 'GET',
    path: '/logged',
    handler: handler.getLogged,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
