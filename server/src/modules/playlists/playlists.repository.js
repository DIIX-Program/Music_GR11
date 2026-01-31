const prisma = require('../../utils/prisma');

const createPlaylist = async (data) => {
    return await prisma.playlist.create({
        data,
    });
};

const getPlaylists = async (userId, includePrivate = false) => {
    const where = {
        OR: [
            { isPublic: true },
        ],
    };

    if (userId) {
        where.OR.push({ userId });
        if (!includePrivate) {
            // logic slightly complex for generic list: 
            // If I want MY playlists (which include private) + Public ones
        }
    }

    // Simplified query: Get all public playlists OR playlists owned by user
    return await prisma.playlist.findMany({
        where: {
            OR: [
                { isPublic: true },
                { userId: userId || -1 }
            ]
        },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
    });
};

const getPlaylistById = async (id) => {
    return await prisma.playlist.findUnique({
        where: { id },
        include: {
            user: true,
            tracks: {
                include: {
                    track: true
                }
            }
        },
    });
};

const updatePlaylist = async (id, data) => {
    return await prisma.playlist.update({
        where: { id },
        data,
    });
};

const deletePlaylist = async (id) => {
    return await prisma.playlist.delete({
        where: { id },
    });
};

const addTrack = async (playlistId, trackId) => {
    return await prisma.playlistTrack.create({
        data: {
            playlistId,
            trackId,
        },
    });
};

const removeTrack = async (playlistId, trackId) => {
    return await prisma.playlistTrack.deleteMany({
        where: {
            playlistId,
            trackId,
        },
    });
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
