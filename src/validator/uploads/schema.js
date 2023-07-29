const Joi = require('joi');

const ImageAlbumsSchema = Joi.object({
  'content-type': Joi.string().valid('image/jpg', 'image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp').required(),
}).unknown();

module.exports = ImageAlbumsSchema;
