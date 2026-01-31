const prisma = require('../../utils/prisma');

const createTrack = async (data) => {
    return await prisma.track.create({
        data,
    });
};

const getTracks = async (query = {}) => {
    // Can add pagination and filtering here
    return await prisma.track.findMany({
        include: { genre: true },
        orderBy: { createdAt: 'desc' },
    });
};

const getTrackById = async (id) => {
    return await prisma.track.findUnique({
        where: { id },
        include: { genre: true },
    });
};

const deleteTrack = async (id) => {
    return await prisma.track.delete({
        where: { id },
    });
};

const createListen = async (data) => {
    return await prisma.listen.create({
        data: {
            trackId: data.trackId,
            userId: data.userId,
        }
    });
};

const incrementPlayCount = async (trackId) => {
    return await prisma.track.update({
        where: { id: trackId },
        data: {
            plays: { increment: 1 }
        }
    });
};

module.exports = {
    createTrack,
    getTracks,
    getTrackById,
    deleteTrack,
    createListen,
    incrementPlayCount,
};
