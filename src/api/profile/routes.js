const routes = (handler) => [
  {
    method: "GET",
    path: "/user/me",
    handler: handler.getUserProfileHandler,
    options: {
      auth: "global_learning_jwt",
    },
  },
  {
    method: "PUT",
    path: "/user/me",
    handler: handler.putUserProfileHandler,
    options: {
      auth: "global_learning_jwt",
    },
  },
];

module.exports = routes;
