/* eslint-disable no-useless-escape */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
const hapi = require("@hapi/hapi");
const jwt = require("@hapi/jwt");
require("dotenv").config();
const inert = require("@hapi/inert");
const path = require("path");
const config = require("./utils/config");
// Authentications Plugin
const authentications = require("./api/authentications");
const AuthenticationsService = require("./services/database/AuthenticationsService");
const AuthenticationsValidator = require("./validator/users");

// Profile Plugin
const profile = require("./api/profile");
const ProfileService = require("./services/database/ProfileService");
const ProfileValidator = require("./validator/profile");

// Organization Plugin
const organization = require("./api/organization");
const OrganizationService = require("./services/database/OrganizationService");
const OrganizationValidator = require("./validator/organization");

// UploadsImage Plugin
const uploadImage = require("./api/uploads");
const StorageService = require("./services/S3/StorageService");
const uploadsValidator = require("./validator/uploads");

// CollabOrganize Plugin
const collaborationOrganize = require("./api/collab_organization");
const CollaborationOrganizationService = require("./services/database/CollabOrganization");

const init = async () => {
  const authenticationsService = new AuthenticationsService();
  const profileService = new ProfileService();
  const collaborationOrganizationService =
    new CollaborationOrganizationService();
  const organizationService = new OrganizationService(
    collaborationOrganizationService,
  );
  const storageService = new StorageService();

  const server = hapi.server({
    port: config.app.port,
    host: config.app.host,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: jwt,
    },
    {
      plugin: inert,
    },
  ]);

  // Cara membuat strategy Authentikasi
  server.auth.strategy("global_learning_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: authentications,
      options: {
        service: authenticationsService,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: profile,
      options: {
        service: profileService,
        serviceAuth: authenticationsService,
        validator: ProfileValidator,
      },
    },
    {
      plugin: organization,
      options: {
        service: organizationService,
        serviceProfile: profileService,
        validator: OrganizationValidator,
      },
    },
    {
      plugin: uploadImage,
      options: {
        service: storageService,
        organizationsService: organizationService,
        profileServices: profileService,
        validator: uploadsValidator,
      },
    },
    {
      plugin: collaborationOrganize,
      options: {
        service: collaborationOrganizationService,
        organizationsService: organizationService,
        validator: OrganizationValidator,
      },
    },
  ]);

  server.route({
    method: "GET",
    path: "/file/{params*}",
    handler: {
      directory: {
        path: path.resolve(__dirname, "certicate"),
      },
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
