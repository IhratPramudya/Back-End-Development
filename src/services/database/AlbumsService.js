/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../../customeerror/NotFoundError');
const VarianError = require('../../customeerror/VarianError');
const albumsMap = require('../../utils/albumsMap');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbums({ name, year }) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new VarianError('Data gagal di tambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak di temukan', 404);
    }
    const query2 = {
      text: 'SELECT songs.* FROM songs LEFT JOIN albums ON "songs"."albumId" = "albums"."id" WHERE "albums"."id" = $1',
      values: [id],
    };

    const result2 = await this._pool.query(query2);

    return albumsMap(result.rows[0], result2.rows);
  }

  async putAlbumById(id, name, year) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album id tidak ditemukan', 404);
    }
  }

  async putImageAlbumById(id, name, year, cover) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, cover = $3 WHERE id = $4 RETURNING id',
      values: [name, year, cover, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album id tidak ditemukan', 404);
    }
  }

  async getAllAlbum() {
    const query = 'SELECT * FROM albums';

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak di temukan', 404);
    }

    return result.rows;
  }

  async getAlbumCover(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak di temukan', 404);
    }

    return result.rows[0];
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus album, id tidak ditemukan', 404);
    }
  }
}

module.exports = AlbumsService;
