const prisma = require('../../utils/prisma');

const search = async (req, res, next) => {
    try {
        const q = req.query.q || '';

        if (!q) {
            return res.status(200).json({ success: true, data: { tracks: [], playlists: [] } });
        }

        const tracks = await prisma.track.findMany({
            where: {
                OR: [
                    { title: { contains: q } }, // Prisma defaults to case-insensitive in many DBs, or use mode: 'insensitive' for Postgres
                    { artist: { contains: q } },
                    { album: { contains: q } },
                ],
            },
            take: 10,
        });

        const playlists = await prisma.playlist.findMany({
            where: {
                name: { contains: q },
                isPublic: true,
            },
            take: 10,
        });

        // For MySQL default collation usually handles case insensitivity, but be aware.

        res.status(200).json({
            success: true,
            data: {
                tracks,
                playlists,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    search,
};
