/* eslint-disable radix */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-empty */
/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');

class LikeAlbumsService {
  constructor(cacheServices) {
    this._pool = new Pool();
    this._cacheServices = cacheServices;
  }

  async likeAlbums(userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length) {
      const deleteLikesQuery = {
        text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
        values: [userId, albumId],
      };

      await this._pool.query(deleteLikesQuery);
      await this._cacheServices.delete(`Likes:${albumId}`);
    } else {
      const id = `Likes-${nanoid(16)}`;
      const queryInsertLikes = {
        text: 'INSERT INTO user_album_likes(id, user_id, album_id) VALUES($1, $2, $3)',
        values: [id, userId, albumId],
      };

      await this._pool.query(queryInsertLikes);
      await this._cacheServices.delete(`Likes:${albumId}`);
    }
  }

  async getLikesCount(albumId) {
    try {
      const result = await this._cacheServices.get(`Likes:${albumId}`);
      return parseInt(JSON.parse(result).count);
    } catch (error) {
      const query = {
        text: 'SELECT count(*) FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      await this._cacheServices.set(`Likes:${albumId}`, JSON.stringify(result.rows[0]));
      return parseInt(result.rows[0].count);
    }
  }
}

module.exports = LikeAlbumsService;
