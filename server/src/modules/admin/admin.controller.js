const adminService = require('./admin.service');
const notificationsService = require('../notifications/notifications.service');

// Stats
const getStats = async (req, res, next) => {
    try {
        const stats = await adminService.getStats();
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
};

const getDailyPlays = async (req, res, next) => {
    try {
        const days = parseInt(req.query.days) || 7;
        const data = await adminService.getDailyPlays(days);
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

const getTopTracks = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const data = await adminService.getTopTracks(limit);
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

const getTopArtists = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const data = await adminService.getTopArtists(limit);
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

const getNewUsers = async (req, res, next) => {
    try {
        const days = parseInt(req.query.days) || 7;
        const count = await adminService.getNewUsersCount(days);
        res.status(200).json({ success: true, data: { count, days } });
    } catch (error) {
        next(error);
    }
};

// User Management
const getUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const role = req.query.role || null;
        const search = req.query.search || '';

        const result = await adminService.getAllUsers({ page, limit, role, search });
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);
        const { role, isActive } = req.body;

        const updateData = {};
        if (role) updateData.role = role;
        if (typeof isActive === 'boolean') updateData.isActive = isActive;

        const user = await adminService.updateUser(userId, updateData);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

const toggleUserBlock = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);
        const { blocked } = req.body;

        await adminService.toggleUserActive(userId, !blocked);
        res.status(200).json({
            success: true,
            message: blocked ? 'User blocked' : 'User unblocked'
        });
    } catch (error) {
        next(error);
    }
};

// Verification
const getVerificationRequests = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const status = req.query.status || null;

        const result = await adminService.getVerificationRequests({ page, limit, status });
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const approveVerification = async (req, res, next) => {
    try {
        const requestId = parseInt(req.params.id);
        const adminId = req.user.id;

        const result = await adminService.approveVerification(requestId, adminId);

        // Send notification to artist
        try {
            await notificationsService.notifyVerification(result.artistId, true);
        } catch (err) {
            console.error('Failed to send verification notification:', err);
        }

        res.status(200).json({ success: true, message: 'Artist verified successfully' });
    } catch (error) {
        next(error);
    }
};

const rejectVerification = async (req, res, next) => {
    try {
        const requestId = parseInt(req.params.id);
        const adminId = req.user.id;
        const { notes } = req.body;

        const result = await adminService.rejectVerification(requestId, adminId, notes);

        // Send notification to artist
        try {
            await notificationsService.notifyVerification(result.artistId, false, notes);
        } catch (err) {
            console.error('Failed to send verification notification:', err);
        }

        res.status(200).json({ success: true, message: 'Verification request rejected' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getStats,
    getDailyPlays,
    getTopTracks,
    getTopArtists,
    getNewUsers,
    getUsers,
    updateUser,
    toggleUserBlock,
    getVerificationRequests,
    approveVerification,
    rejectVerification,
};
