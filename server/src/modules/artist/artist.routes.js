const express = require('express');
const router = express.Router();
const artistController = require('./artist.controller');
const { verifyToken, authorize } = require('../../middlewares/auth.middleware');

// All routes require authentication and ARTIST role
router.use(verifyToken);
router.use(authorize(['ARTIST', 'ADMIN']));

// Stats & Analytics
router.get('/stats', artistController.getStats);
router.get('/analytics/plays-per-track', artistController.getPlaysPerTrack);
router.get('/analytics/followers', artistController.getFollowersCount);
router.get('/earnings', artistController.getEarnings);

// Track management
router.get('/tracks', artistController.getMyTracks);
router.post('/tracks', artistController.uploadTrack);
router.put('/tracks/:id', artistController.updateTrack);
router.delete('/tracks/:id', artistController.deleteTrack);

// Verification
router.get('/verification', artistController.getVerificationStatus);
router.post('/verification', artistController.submitVerificationRequest);

module.exports = router;
