/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { hash, compare } = require('bcrypt');
// const NotFoundError = require('../../customeerror/NotFoundError');
const VarianError = require('../../customeerror/VarianError');
// const NotFoundError = require('../../customeerror/NotFoundError');
const AuthenticationError = require('../../customeerror/AuthenticationError');
const NotFoundError = require('../../customeerror/NotFoundError');

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addUsers({ username, password, fullname }) {
    await this.identifyRedudantUsername(username);

    const id = nanoid(16);
    const hashPassword = await hash(password, 10);
    const query = {
      text: 'INSERT INTO users (id, username, password, fullname) VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashPassword, fullname],
    };

    const result = await this._pool.query(query);

    return result.rows[0].id;
  }

  async getUsers(userId) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('user Tidak di temukan !', 404);
    }
  }

  async veryficationUser({ username, password }) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('username tidak di temukan');
    }

    const comaprePass = await compare(password, result.rows[0].password);

    if (!comaprePass) {
      throw new AuthenticationError('password tidak Valid!');
    }

    return result.rows[0];
  }

  async saveRefresToken(refreshToken) {
    const query = {
      text: 'INSERT INTO authentications (token) VALUES($1)',
      values: [refreshToken],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(refreshToken) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [refreshToken],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new VarianError('refresh token Tidak di temukan !');
    }
  }

  async deleteRefreshTokenValid(refreshToken) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [refreshToken],
    };

    await this._pool.query(query);
  }

  async identifyRedudantUsername(username) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rows.length) {
      throw new VarianError('Username tersebut sudah di gunakan');
    }
  }
}
module.exports = AuthenticationsService;
