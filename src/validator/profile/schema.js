/* eslint-disable prettier/prettier */
const Joi = require("joi");

const accessTokenTokenPayloadSchema = Joi.object({
  accessToken: Joi.string().required(),
});

const profilePayloadSchema = Joi.object({
  display_name: Joi.string().allow("", null),
  user_desc: Joi.string().allow("", null),
  phone_number: Joi.string().allow("", null),
  birthday: Joi.string().allow("", null),
});

module.exports = {
  accessTokenTokenPayloadSchema,
  profilePayloadSchema,
};
