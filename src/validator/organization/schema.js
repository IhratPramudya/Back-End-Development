/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prettier/prettier */
const Joi = require("joi");

const organizationPayloadSchema = Joi.object({
  organization_name: Joi.string().required(),
  organization_desc: Joi.string().required(),
  status: Joi.string().equal("open", "closed").required()
});

const tokenKelasPayloadSchema = Joi.object({
  token_kelas: Joi.string().required(),
});

module.exports = {
  organizationPayloadSchema,
  tokenKelasPayloadSchema,
};
