const ProfileHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "profile",
  version: "1.0.0",
  register: async (server, { service, serviceAuth, validator }) => {
    const profileHandler = new ProfileHandler(service, serviceAuth, validator);
    server.route(routes(profileHandler));
  },
};
