/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../customeerror/AuthorizationError');
const NotFoundError = require('../../customeerror/NotFoundError');
const activitiesMap = require('../../utils/activitiesMap');
const playlistMap = require('../../utils/playlistMap');

class PlaylistsService {
  constructor(collaboratorPlaylistService) {
    this._pool = new Pool();
    this._collaboratorPlaylistService = collaboratorPlaylistService;
  }

  async addPlaylists({ name }, credentialId) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO playlists ("id", "name", "userId") VALUES($1, $2, $3) RETURNING id',
      values: [id, name, credentialId],
    };

    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  async addSongToPlaylist(songId, playlistId, credentialId) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO playlist_songs ("id", "playlist_id", "song_id") VALUES($1, $2, $3)',
      values: [id, playlistId, songId],
    };

    await this._pool.query(query);

    const idActivities = nanoid(16);
    const action = 'add';
    const time = new Date().toISOString();
    const queryAddActivities = {
      text: 'INSERT INTO playlist_song_activities (id, playlist_id, song_id, user_id, action, time) VALUES($1, $2, $3, $4, $5, $6)',
      values: [idActivities, playlistId, songId, credentialId, action, time],
    };

    await this._pool.query(queryAddActivities);
  }

  async getAllPlaylists(credentialId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists
      LEFT JOIN users ON "playlists"."userId" = "users"."id"
      LEFT JOIN collaborations ON "collaborations"."playlist_id" = "playlists"."id"
      WHERE "playlists"."userId" = $1 OR "collaborations"."user_id" = $2
      `,
      values: [credentialId, credentialId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getPlaylistSongs(playlistId) {
    const query = {
      text: `
      SELECT playlists.id, playlists.name, users.username FROM playlists
      LEFT JOIN users ON "playlists"."userId" = "users"."id" WHERE "playlists"."id" = $1
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('playlist Tidak di temukan', 404);
    }

    const songsQUery = {
      text: `SELECT songs.id, songs.title, songs.performer FROM songs LEFT JOIN playlist_songs ON "playlist_songs"."song_id" = "songs"."id"
      LEFT JOIN playlists ON "playlists"."id" = "playlist_songs"."playlist_id" WHERE "playlist_songs"."playlist_id" = $1
      `,
      values: [playlistId],
    };

    const result2 = await this._pool.query(songsQUery);

    return playlistMap(result.rows[0], result2.rows);
  }

  async getActivitiesPlaylist(playlistId) {
    const query = {
      text: 'SELECT playlist_song_activities.playlist_id FROM playlist_song_activities WHERE playlist_id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Activities tidak ditemukan', 404);
    }

    const activitiesQuery = {
      text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time FROM playlist_song_activities
      LEFT JOIN songs ON "playlist_song_activities"."song_id" = "songs"."id"
      LEFT JOIN users ON "playlist_song_activities"."user_id" = "users"."id" WHERE playlist_id = $1
      `,
      values: [playlistId],
    };

    const result2 = await this._pool.query(activitiesQuery);

    if (!result2.rows.length) {
      throw new NotFoundError('Actifities tidak di temukan!');
    }

    return activitiesMap(result.rows[0], result2.rows);
  }

  async deleteSongsPlaylist(credentialId, playlistId, songId) {
    const query = {
      text: 'SELECT * FROM playlist_songs WHERE playlist_id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].song_id !== songId) {
      throw new NotFoundError('Songs tidak di temukan');
    }

    const deleteQuery = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1',
      values: [songId],
    };

    await this._pool.query(deleteQuery);

    const idActivities = nanoid(16);
    const action = 'delete';
    const time = new Date().toISOString();
    const queryAddActivities = {
      text: 'INSERT INTO playlist_song_activities (id, playlist_id, song_id, user_id, action, time) VALUES($1, $2, $3, $4, $5, $6)',
      values: [idActivities, playlistId, songId, credentialId, action, time],
    };

    await this._pool.query(queryAddActivities);
  }

  async deletePlaylist(playlistId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1',
      values: [playlistId],
    };

    await this._pool.query(query);

    const queryDeleteActivities = {
      text: 'DELETE FROM playlist_song_activities WHERE playlist_id = $1',
      values: [playlistId],
    };

    await this._pool.query(queryDeleteActivities);
  }

  async verifyPlaylistUser(playlistId, credentialId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('playlist tidak di temukan', 404);
    }

    if (result.rows[0].userId !== credentialId) {
      throw new AuthorizationError('Anda tidak berhak Mengakses Resource ini');
    }

    return result.rows[0];
  }

  async verifyPlaylistAccess(playlistId, credentialId) {
    try {
      await this.verifyPlaylistUser(playlistId, credentialId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this._collaboratorPlaylistService.verifyCollaborator(playlistId, credentialId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
