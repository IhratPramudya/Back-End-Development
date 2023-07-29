const Joi = require('joi');

const userPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});

const loginPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const refreshTokenPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = { userPayloadSchema, loginPayloadSchema, refreshTokenPayloadSchema };
