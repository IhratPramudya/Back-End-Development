const OrganizationHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "organization",
  version: "1.0.0",
  register: async (server, { service, serviceProfile, validator }) => {
    const organizationHandler = new OrganizationHandler(
      service,
      serviceProfile,
      validator,
    );
    server.route(routes(organizationHandler));
  },
};
