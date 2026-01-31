const notificationsService = require('./notifications.service');

const getNotifications = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const unreadOnly = req.query.unread === 'true';

        const result = await notificationsService.getUserNotifications(userId, {
            page,
            limit,
            unreadOnly,
        });

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getUnreadCount = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const count = await notificationsService.getUnreadCount(userId);

        res.status(200).json({
            success: true,
            data: { count },
        });
    } catch (error) {
        next(error);
    }
};

const markAsRead = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const notificationId = parseInt(req.params.id);

        await notificationsService.markAsRead(notificationId, userId);

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
        });
    } catch (error) {
        next(error);
    }
};

const markAllAsRead = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await notificationsService.markAllAsRead(userId);

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read',
        });
    } catch (error) {
        next(error);
    }
};

const deleteNotification = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const notificationId = parseInt(req.params.id);

        await notificationsService.deleteNotification(notificationId, userId);

        res.status(200).json({
            success: true,
            message: 'Notification deleted',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
};
