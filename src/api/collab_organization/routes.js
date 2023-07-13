const routes = (handler) => [
  {
    method: "POST",
    path: "/collaborations",
    handler: handler.addCollaborationOrganizationHandler,
    options: {
      auth: "global_learning_jwt",
    },
  },
];

module.exports = routes;
