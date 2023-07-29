/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */

const ClientError = require('../../customeerror/ClientError');
const TokenManager = require('../../tokenAPI/tokenManager');

/* eslint-disable no-empty-pattern */
class AuthenticationsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUsersHandler = this.postUsersHandler.bind(this);
    this.postAuthenticationsLoginHandler = this.postAuthenticationsLoginHandler.bind(this);
    this.putAuthenticationsRefreshTokenHandler = this.putAuthenticationsRefreshTokenHandler.bind(this);
    this.deleteAuthenticationsHandler = this.deleteAuthenticationsHandler.bind(this);
    this.getLogged = this.getLogged.bind(this);
  }

  async postUsersHandler(request, h) {
    try {
      const validatorValid = new this._validator(request.payload);
      validatorValid.validateUser();

      const userId = await this._service.addUsers(request.payload);

      const response = h.response({
        status: 'success',
        message: 'Data berhasil di tambahkan',
        data: {
          userId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      return response;
    }
  }

  async postAuthenticationsLoginHandler(request, h) {
    try {
      const validatorValid = new this._validator(request.payload);
      validatorValid.loginValidateUser();

      const { id } = await this._service.veryficationUser(request.payload);

      const accessToken = TokenManager.generateAccessToken({ id });
      const refreshToken = TokenManager.generateRefreshToken({ id });

      await this._service.saveRefresToken(refreshToken);
      const response = h.response({
        status: 'success',
        data: {
          accessToken,
          refreshToken,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      return response;
    }
  }

  async putAuthenticationsRefreshTokenHandler(request, h) {
    try {
      const validatorValid = new this._validator(request.payload);
      validatorValid.refreshValidation();

      const { refreshToken } = request.payload;

      await this._service.verifyRefreshToken(refreshToken);
      const { id } = TokenManager.verifyRefreshTokenManager(refreshToken);

      const accessToken = TokenManager.generateAccessToken({ id });

      const response = h.response({
        status: 'success',
        data: {
          accessToken,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      return response;
    }
  }

  async deleteAuthenticationsHandler(request, h) {
    try {
      const validatorValid = new this._validator(request.payload);
      validatorValid.refreshValidation();
      const { refreshToken } = request.payload;
      await this._service.verifyRefreshToken(refreshToken);
      await this._service.deleteRefreshTokenValid(refreshToken);

      const response = h.response({
        status: 'success',
        message: 'Token berhasil di hapus',
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      return response;
    }
  }

  async getLogged(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      await this._service.getUsers(credentialId);
      const response = h.response({
        status: 'success',
        data: {
          logged: true,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      return response;
    }
  }
}

module.exports = AuthenticationsHandler;
