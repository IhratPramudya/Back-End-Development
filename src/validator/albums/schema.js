const Joi = require('joi');

const PayloadAlbumsSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

module.exports = { PayloadAlbumsSchema };
