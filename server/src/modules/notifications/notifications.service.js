const notificationsRepository = require('./notifications.repository');
const prisma = require('../../utils/prisma');

// Notification Types
const NOTIFICATION_TYPES = {
    LIKE: 'LIKE',
    NEW_TRACK: 'NEW_TRACK',
    VERIFICATION_APPROVED: 'VERIFICATION_APPROVED',
    VERIFICATION_REJECTED: 'VERIFICATION_REJECTED',
    PLAYLIST_FOLLOWED: 'PLAYLIST_FOLLOWED',
    SYSTEM: 'SYSTEM',
};

const getUserNotifications = async (userId, options) => {
    return await notificationsRepository.findByUserId(userId, options);
};

const getUnreadCount = async (userId) => {
    return await notificationsRepository.countUnread(userId);
};

const markAsRead = async (id, userId) => {
    const result = await notificationsRepository.markAsRead(id, userId);
    if (result.count === 0) {
        throw { statusCode: 404, message: 'Notification not found' };
    }
    return result;
};

const markAllAsRead = async (userId) => {
    return await notificationsRepository.markAllAsRead(userId);
};

const deleteNotification = async (id, userId) => {
    const result = await notificationsRepository.deleteById(id, userId);
    if (result.count === 0) {
        throw { statusCode: 404, message: 'Notification not found' };
    }
    return result;
};

// ====== NOTIFICATION TRIGGERS ======

const notifyLike = async (trackId, likerId) => {
    const track = await prisma.track.findUnique({
        where: { id: trackId },
        include: {
            artist: {
                include: { user: true }
            }
        }
    });

    if (!track || !track.artist) return;

    const liker = await prisma.user.findUnique({ where: { id: likerId } });
    if (!liker) return;

    // Don't notify if artist likes their own track
    if (track.artist.userId === likerId) return;

    await notificationsRepository.create({
        userId: track.artist.userId,
        type: NOTIFICATION_TYPES.LIKE,
        content: `${liker.username} liked your track "${track.title}"`,
    });
};

const notifyNewTrack = async (trackId) => {
    const track = await prisma.track.findUnique({
        where: { id: trackId },
        include: {
            artist: {
                include: { user: true }
            }
        }
    });

    if (!track || !track.artist) return;

    // Find all users who have favorited any track by this artist
    const followers = await prisma.favorite.findMany({
        where: {
            track: {
                artistId: track.artistId
            }
        },
        select: { userId: true },
        distinct: ['userId'],
    });

    const uniqueUserIds = [...new Set(followers.map(f => f.userId))];

    // Filter out the artist themselves
    const userIds = uniqueUserIds.filter(id => id !== track.artist.userId);

    if (userIds.length === 0) return;

    const notifications = userIds.map(userId => ({
        userId,
        type: NOTIFICATION_TYPES.NEW_TRACK,
        content: `${track.artist.user.username} released a new track: "${track.title}"`,
    }));

    await notificationsRepository.createMany(notifications);
};

const notifyVerification = async (artistId, approved, notes = null) => {
    const artist = await prisma.artist.findUnique({
        where: { id: artistId },
        include: { user: true }
    });

    if (!artist) return;

    const type = approved ? NOTIFICATION_TYPES.VERIFICATION_APPROVED : NOTIFICATION_TYPES.VERIFICATION_REJECTED;
    const content = approved
        ? 'Congratulations! Your artist account has been verified.'
        : `Your verification request was rejected.${notes ? ` Reason: ${notes}` : ''}`;

    await notificationsRepository.create({
        userId: artist.userId,
        type,
        content,
    });
};

const notifyPlaylistFollowed = async (playlistId, followerId) => {
    const playlist = await prisma.playlist.findUnique({
        where: { id: playlistId },
        include: { user: true }
    });

    if (!playlist) return;

    const follower = await prisma.user.findUnique({ where: { id: followerId } });
    if (!follower) return;

    // Don't notify if user follows their own playlist
    if (playlist.userId === followerId) return;

    await notificationsRepository.create({
        userId: playlist.userId,
        type: NOTIFICATION_TYPES.PLAYLIST_FOLLOWED,
        content: `${follower.username} started following your playlist "${playlist.name}"`,
    });
};

const createSystemNotification = async (userId, content) => {
    return await notificationsRepository.create({
        userId,
        type: NOTIFICATION_TYPES.SYSTEM,
        content,
    });
};

module.exports = {
    NOTIFICATION_TYPES,
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    // Triggers
    notifyLike,
    notifyNewTrack,
    notifyVerification,
    notifyPlaylistFollowed,
    createSystemNotification,
};
