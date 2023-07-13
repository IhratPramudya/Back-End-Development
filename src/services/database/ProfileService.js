/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable camelcase */
/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
// const { nanoid } = require("nanoid");

const { Pool } = require("pg");
// const { hash, compare } = require("bcrypt");
// const InvariantError = require("../../custome_error/InvariantError");
// const AuthenticationError = require("../../custome_error/AuthenticationError");
const NotFoundError = require("../../custome_error/NotFoundError");
const showFormattedDate = require("../../utils/formatterDate");
// const showFormattedDate = require("../../utils/formatterDate");

class ProfileService {
  constructor() {
    this._pool = new Pool();
  }

  async getProfile(credentailId) {
    const query = {
      text: 'SELECT users.* FROM auth LEFT JOIN users ON "auth"."id_users" = "users"."id" WHERE "auth"."id" = $1',
      values: [credentailId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("user tidak ditemukan!");
    }

    return result.rows[0];
  }

  async editProfile(credentailId, profileData) {
    const { display_name, user_desc, phone_number, birthday } = profileData;

    const updated_at = new Date().toISOString();

    const query = {
      text: `UPDATE users SET display_name = $1 , user_desc = $2, phone_number = $3, birthday = $4, updated_at = $5 WHERE id = $6 RETURNING id,
      display_name, user_desc, phone_number, birthday, created_at, updated_at`,
      values: [
        display_name,
        user_desc,
        phone_number,
        birthday,
        showFormattedDate(updated_at),
        credentailId,
      ],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async putImageProfile(profileId, imageUrl) {
    const updated_at = new Date().toISOString();
    const query = {
      text: `UPDATE users SET image_url = $1, updated_at = $2 WHERE id = $3
      RETURNING id, display_name, user_desc, phone_number, birthday, image_url, created_at, updated_at`,
      values: [imageUrl, showFormattedDate(updated_at), profileId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        "Gagal memperbarui organisasi id tidak ditemukan"
      );
    }

    return result.rows[0];
  }
}

module.exports = ProfileService;
