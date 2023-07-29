const playlistMap = ({ id, name, username }, songs) => ({
  id,
  name,
  username,
  songs: [...songs],
});

module.exports = playlistMap;
