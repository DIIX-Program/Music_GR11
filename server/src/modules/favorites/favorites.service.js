const favoritesRepository = require('./favorites.repository');
const notificationsService = require('../notifications/notifications.service');
const prisma = require('../../utils/prisma');

const getUserFavorites = async (userId, options) => {
    return await favoritesRepository.findByUserId(userId, options);
};

const addFavorite = async (userId, trackId) => {
    // Check if track exists
    const track = await prisma.track.findUnique({ where: { id: trackId } });
    if (!track) {
        throw { statusCode: 404, message: 'Track not found' };
    }

    // Check if already favorited
    const existing = await favoritesRepository.findOne(userId, trackId);
    if (existing) {
        throw { statusCode: 400, message: 'Track already in favorites' };
    }

    const favorite = await favoritesRepository.add(userId, trackId);

    // Trigger notification to artist
    try {
        await notificationsService.notifyLike(trackId, userId);
    } catch (err) {
        console.error('Failed to send like notification:', err);
    }

    return favorite;
};

const removeFavorite = async (userId, trackId) => {
    const existing = await favoritesRepository.findOne(userId, trackId);
    if (!existing) {
        throw { statusCode: 404, message: 'Track not in favorites' };
    }

    return await favoritesRepository.remove(userId, trackId);
};

const checkFavorite = async (userId, trackId) => {
    return await favoritesRepository.isTrackFavorited(userId, trackId);
};

const getFavoriteCount = async (userId) => {
    return await favoritesRepository.count(userId);
};

module.exports = {
    getUserFavorites,
    addFavorite,
    removeFavorite,
    checkFavorite,
    getFavoriteCount,
};
