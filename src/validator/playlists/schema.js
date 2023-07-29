const Joi = require('joi');

const addPlaylistsPayloadSchema = Joi.object({
  name: Joi.string().required(),
  userId: Joi.string(),
});

const addSongsPlaylistsPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  addPlaylistsPayloadSchema,
  addSongsPlaylistsPayloadSchema,
};
