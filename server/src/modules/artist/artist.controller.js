const artistService = require('./artist.service');

const getStats = async (req, res, next) => {
    try {
        const stats = await artistService.getStats(req.user.id);
        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};

const getMyTracks = async (req, res, next) => {
    try {
        const tracks = await artistService.getMyTracks(req.user.id);
        res.status(200).json({
            success: true,
            data: tracks,
        });
    } catch (error) {
        next(error);
    }
};

const uploadTrack = async (req, res, next) => {
    try {
        const track = await artistService.uploadTrack(req.user.id, req.body);
        res.status(201).json({
            success: true,
            message: 'Track uploaded successfully',
            data: track,
        });
    } catch (error) {
        next(error);
    }
};

const updateTrack = async (req, res, next) => {
    try {
        const track = await artistService.updateTrack(req.user.id, req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Track updated successfully',
            data: track,
        });
    } catch (error) {
        next(error);
    }
};

const deleteTrack = async (req, res, next) => {
    try {
        await artistService.deleteTrack(req.user.id, req.params.id);
        res.status(200).json({
            success: true,
            message: 'Track deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

const getEarnings = async (req, res, next) => {
    try {
        const earnings = await artistService.getEarnings(req.user.id);
        res.status(200).json({
            success: true,
            data: earnings,
        });
    } catch (error) {
        next(error);
    }
};

// Verification
const submitVerificationRequest = async (req, res, next) => {
    try {
        const { reason } = req.body;
        const request = await artistService.submitVerificationRequest(req.user.id, reason);
        res.status(201).json({
            success: true,
            message: 'Verification request submitted',
            data: request,
        });
    } catch (error) {
        next(error);
    }
};

const getVerificationStatus = async (req, res, next) => {
    try {
        const status = await artistService.getVerificationStatus(req.user.id);
        res.status(200).json({
            success: true,
            data: status,
        });
    } catch (error) {
        next(error);
    }
};

// Analytics
const getPlaysPerTrack = async (req, res, next) => {
    try {
        const tracks = await artistService.getPlaysPerTrack(req.user.id);
        res.status(200).json({
            success: true,
            data: tracks,
        });
    } catch (error) {
        next(error);
    }
};

const getFollowersCount = async (req, res, next) => {
    try {
        const count = await artistService.getFollowersCount(req.user.id);
        res.status(200).json({
            success: true,
            data: { followers: count },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getStats,
    getMyTracks,
    uploadTrack,
    updateTrack,
    deleteTrack,
    getEarnings,
    submitVerificationRequest,
    getVerificationStatus,
    getPlaysPerTrack,
    getFollowersCount,
};
