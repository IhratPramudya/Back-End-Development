const CollaborationOrganizationHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "collaborationOrganize",
  version: "1.0.0",
  register: async (server, { service, organizationsService, validator }) => {
    const organizationHandler = new CollaborationOrganizationHandler(
      service,
      organizationsService,
      validator,
    );
    server.route(routes(organizationHandler));
  },
};
