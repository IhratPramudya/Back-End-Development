/* eslint-disable global-require */
const hapi = require('@hapi/hapi');
const jwt = require('@hapi/jwt');
require('dotenv').config();
const path = require('path');
const inert = require('@hapi/inert');
const config = require('./utils/config');

// Albums Plugin
const albums = require('./api/albums');
const AlbumsService = require('./services/database/AlbumsService');
const AlbumsValidator = require('./validator/albums');

// Songs Plugin
const songs = require('./api/songs');
const SongsService = require('./services/database/SongsService');
const SongsValidator = require('./validator/songs');

// Authentications Plugin
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/database/AuthenticationsService');
const AuthenticationsValidator = require('./validator/users');

// Playlists Plugin
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/database/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

// ColaborationPlaylist Plugin

const colaborationPlaylist = require('./api/colaboration_playlists');
const ColaborationPlaylistService = require('./services/database/ColaborationPlaylistsService');
const ColaborationValidatorPlaylist = require('./validator/ColaborationPlaylists');

// Exports
const exportPlaylist = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportValidator = require('./validator/exports');

// Uploads Image Albums
const uploadsImageAlbums = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');

// Likes Albums
const likeAlbums = require('./api/albums_likes');
const LikeAlbumsService = require('./services/database/LikeAlbumsService');
const CacheService = require('./services/redis/CacheService');

const init = async () => {
  // Database Postgres Service
  const cacheServices = new CacheService();
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const authenticationsService = new AuthenticationsService();
  const colaborationPlaylistService = new ColaborationPlaylistService();
  const playlistsService = new PlaylistsService(colaborationPlaylistService);
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));
  const likeAlbumsService = new LikeAlbumsService(cacheServices);

  // server Connection
  const server = hapi.server({
    port: config.app.port,
    host: config.app.host,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Menambahkan Plugin External
  await server.register([
    {
      plugin: jwt,
    },
    {
      plugin: inert,
    },
  ]);

  // Cara membuat strategy Authentikasi
  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        service: authenticationsService,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        songService: songsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: colaborationPlaylist,
      options: {
        service: colaborationPlaylistService,
        playlistService: playlistsService,
        usersService: authenticationsService,
        validator: ColaborationValidatorPlaylist,
      },
    },
    {
      plugin: exportPlaylist,
      options: {
        service: ProducerService,
        playlistService: playlistsService,
        validator: ExportValidator,
      },
    },
    {
      plugin: uploadsImageAlbums,
      options: {
        service: storageService,
        albumService: albumsService,
        validator: UploadsValidator,
      },
    },
    {
      plugin: likeAlbums,
      options: {
        service: likeAlbumsService,
        albumService: albumsService,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
