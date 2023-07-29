const songsMap = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

const songsMapById = ({
  id, title, year, genre, performer, duration,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
});

module.exports = {
  songsMap,
  songsMapById,
};
