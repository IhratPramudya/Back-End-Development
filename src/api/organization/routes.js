const routes = (handler) => [
  {
    method: "POST",
    path: "/organizations",
    handler: handler.postOrganizationHandler,
    options: {
      auth: "global_learning_jwt",
    },
  },
  {
    method: "PUT",
    path: "/organizations/{id}",
    handler: handler.putOrganizationHandler,
    options: {
      auth: "global_learning_jwt",
    },
  },
  {
    method: "GET",
    path: "/organizations/{id}",
    handler: handler.getDetailOrganizationHandler,
    options: {
      auth: "global_learning_jwt",
    },
  },
  {
    method: "GET",
    path: "/organizations",
    handler: handler.getAllOrganization,
    options: {
      auth: "global_learning_jwt",
    },
  },
];

module.exports = routes;
