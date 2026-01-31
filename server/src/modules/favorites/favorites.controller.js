const favoritesService = require('./favorites.service');

const getFavorites = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const result = await favoritesService.getUserFavorites(userId, { page, limit });

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const addFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const trackId = parseInt(req.params.trackId);

        await favoritesService.addFavorite(userId, trackId);

        res.status(201).json({
            success: true,
            message: 'Track added to favorites',
        });
    } catch (error) {
        next(error);
    }
};

const removeFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const trackId = parseInt(req.params.trackId);

        await favoritesService.removeFavorite(userId, trackId);

        res.status(200).json({
            success: true,
            message: 'Track removed from favorites',
        });
    } catch (error) {
        next(error);
    }
};

const checkFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const trackId = parseInt(req.params.trackId);

        const isFavorited = await favoritesService.checkFavorite(userId, trackId);

        res.status(200).json({
            success: true,
            data: { isFavorited },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getFavorites,
    addFavorite,
    removeFavorite,
    checkFavorite,
};
