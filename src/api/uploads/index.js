const UploadsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "uploads",
  version: "1.0.0",
  register: async (
    server,
    { service, organizationsService, profileServices, validator },
  ) => {
    const uploadsHandler = new UploadsHandler(
      service,
      organizationsService,
      profileServices,
      validator,
    );
    server.route(routes(uploadsHandler));
  },
};
