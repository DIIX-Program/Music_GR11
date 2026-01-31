const playlistsService = require('./playlists.service');

const createPlaylist = async (req, res, next) => {
    try {
        const playlist = await playlistsService.createPlaylist(req.user.id, req.body);
        res.status(201).json({ success: true, data: playlist });
    } catch (error) {
        next(error);
    }
};

const getPlaylists = async (req, res, next) => {
    try {
        const userId = req.user ? req.user.id : null;
        const playlists = await playlistsService.getPlaylists(userId);
        res.status(200).json({ success: true, data: playlists });
    } catch (error) {
        next(error);
    }
};

const getPlaylistById = async (req, res, next) => {
    try {
        const userId = req.user ? req.user.id : null;
        const playlist = await playlistsService.getPlaylistById(parseInt(req.params.id), userId);
        res.status(200).json({ success: true, data: playlist });
    } catch (error) {
        next(error);
    }
};

const updatePlaylist = async (req, res, next) => {
    try {
        const playlist = await playlistsService.updatePlaylist(parseInt(req.params.id), req.user.id, req.body);
        res.status(200).json({ success: true, data: playlist });
    } catch (error) {
        next(error);
    }
};

const deletePlaylist = async (req, res, next) => {
    try {
        await playlistsService.deletePlaylist(parseInt(req.params.id), req.user.id);
        res.status(200).json({ success: true, message: 'Playlist deleted' });
    } catch (error) {
        next(error);
    }
};

const addTrack = async (req, res, next) => {
    try {
        await playlistsService.addTrackToPlaylist(parseInt(req.params.id), parseInt(req.body.trackId), req.user.id);
        res.status(200).json({ success: true, message: 'Track added' });
    } catch (error) {
        next(error);
    }
};

const removeTrack = async (req, res, next) => {
    try {
        await playlistsService.removeTrackFromPlaylist(parseInt(req.params.id), parseInt(req.params.trackId), req.user.id);
        res.status(200).json({ success: true, message: 'Track removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPlaylist,
    getPlaylists,
    getPlaylistById,
    updatePlaylist,
    deletePlaylist,
    addTrack,
    removeTrack,
};
