/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../../customeerror/NotFoundError');
const VarianError = require('../../customeerror/VarianError');
const { songsMap, songsMapById } = require('../../utils/songsMap');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongs({
    title, year, genre, performer, duration, albumId,
  }) {
    if (albumId !== undefined) {
      await this.verifyAlbumsId(albumId);
    }
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new VarianError('Data songs gagal di tambahkan');
    }

    return result.rows[0].id;
  }

  async getAllSongs() {
    const result = await this._pool.query('SELECT * FROM songs');

    return result.rows.map(songsMap);
  }

  async getByIdSongs(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Data id tersebut tidak ditemukan', 404);
    }

    return result.rows.map(songsMapById)[0];
  }

  async getTitleUser({ title }) {
    const query = {
      text: 'SELECT * FROM songs WHERE title LIKE $1',
      values: [`%${title}%`],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('music dengan title tersebut tidak di temukan', 404);
    }

    return result.rows;
  }

  async editSongsById(id, {
    title, year, genre, performer, duration,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5 WHERE id = $6 RETURNING id',
      values: [title, year, genre, performer, duration, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Data gagal di update Id tidak di temukan', 404);
    }
  }

  async deleteSongsById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Data id tidak di temukan', 404);
    }
  }

  async verifyAlbumsId(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('id album tidak di temukan', 404);
    }
  }
}

module.exports = SongsService;
