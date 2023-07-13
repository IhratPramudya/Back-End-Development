/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-catch */
/* eslint-disable prettier/prettier */
/* eslint-disable consistent-return */
/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable camelcase */
const { nanoid } = require("nanoid");

const { Pool } = require("pg");
const showFormattedDate = require("../../utils/formatterDate");
const NotFoundError = require("../../custome_error/NotFoundError");
const AuthorizationError = require("../../custome_error/AuthorizationError");
const InvariantError = require("../../custome_error/InvariantError");

class OrganizationService {
  constructor(collaborationOrganizationService) {
    this._pool = new Pool();

    this._collaborationOrganizationService = collaborationOrganizationService;
  }

  async addOrganization(dataOrganization, userPrivelagesOrganiz) {
    const { organization_name, organization_desc, status } =
      dataOrganization;

    const id_organization = nanoid(16);
    const created_at = new Date().toISOString();
    const updated_at = created_at;
    const token_kelas = nanoid(10);

    const query = {
      text: `INSERT INTO organization (id_organization, id_users, organization_name, 
          organization_desc, token_kelas, status, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
          RETURNING id_organization, id_users, organization_name, organization_desc, token_kelas, status, created_at, updated_at`,
      values: [
        id_organization,
        userPrivelagesOrganiz,
        organization_name,
        organization_desc,
        token_kelas,
        status,
        showFormattedDate(created_at),
        showFormattedDate(updated_at),
      ],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getOrganizationById(id) {
    const query = {
      text: "SELECT * FROM organization WHERE id_organization = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Organisasi tidak di temukan");
    }

    return result.rows[0];
  }

  async putOrganizationById(id_organization, dataOrganization) {
    const { organization_name, organization_desc, status } =
      dataOrganization;

    const updated_at = new Date().toISOString();
    const query = {
      text: `UPDATE organization SET organization_name = $1, organization_desc = $2, status = $3, updated_at = $4 WHERE id_organization = $5
      RETURNING id_organization, id_users, organization_name, organization_desc, token_kelas, status, image_url, created_at, updated_at`,
      values: [organization_name, organization_desc, status, showFormattedDate(updated_at), id_organization],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        "Gagal memperbarui organisasi id tidak ditemukan"
      );
    }

    return result.rows[0];
  }

  async putImageOrganization(id_organization, imageUrl) {
    const updated_at = new Date().toISOString();
    const query = {
      text: `UPDATE organization SET image_url = $1, updated_at = $2 WHERE id_organization = $3
      RETURNING id_organization, id_users, organization_name, organization_desc, status, image_url, created_at, updated_at`,
      values: [imageUrl, showFormattedDate(updated_at), id_organization],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        "Gagal memperbarui organisasi id tidak ditemukan"
      );
    }

    return result.rows[0];
  }

  async verifyTokenOrganization(token, credentialId) {
    const { token_kelas } = token;

    const query = {
      text: `SELECT "organization"."id_organization", "organization"."status", 
      "organization"."token_kelas", "organization"."id_users", "auth"."id" FROM organization LEFT JOIN auth 
      ON "organization"."id_users" =  "auth"."id" WHERE token_kelas = $1`,
      values: [token_kelas]
    }

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        "token organisasi tidak ditemukan"
      );
    }

    if (result.rows[0].status === "closed") {
      throw new AuthorizationError("organisasi sudah di tutup")
    }

    if (result.rows[0].id_users === credentialId) {
      throw new InvariantError("Anda sudah memiliki akses ini")
    }

    try {
      const result2 = await this._collaborationOrganizationService.addCollabOrganization(credentialId, result.rows[0].id_organization)
      return result2
    } catch (err) {
      throw err;
    }
  }


  async verifyOrganizationUser(orgnaizationId, credentialId) {
    const query = {
      text: 'SELECT * FROM organization WHERE id_organization = $1',
      values: [orgnaizationId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('organisasi tidak di temukan');
    }

    if (result.rows[0].id_users !== credentialId) {
      throw new AuthorizationError('Anda tidak berhak Mengakses Resource ini');
    }

    return result.rows[0];
  }

  async verifyOrganizationAccess(orgnaizationId, credentialId) {
    try {
      await this.verifyOrganizationUser(orgnaizationId, credentialId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this._collaborationOrganizationService.verifyCollaborator(orgnaizationId, credentialId);
      } catch {
        throw error;
      }
    }
  }

  async getDetailOrganization(organizationId) {
    const query = {
      text: `SELECT * FROM organization  WHERE id_organization = $1`,
      values: [organizationId]
    }

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthorizationError("Anda tidak berhak mengakses organisasi tersebut !");
    }

    return result.rows[0];
  }

  async getOrganization(credentialId) {
    const query = {
      text: `SELECT organization.id_organization, organization.organization_name, organization.organization_desc, organization.status, 
      organization.image_url, organization.created_at, organization.updated_at FROM organization 
      LEFT JOIN collab_organization ON "organization"."id_organization" = "collab_organization"."id_organization"
      WHERE "organization"."id_users" = $1 OR "collab_organization"."id_users" = $2
      `,
      values: [credentialId, credentialId]
    }

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = OrganizationService;
