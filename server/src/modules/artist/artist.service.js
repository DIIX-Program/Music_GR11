const prisma = require('../../utils/prisma');

const getStats = async (userId) => {
    // Get artist profile
    const artist = await prisma.artist.findUnique({
        where: { userId },
        include: {
            tracks: true,
        }
    });

    if (!artist) {
        throw { statusCode: 404, message: 'Artist profile not found' };
    }

    const totalPlays = artist.tracks.reduce((sum, track) => sum + (track.plays || 0), 0);

    // Get unique listeners (from listens table)
    const uniqueListeners = await prisma.listen.groupBy({
        by: ['userId'],
        where: {
            track: {
                artistId: artist.id
            }
        }
    });

    return {
        totalPlays,
        uniqueListeners: uniqueListeners.length,
        totalTracks: artist.tracks.length,
        verified: artist.verified,
    };
};

const getMyTracks = async (userId) => {
    const artist = await prisma.artist.findUnique({
        where: { userId },
    });

    if (!artist) {
        throw { statusCode: 404, message: 'Artist profile not found' };
    }

    return await prisma.track.findMany({
        where: { artistId: artist.id },
        orderBy: { createdAt: 'desc' },
    });
};

const uploadTrack = async (userId, data) => {
    const artist = await prisma.artist.findUnique({
        where: { userId },
    });

    if (!artist) {
        throw { statusCode: 404, message: 'Artist profile not found' };
    }

    return await prisma.track.create({
        data: {
            ...data,
            artistId: artist.id,
            artistName: artist.user?.username || 'Unknown',
        }
    });
};

const updateTrack = async (userId, trackId, data) => {
    const artist = await prisma.artist.findUnique({
        where: { userId },
    });

    if (!artist) {
        throw { statusCode: 404, message: 'Artist profile not found' };
    }

    const track = await prisma.track.findUnique({
        where: { id: parseInt(trackId) },
    });

    if (!track || track.artistId !== artist.id) {
        throw { statusCode: 403, message: 'Not authorized to edit this track' };
    }

    return await prisma.track.update({
        where: { id: parseInt(trackId) },
        data,
    });
};

const deleteTrack = async (userId, trackId) => {
    const artist = await prisma.artist.findUnique({
        where: { userId },
    });

    if (!artist) {
        throw { statusCode: 404, message: 'Artist profile not found' };
    }

    const track = await prisma.track.findUnique({
        where: { id: parseInt(trackId) },
    });

    if (!track || track.artistId !== artist.id) {
        throw { statusCode: 403, message: 'Not authorized to delete this track' };
    }

    return await prisma.track.delete({
        where: { id: parseInt(trackId) },
    });
};

const getEarnings = async (userId) => {
    // Mock earnings calculation - in production, this would be based on actual play revenue
    const artist = await prisma.artist.findUnique({
        where: { userId },
        include: { tracks: true }
    });

    if (!artist) {
        throw { statusCode: 404, message: 'Artist profile not found' };
    }

    const totalPlays = artist.tracks.reduce((sum, track) => sum + (track.plays || 0), 0);
    const earningsPerPlay = 0.004; // Example rate

    return {
        total: totalPlays * earningsPerPlay,
        pending: 0, // Would be calculated based on payout schedule
        thisMonth: 0, // Would be based on this month's plays
    };
};

// ===== VERIFICATION =====

const submitVerificationRequest = async (userId, reason = null) => {
    const artist = await prisma.artist.findUnique({
        where: { userId },
    });

    if (!artist) {
        throw { statusCode: 404, message: 'Artist profile not found' };
    }

    if (artist.verified) {
        throw { statusCode: 400, message: 'Artist is already verified' };
    }

    // Check for existing pending request
    const existingRequest = await prisma.verificationRequest.findFirst({
        where: { artistId: artist.id, status: 'PENDING' }
    });

    if (existingRequest) {
        throw { statusCode: 400, message: 'You already have a pending verification request' };
    }

    return await prisma.verificationRequest.create({
        data: {
            artistId: artist.id,
            reason,
        }
    });
};

const getVerificationStatus = async (userId) => {
    const artist = await prisma.artist.findUnique({
        where: { userId },
    });

    if (!artist) {
        throw { statusCode: 404, message: 'Artist profile not found' };
    }

    // Get latest verification request
    const latestRequest = await prisma.verificationRequest.findFirst({
        where: { artistId: artist.id },
        orderBy: { submittedAt: 'desc' }
    });

    return {
        verified: artist.verified,
        latestRequest: latestRequest ? {
            status: latestRequest.status,
            submittedAt: latestRequest.submittedAt,
            reviewedAt: latestRequest.reviewedAt,
            notes: latestRequest.notes,
        } : null
    };
};

// ===== ANALYTICS =====

const getPlaysPerTrack = async (userId) => {
    const artist = await prisma.artist.findUnique({
        where: { userId },
    });

    if (!artist) {
        throw { statusCode: 404, message: 'Artist profile not found' };
    }

    return await prisma.track.findMany({
        where: { artistId: artist.id },
        select: {
            id: true,
            title: true,
            plays: true,
            coverImage: true,
            createdAt: true,
        },
        orderBy: { plays: 'desc' }
    });
};

const getFollowersCount = async (userId) => {
    const artist = await prisma.artist.findUnique({
        where: { userId },
    });

    if (!artist) {
        throw { statusCode: 404, message: 'Artist profile not found' };
    }

    // Count unique users who favorited any of the artist's tracks
    const followers = await prisma.favorite.findMany({
        where: {
            track: { artistId: artist.id }
        },
        select: { userId: true },
        distinct: ['userId']
    });

    return followers.length;
};

module.exports = {
    getStats,
    getMyTracks,
    uploadTrack,
    updateTrack,
    deleteTrack,
    getEarnings,
    submitVerificationRequest,
    getVerificationStatus,
    getPlaysPerTrack,
    getFollowersCount,
};

