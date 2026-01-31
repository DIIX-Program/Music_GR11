const prisma = require('../../utils/prisma');

// User Management
const getAllUsers = async ({ page = 1, limit = 20, role = null, search = '' } = {}) => {
    const where = {};
    if (role) where.role = role;
    if (search) {
        where.OR = [
            { username: { contains: search } },
            { email: { contains: search } }
        ];
    }

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
                avatar: true,
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.user.count({ where }),
    ]);

    return { users, total, page, totalPages: Math.ceil(total / limit) };
};

const updateUser = async (userId, data) => {
    return await prisma.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            isActive: true,
        }
    });
};

const toggleUserActive = async (userId, isActive) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { isActive },
    });
};

// Verification Requests
const getVerificationRequests = async ({ page = 1, limit = 20, status = null } = {}) => {
    const where = status ? { status } : {};

    const [requests, total] = await Promise.all([
        prisma.verificationRequest.findMany({
            where,
            include: {
                artist: {
                    include: {
                        user: { select: { id: true, username: true, email: true, avatar: true } }
                    }
                }
            },
            orderBy: { submittedAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.verificationRequest.count({ where }),
    ]);

    return { requests, total, page, totalPages: Math.ceil(total / limit) };
};

const approveVerification = async (requestId, adminId) => {
    return await prisma.$transaction(async (tx) => {
        const request = await tx.verificationRequest.update({
            where: { id: requestId },
            data: {
                status: 'APPROVED',
                reviewedAt: new Date(),
                reviewedBy: adminId,
            },
            include: { artist: true }
        });

        await tx.artist.update({
            where: { id: request.artistId },
            data: { verified: true }
        });

        return request;
    });
};

const rejectVerification = async (requestId, adminId, notes) => {
    return await prisma.verificationRequest.update({
        where: { id: requestId },
        data: {
            status: 'REJECTED',
            reviewedAt: new Date(),
            reviewedBy: adminId,
            notes,
        }
    });
};

// Analytics
const getStats = async () => {
    const [userCount, artistCount, trackCount, playlistCount, listenCount] = await Promise.all([
        prisma.user.count(),
        prisma.artist.count({ where: { verified: true } }),
        prisma.track.count(),
        prisma.playlist.count(),
        prisma.listen.count(),
    ]);

    return {
        users: userCount,
        artists: artistCount,
        tracks: trackCount,
        playlists: playlistCount,
        listens: listenCount,
    };
};

const getDailyPlays = async (days = 7) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const plays = await prisma.listen.groupBy({
        by: ['playedAt'],
        where: {
            playedAt: { gte: startDate }
        },
        _count: { id: true }
    });

    // Aggregate by date
    const dailyMap = {};
    plays.forEach(p => {
        const dateKey = p.playedAt.toISOString().split('T')[0];
        dailyMap[dateKey] = (dailyMap[dateKey] || 0) + p._count.id;
    });

    return Object.entries(dailyMap).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date));
};

const getTopTracks = async (limit = 10) => {
    return await prisma.track.findMany({
        orderBy: { plays: 'desc' },
        take: limit,
        select: {
            id: true,
            title: true,
            artistName: true,
            plays: true,
            coverImage: true,
        }
    });
};

const getTopArtists = async (limit = 10) => {
    const artists = await prisma.artist.findMany({
        include: {
            user: { select: { username: true, avatar: true } },
            _count: { select: { tracks: true } }
        },
        orderBy: { totalPlays: 'desc' },
        take: limit,
    });

    return artists.map(a => ({
        id: a.id,
        username: a.user.username,
        avatar: a.user.avatar,
        totalPlays: Number(a.totalPlays),
        trackCount: a._count.tracks,
        verified: a.verified,
    }));
};

const getNewUsersCount = async (days = 7) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await prisma.user.count({
        where: { createdAt: { gte: startDate } }
    });
};

module.exports = {
    getAllUsers,
    updateUser,
    toggleUserActive,
    getVerificationRequests,
    approveVerification,
    rejectVerification,
    getStats,
    getDailyPlays,
    getTopTracks,
    getTopArtists,
    getNewUsersCount,
};
