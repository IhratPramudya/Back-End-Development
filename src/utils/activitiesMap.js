/* eslint-disable camelcase */
const activitiesMap = ({ playlist_id }, activities) => ({
  playlistId: playlist_id,
  activities: [...activities],
});

module.exports = activitiesMap;
