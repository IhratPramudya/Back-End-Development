const Joi = require('joi');

const payloadSongsSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});

const payloadTitleSongsSchema = Joi.object({
  title: Joi.string().required(),
});

module.exports = {
  payloadSongsSchema,
  payloadTitleSongsSchema,
};
