const ClientError = require("../../custome_error/ClientError");

/* eslint-disable no-undef */

/* eslint-disable no-underscore-dangle */
class UploadsHandler {
  constructor(service, organizationsService, profileServices, validator) {
    this._service = service;
    this._validator = validator;
    this._organizationsService = organizationsService;
    this._profileServices = profileServices;

    this.postUploadsHandler = this.postUploadsHandler.bind(this);
    this.postUploadsProfileHandler = this.postUploadsProfileHandler.bind(this);
  }

  async postUploadsHandler(request, h) {
    try {
      const { cover } = request.payload;
      const { id: organizeId } = request.params;

      await this._organizationsService.getOrganizationById(organizeId);

      this._validator.validateOrganizationImage(cover.hapi.headers);
      const fileLocation = await this._service.writeFile(cover, cover.hapi);

      const oraganization =
        await this._organizationsService.putImageOrganization(
          organizeId,
          fileLocation,
        );

      const response = h.response({
        status: "success",
        message: "Gambar berhasil diunggah",
        data: oraganization,
      });
      response.code(201);
      return response;
    } catch (error) {
      console.log(error.message);
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

  async postUploadsProfileHandler(request, h) {
    try {
      const { cover } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      const { id: profileId } = await this._profileServices.getProfile(
        credentialId,
      );

      this._validator.validateOrganizationImage(cover.hapi.headers);
      const fileLocation = await this._service.writeFile(cover, cover.hapi);

      const oraganization = await this._profileServices.putImageProfile(
        profileId,
        fileLocation,
      );

      const response = h.response({
        status: "success",
        message: "Gambar berhasil diunggah",
        data: oraganization,
      });
      response.code(201);
      return response;
    } catch (error) {
      console.log(error.message);
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

module.exports = UploadsHandler;
