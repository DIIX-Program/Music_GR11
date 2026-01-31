const playlistsRepository = require('./playlists.repository');

const createPlaylist = async (userId, data) => {
    return await playlistsRepository.createPlaylist({
        ...data,
        userId,
    });
};

const getPlaylists = async (userId) => {
    return await playlistsRepository.getPlaylists(userId);
};

const getPlaylistById = async (id, userId) => {
    const playlist = await playlistsRepository.getPlaylistById(id);
    if (!playlist) {
        throw { statusCode: 404, message: 'Playlist not found' };
    }

    if (!playlist.isPublic && playlist.userId !== userId) {
        throw { statusCode: 403, message: 'Access denied' };
    }

    return playlist;
};

const updatePlaylist = async (id, userId, data) => {
    const playlist = await playlistsRepository.getPlaylistById(id);
    if (!playlist) throw { statusCode: 404, message: 'Playlist not found' };
    if (playlist.userId !== userId) throw { statusCode: 403, message: 'Access denied' };

    return await playlistsRepository.updatePlaylist(id, data);
};

const deletePlaylist = async (id, userId) => {
    const playlist = await playlistsRepository.getPlaylistById(id);
    if (!playlist) throw { statusCode: 404, message: 'Playlist not found' };
    if (playlist.userId !== userId) throw { statusCode: 403, message: 'Access denied' };

    return await playlistsRepository.deletePlaylist(id);
};

const addTrackToPlaylist = async (playlistId, trackId, userId) => {
    const playlist = await playlistsRepository.getPlaylistById(playlistId);
    if (!playlist) throw { statusCode: 404, message: 'Playlist not found' };
    if (playlist.userId !== userId) throw { statusCode: 403, message: 'Access denied' };

    return await playlistsRepository.addTrack(playlistId, trackId);
};

const removeTrackFromPlaylist = async (playlistId, trackId, userId) => {
    const playlist = await playlistsRepository.getPlaylistById(playlistId);
    if (!playlist) throw { statusCode: 404, message: 'Playlist not found' };
    if (playlist.userId !== userId) throw { statusCode: 403, message: 'Access denied' };

    return await playlistsRepository.removeTrack(playlistId, trackId);
};

module.exports = {
    createPlaylist,
    getPlaylists,
    getPlaylistById,
    updatePlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
};
