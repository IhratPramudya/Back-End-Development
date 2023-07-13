/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */

const ClientError = require("../../custome_error/ClientError");

/* eslint-disable no-empty-pattern */
class ProfileHandler {
  constructor(service, serviceAuth, validator) {
    this._service = service;
    this._serviceAuth = serviceAuth;
    this._validator = validator;

    this.getUserProfileHandler = this.getUserProfileHandler.bind(this);
    this.putUserProfileHandler = this.putUserProfileHandler.bind(this);
  }

  async getUserProfileHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;

      const profile = await this._service.getProfile(credentialId);

      const response = h.response({
        status: "success",
        data: {
          profile,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      return response;
    }
  }

  async putUserProfileHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id_users } = await this._serviceAuth.getUsers(credentialId);

      const profileData = request.payload;
      this._validator.profileValidator(profileData);

      const profile = await this._service.editProfile(id_users, profileData);

      const response = h.response({
        status: "success",
        message: "Data berhasil diubah",
        data: {
          profile,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      return response;
    }
  }
}

module.exports = ProfileHandler;
