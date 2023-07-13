const path = require("path");

const routes = (handler) => [
  {
    method: "POST",
    path: "/organizations/{id}/covers",
    handler: handler.postUploadsHandler,
    options: {
      payload: {
        maxBytes: 512000,
        allow: "multipart/form-data",
        multipart: true,
        output: "stream",
      },
    },
  },
  {
    method: "POST",
    path: "/users/me",
    handler: handler.postUploadsProfileHandler,
    options: {
      payload: {
        maxBytes: 512000,
        allow: "multipart/form-data",
        multipart: true,
        output: "stream",
      },
      auth: "global_learning_jwt",
    },
  },
  {
    method: "GET",
    path: "/organizations/covers/{params*}",
    handler: {
      directory: {
        path: path.resolve(__dirname, "file/images"),
      },
    },
  },
  {
    method: "GET",
    path: "/users/covers/{params*}",
    handler: {
      directory: {
        path: path.resolve(__dirname, "file/images"),
      },
    },
  },
];

module.exports = routes;
