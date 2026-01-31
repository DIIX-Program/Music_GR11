const express = require('express');
const router = express.Router();
const playlistsController = require('./playlists.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');

router.get('/', playlistsController.getPlaylists); // Public + User's own
router.get('/:id', playlistsController.getPlaylistById);
router.post('/', verifyToken, playlistsController.createPlaylist);
router.put('/:id', verifyToken, playlistsController.updatePlaylist);
router.delete('/:id', verifyToken, playlistsController.deletePlaylist);
router.post('/:id/tracks', verifyToken, playlistsController.addTrack);
router.delete('/:id/tracks/:trackId', verifyToken, playlistsController.removeTrack);

module.exports = router;
