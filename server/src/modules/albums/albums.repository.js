const prisma = require('../../utils/prisma');

const findAll = async ({ page = 1, limit = 20, artistId = null } = {}) => {
    const where = artistId ? { artistId } : {};

    const [albums, total] = await Promise.all([
        prisma.album.findMany({
            where,
            include: {
                artist: {
                    include: { user: { select: { username: true } } }
                },
                _count: { select: { tracks: true } }
            },
            orderBy: { releaseDate: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.album.count({ where }),
    ]);

    return {
        albums: albums.map(album => ({
            ...album,
            trackCount: album._count.tracks,
            artistName: album.artist?.user?.username || 'Unknown',
        })),
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
};

const findById = async (id) => {
    return await prisma.album.findUnique({
        where: { id },
        include: {
            artist: {
                include: { user: { select: { username: true, avatar: true } } }
            },
            tracks: {
                include: { genre: true },
                orderBy: { createdAt: 'asc' }
            }
        }
    });
};

const create = async (data) => {
    return await prisma.album.create({
        data,
        include: {
            artist: {
                include: { user: { select: { username: true } } }
            }
        }
    });
};

const update = async (id, data) => {
    return await prisma.album.update({
        where: { id },
        data,
        include: {
            artist: {
                include: { user: { select: { username: true } } }
            }
        }
    });
};

const remove = async (id) => {
    return await prisma.album.delete({
        where: { id }
    });
};

const addTrackToAlbum = async (albumId, trackId) => {
    return await prisma.track.update({
        where: { id: trackId },
        data: { albumId }
    });
};

const removeTrackFromAlbum = async (trackId) => {
    return await prisma.track.update({
        where: { id: trackId },
        data: { albumId: null }
    });
};

const findByArtistId = async (artistId) => {
    return await prisma.album.findMany({
        where: { artistId },
        include: {
            _count: { select: { tracks: true } }
        },
        orderBy: { releaseDate: 'desc' }
    });
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove,
    addTrackToAlbum,
    removeTrackFromAlbum,
    findByArtistId,
};
