/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */

const ClientError = require("../../custome_error/ClientError");

/* eslint-disable no-empty-pattern */
class CollaborationOrganizationHandler {
  constructor(service, organizationsService, validator) {
    this._service = service;
    this._organizationsService = organizationsService;
    this._validator = validator;

    this.addCollaborationOrganizationHandler = this.addCollaborationOrganizationHandler.bind(this);
  }

  async addCollaborationOrganizationHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      this._validator.tokenKelasValidator(request.payload);

      const tokenOrganization = request.payload;

      const organization = await this._organizationsService.verifyTokenOrganization(tokenOrganization, credentialId);

      const response = h.response({
        status: "success",
        message: "Data berhasil di tambahkan",
        data: {
          organization,
        },
      });
      response.code(201);
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

module.exports = CollaborationOrganizationHandler;
