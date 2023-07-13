/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-catch */
/* eslint-disable prettier/prettier */
/* eslint-disable no-dupe-class-members */
/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable camelcase */
const { nanoid } = require("nanoid");

const { Pool } = require("pg");
const InvariantError = require("../../custome_error/InvariantError");

class CollaborationOrganizationService {
    constructor() {
        this._pool = new Pool();
    }

    async addCollabOrganization(userId, organizationId) {
        const id = `collab->${nanoid(16)}`;
        const query = {
            text: `INSERT INTO collab_organization (id_colab, id_users, id_organization) VALUES($1, $2, $3) 
          RETURNING id_colab, id_users, id_organization`,
            values: [id, userId, organizationId],
        };

        const result = await this._pool.query(query);
        return result.rows[0];
    }

    async verifyCollaborator(orgnaizationId, credentialId) {
        const query = {
            text: 'SELECT * FROM collab_organization WHERE id_organization = $1 AND id_users = $2',
            values: [orgnaizationId, credentialId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Colaborasi gagal di verifikasi');
        }
    }

}

module.exports = CollaborationOrganizationService;
