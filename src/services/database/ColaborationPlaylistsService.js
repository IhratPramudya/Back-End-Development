/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable linebreak-style */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const VarianError = require('../../customeerror/VarianError');

class ColaborationPlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async addColaboration(playlistId, credentialId) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO collaborations (id, playlist_id, user_id) VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, credentialId],
    };

    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  async deleteColaborationPlaylist(playlistId, credentialId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, credentialId],
    };

    await this._pool.query(query);
  }

  async verifyCollaborator(playlistId, credentialId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, credentialId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new VarianError('Colaborasi gagal di verifikasi');
    }
  }
}
module.exports = ColaborationPlaylistService;
