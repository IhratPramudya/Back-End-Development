/* eslint-disable camelcase */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
const { nanoid } = require("nanoid");

const { Pool } = require("pg");
const { hash, compare } = require("bcrypt");
// const NotFoundError = require('../../customeerror/NotFoundError');
const InvariantError = require("../../custome_error/InvariantError");
// const NotFoundError = require('../../customeerror/NotFoundError');
const AuthenticationError = require("../../custome_error/AuthenticationError");
const NotFoundError = require("../../custome_error/NotFoundError");
const showFormattedDate = require("../../utils/formatterDate");

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addUsers({ username, password, fullname }) {
    await this.identifyRedudantUsername(username);

    const id_users = nanoid(16);
    const created_at = new Date().toISOString();
    const updated_at = created_at;

    const query1 = {
      text: "INSERT INTO users (id, display_name, created_at, updated_at) VALUES($1, $2, $3, $4) RETURNING id",
      values: [
        id_users,
        fullname,
        showFormattedDate(created_at),
        showFormattedDate(updated_at),
      ],
    };

    const result2 = await this._pool.query(query1);

    const { id: userId } = result2.rows[0];

    const id = nanoid(16);
    const hashPassword = await hash(password, 10);

    const query = {
      text: "INSERT INTO auth (id, id_users, username, password, fullname) VALUES($1, $2, $3, $4, $5) RETURNING id",
      values: [id, userId, username, hashPassword, fullname],
    };

    const result = await this._pool.query(query);

    return result.rows[0].id;
  }

  async getUsers(userId) {
    const query = {
      text: "SELECT * FROM auth WHERE id = $1",
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("user Tidak di temukan !", 404);
    }

    return result.rows[0];
  }

  async veryficationUser({ username, password }) {
    const query = {
      text: "SELECT * FROM auth WHERE username = $1",
      values: [username],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError("username tidak di temukan");
    }

    const comaprePass = await compare(password, result.rows[0].password);

    if (!comaprePass) {
      throw new AuthenticationError("password tidak Valid!");
    }

    return result.rows[0];
  }

  async saveRefresToken(refreshToken) {
    const query = {
      text: "INSERT INTO authentications (token) VALUES($1)",
      values: [refreshToken],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(refreshToken) {
    const query = {
      text: "SELECT token FROM authentications WHERE token = $1",
      values: [refreshToken],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("refresh token Tidak di temukan !");
    }
  }

  async deleteRefreshTokenValid(refreshToken) {
    const query = {
      text: "DELETE FROM authentications WHERE token = $1",
      values: [refreshToken],
    };

    await this._pool.query(query);
  }

  async identifyRedudantUsername(username) {
    const query = {
      text: "SELECT * FROM auth WHERE username = $1",
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rows.length) {
      throw new InvariantError("Username tersebut sudah di gunakan");
    }
  }
}
module.exports = AuthenticationsService;
