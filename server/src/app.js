const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/error.middleware');
const rateLimit = require('./middlewares/rateLimit.middleware');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Apply rate limiting to auth routes (stricter)
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many login attempts, please try again later.' });
// General rate limiter for other routes
const generalLimiter = rateLimit({ windowMs: 60 * 1000, max: 100 });

// Routes
app.get('/', (req, res) => {
    res.send('Music Streaming API is running...');
});

// Import Modules
const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const tracksRoutes = require('./modules/tracks/tracks.routes');
const playlistsRoutes = require('./modules/playlists/playlists.routes');
const searchRoutes = require('./modules/search/search.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const artistRoutes = require('./modules/artist/artist.routes');
const notificationsRoutes = require('./modules/notifications/notifications.routes');
const favoritesRoutes = require('./modules/favorites/favorites.routes');
const albumsRoutes = require('./modules/albums/albums.routes');

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', generalLimiter, usersRoutes);
app.use('/api/tracks', generalLimiter, tracksRoutes);
app.use('/api/playlists', generalLimiter, playlistsRoutes);
app.use('/api/search', generalLimiter, searchRoutes);
app.use('/api/admin', generalLimiter, adminRoutes);
app.use('/api/artist', generalLimiter, artistRoutes);
app.use('/api/notifications', generalLimiter, notificationsRoutes);
app.use('/api/favorites', generalLimiter, favoritesRoutes);
app.use('/api/albums', generalLimiter, albumsRoutes);
app.use('/uploads', express.static('uploads'));

// Global Error Handler
app.use(errorMiddleware);

module.exports = app;

