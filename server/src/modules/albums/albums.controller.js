const albumsService = require('./albums.service');

const getAllAlbums = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const artistId = req.query.artistId ? parseInt(req.query.artistId) : null;

        const result = await albumsService.getAllAlbums({ page, limit, artistId });

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getAlbumById = async (req, res, next) => {
    try {
        const albumId = parseInt(req.params.id);
        const album = await albumsService.getAlbumById(albumId);

        res.status(200).json({
            success: true,
            data: album,
        });
    } catch (error) {
        next(error);
    }
};

const getMyAlbums = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const albums = await albumsService.getArtistAlbums(userId);

        res.status(200).json({
            success: true,
            data: albums,
        });
    } catch (error) {
        next(error);
    }
};

const createAlbum = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { title, coverImage, releaseDate } = req.body;

        const album = await albumsService.createAlbum(userId, {
            title,
            coverImage,
            releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
        });

        res.status(201).json({
            success: true,
            data: album,
        });
    } catch (error) {
        next(error);
    }
};

const updateAlbum = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const albumId = parseInt(req.params.id);
        const { title, coverImage, releaseDate } = req.body;

        const updateData = {};
        if (title) updateData.title = title;
        if (coverImage) updateData.coverImage = coverImage;
        if (releaseDate) updateData.releaseDate = new Date(releaseDate);

        const album = await albumsService.updateAlbum(userId, albumId, updateData);

        res.status(200).json({
            success: true,
            data: album,
        });
    } catch (error) {
        next(error);
    }
};

const deleteAlbum = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const albumId = parseInt(req.params.id);

        await albumsService.deleteAlbum(userId, albumId);

        res.status(200).json({
            success: true,
            message: 'Album deleted',
        });
    } catch (error) {
        next(error);
    }
};

const addTrackToAlbum = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const albumId = parseInt(req.params.id);
        const trackId = parseInt(req.body.trackId);

        const track = await albumsService.addTrackToAlbum(userId, albumId, trackId);

        res.status(200).json({
            success: true,
            data: track,
            message: 'Track added to album',
        });
    } catch (error) {
        next(error);
    }
};

const removeTrackFromAlbum = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const albumId = parseInt(req.params.id);
        const trackId = parseInt(req.params.trackId);

        await albumsService.removeTrackFromAlbum(userId, albumId, trackId);

        res.status(200).json({
            success: true,
            message: 'Track removed from album',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllAlbums,
    getAlbumById,
    getMyAlbums,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    addTrackToAlbum,
    removeTrackFromAlbum,
};
