const prisma = require('../../utils/prisma');

const create = async (data) => {
    return await prisma.notification.create({
        data,
    });
};

const createMany = async (notifications) => {
    return await prisma.notification.createMany({
        data: notifications,
    });
};

const findByUserId = async (userId, { page = 1, limit = 20, unreadOnly = false } = {}) => {
    const where = { userId };
    if (unreadOnly) {
        where.isRead = false;
    }

    const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.notification.count({ where }),
    ]);

    return {
        notifications,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
};

const countUnread = async (userId) => {
    return await prisma.notification.count({
        where: { userId, isRead: false },
    });
};

const markAsRead = async (id, userId) => {
    return await prisma.notification.updateMany({
        where: { id, userId },
        data: { isRead: true },
    });
};

const markAllAsRead = async (userId) => {
    return await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
    });
};

const deleteById = async (id, userId) => {
    return await prisma.notification.deleteMany({
        where: { id, userId },
    });
};

const deleteAllRead = async (userId) => {
    return await prisma.notification.deleteMany({
        where: { userId, isRead: true },
    });
};

module.exports = {
    create,
    createMany,
    findByUserId,
    countUnread,
    markAsRead,
    markAllAsRead,
    deleteById,
    deleteAllRead,
};
