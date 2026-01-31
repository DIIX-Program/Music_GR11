const express = require('express');
const router = express.Router();
const favoritesController = require('./favorites.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');

// All routes require authentication
router.use(verifyToken);

// GET /api/favorites - Get user's favorites (paginated)
router.get('/', favoritesController.getFavorites);

// GET /api/favorites/:trackId/check - Check if track is favorited
router.get('/:trackId/check', favoritesController.checkFavorite);

// POST /api/favorites/:trackId - Add to favorites
router.post('/:trackId', favoritesController.addFavorite);

// DELETE /api/favorites/:trackId - Remove from favorites
router.delete('/:trackId', favoritesController.removeFavorite);

module.exports = router;
