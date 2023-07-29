const albumsMap = ({
  id, name, year, cover,
}, songs) => ({
  id,
  name,
  year,
  coverUrl: cover,
  songs: [...songs],
});

module.exports = albumsMap;
