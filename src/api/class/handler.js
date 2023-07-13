/* eslint-disable prettier/prettier */
/* eslint-disable no-dupe-class-members */
/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */

const ClientError = require("../../custome_error/ClientError");

/* eslint-disable no-empty-pattern */
class ClassHandler {
  constructor(service, serviceProfile, validator) {
    this._service = service;
    this._serviceProfile = serviceProfile;
    this._validator = validator;

    this.postOrganizationHandler = this.postOrganizationHandler.bind(this);
    this.putOrganizationHandler = this.putOrganizationHandler.bind(this);
    this.getDetailOrganizationHandler = this.getDetailOrganizationHandler.bind(this);
    this.getAllOrganization = this.getAllOrganization.bind(this);
  }

  async postOrganizationHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      this._validator.organizationValidation(request.payload);

      const dataOrganization = request.payload;

      const organization = await this._service.addOrganization(dataOrganization, credentialId)

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

  async putOrganizationHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id: organizeId } = request.params;
      this._validator.organizationValidation(request.payload);

      await this._service.verifyOrganizationUser(organizeId, credentialId);

      const dataOrganization = request.payload;

      const organization = await this._service.putOrganizationById(organizeId, dataOrganization)

      const response = h.response({
        status: "success",
        message: "Data berhasil di update",
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

  async getDetailOrganizationHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id: organizeId } = request.params;


      await this._service.verifyOrganizationAccess(organizeId, credentialId)

      const organization = await this._service.getDetailOrganization(organizeId);

      const response = h.response({
        status: "success",
        message: "Data berhasil ditemukan",
        data: {
          organization,
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

  async getAllOrganization(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;

      const organization = await this._service.getOrganization(credentialId);

      const response = h.response({
        status: "success",
        message: "Data berhasil ditemukan",
        data: {
          organization,
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

module.exports = ClassHandler;
