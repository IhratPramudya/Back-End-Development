const Joi = require('joi');

const makeColaborationPlaylistPayload = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = {
  makeColaborationPlaylistPayload,
};
