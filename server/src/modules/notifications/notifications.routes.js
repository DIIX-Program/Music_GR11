const express = require('express');
const router = express.Router();
const notificationsController = require('./notifications.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');

// All routes require authentication
router.use(verifyToken);

// GET /api/notifications - Get user notifications (paginated)
router.get('/', notificationsController.getNotifications);

// GET /api/notifications/unread-count - Get unread count
router.get('/unread-count', notificationsController.getUnreadCount);

// PATCH /api/notifications/read-all - Mark all as read
router.patch('/read-all', notificationsController.markAllAsRead);

// PATCH /api/notifications/:id/read - Mark single as read
router.patch('/:id/read', notificationsController.markAsRead);

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', notificationsController.deleteNotification);

module.exports = router;
