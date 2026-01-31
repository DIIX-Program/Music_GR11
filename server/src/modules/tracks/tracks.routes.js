const express = require('express');
const router = express.Router();
const tracksController = require('./tracks.controller');
const upload = require('../../middlewares/upload.middleware');
const { verifyToken, authorize } = require('../../middlewares/auth.middleware');

router.get('/', tracksController.getTracks);
router.get('/:id/stream', tracksController.streamTrack);
router.post('/',
    verifyToken,
    authorize('ADMIN'),
    upload.fields([{ name: 'trackFile', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]),
    tracksController.uploadTrack
);
router.delete('/:id', verifyToken, authorize('ADMIN'), tracksController.deleteTrack);

module.exports = router;
