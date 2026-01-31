const prisma = require('../../utils/prisma');

const findByUserId = async (userId, { page = 1, limit = 20 } = {}) => {
    const [favorites, total] = await Promise.all([
        prisma.favorite.findMany({
            where: { userId },
            include: {
                track: {
                    include: {
                        genre: true,
                        artist: {
                            include: { user: { select: { username: true } } }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.favorite.count({ where: { userId } }),
    ]);

    return {
        favorites: favorites.map(f => ({
            ...f.track,
            favoritedAt: f.createdAt,
        })),
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
};

const findOne = async (userId, trackId) => {
    return await prisma.favorite.findUnique({
        where: {
            userId_trackId: { userId, trackId }
        }
    });
};

const add = async (userId, trackId) => {
    return await prisma.favorite.create({
        data: { userId, trackId },
    });
};

const remove = async (userId, trackId) => {
    return await prisma.favorite.delete({
        where: {
            userId_trackId: { userId, trackId }
        }
    });
};

const count = async (userId) => {
    return await prisma.favorite.count({
        where: { userId }
    });
};

const isTrackFavorited = async (userId, trackId) => {
    const fav = await findOne(userId, trackId);
    return !!fav;
};

module.exports = {
    findByUserId,
    findOne,
    add,
    remove,
    count,
    isTrackFavorited,
};
