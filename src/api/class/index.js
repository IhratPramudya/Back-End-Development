const ClassHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "class",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const organizationHandler = new ClassHandler(service, validator);
    server.route(routes(organizationHandler));
  },
};
