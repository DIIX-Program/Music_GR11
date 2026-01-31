const express = require('express');
const router = express.Router();
const albumsController = require('./albums.controller');
const { verifyToken, authorize } = require('../../middlewares/auth.middleware');

// Public routes
router.get('/', albumsController.getAllAlbums);
router.get('/:id', albumsController.getAlbumById);

// Artist-only routes
router.get('/me/albums', verifyToken, authorize('ARTIST'), albumsController.getMyAlbums);
router.post('/', verifyToken, authorize('ARTIST'), albumsController.createAlbum);
router.put('/:id', verifyToken, authorize('ARTIST'), albumsController.updateAlbum);
router.delete('/:id', verifyToken, authorize('ARTIST'), albumsController.deleteAlbum);

// Track management
router.post('/:id/tracks', verifyToken, authorize('ARTIST'), albumsController.addTrackToAlbum);
router.delete('/:id/tracks/:trackId', verifyToken, authorize('ARTIST'), albumsController.removeTrackFromAlbum);

module.exports = router;
