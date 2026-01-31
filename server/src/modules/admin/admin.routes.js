const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { verifyToken, authorize } = require('../../middlewares/auth.middleware');

// All admin routes require authentication and ADMIN role
router.use(verifyToken);
router.use(authorize('ADMIN'));

// Stats & Analytics
router.get('/stats', adminController.getStats);
router.get('/analytics/daily-plays', adminController.getDailyPlays);
router.get('/analytics/top-tracks', adminController.getTopTracks);
router.get('/analytics/top-artists', adminController.getTopArtists);
router.get('/analytics/new-users', adminController.getNewUsers);

// User Management
router.get('/users', adminController.getUsers);
router.put('/users/:id', adminController.updateUser);
router.patch('/users/:id/block', adminController.toggleUserBlock);

// Verification Management
router.get('/verifications', adminController.getVerificationRequests);
router.post('/verifications/:id/approve', adminController.approveVerification);
router.post('/verifications/:id/reject', adminController.rejectVerification);

module.exports = router;
