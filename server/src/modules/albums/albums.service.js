const albumsRepository = require('./albums.repository');
const prisma = require('../../utils/prisma');

const getAllAlbums = async (options) => {
    return await albumsRepository.findAll(options);
};

const getAlbumById = async (id) => {
    const album = await albumsRepository.findById(id);
    if (!album) {
        throw { statusCode: 404, message: 'Album not found' };
    }
    return album;
};

const getArtistAlbums = async (userId) => {
    const artist = await prisma.artist.findUnique({ where: { userId } });
    if (!artist) {
        throw { statusCode: 404, message: 'Artist profile not found' };
    }
    return await albumsRepository.findByArtistId(artist.id);
};

const createAlbum = async (userId, data) => {
    const artist = await prisma.artist.findUnique({ where: { userId } });
    if (!artist) {
        throw { statusCode: 404, message: 'Artist profile not found' };
    }

    return await albumsRepository.create({
        ...data,
        artistId: artist.id,
    });
};

const updateAlbum = async (userId, albumId, data) => {
    const artist = await prisma.artist.findUnique({ where: { userId } });
    if (!artist) {
        throw { statusCode: 404, message: 'Artist profile not found' };
    }

    const album = await albumsRepository.findById(albumId);
    if (!album) {
        throw { statusCode: 404, message: 'Album not found' };
    }

    if (album.artistId !== artist.id) {
        throw { statusCode: 403, message: 'Not authorized to edit this album' };
    }

    return await albumsRepository.update(albumId, data);
};

const deleteAlbum = async (userId, albumId) => {
    const artist = await prisma.artist.findUnique({ where: { userId } });
    if (!artist) {
        throw { statusCode: 404, message: 'Artist profile not found' };
    }

    const album = await albumsRepository.findById(albumId);
    if (!album) {
        throw { statusCode: 404, message: 'Album not found' };
    }

    if (album.artistId !== artist.id) {
        throw { statusCode: 403, message: 'Not authorized to delete this album' };
    }

    // Unlink tracks from album first (don't delete them)
    await prisma.track.updateMany({
        where: { albumId },
        data: { albumId: null }
    });

    return await albumsRepository.remove(albumId);
};

const addTrackToAlbum = async (userId, albumId, trackId) => {
    const artist = await prisma.artist.findUnique({ where: { userId } });
    if (!artist) {
        throw { statusCode: 404, message: 'Artist profile not found' };
    }

    const album = await albumsRepository.findById(albumId);
    if (!album || album.artistId !== artist.id) {
        throw { statusCode: 403, message: 'Not authorized to modify this album' };
    }

    const track = await prisma.track.findUnique({ where: { id: trackId } });
    if (!track || track.artistId !== artist.id) {
        throw { statusCode: 403, message: 'Track not found or not owned by you' };
    }

    return await albumsRepository.addTrackToAlbum(albumId, trackId);
};

const removeTrackFromAlbum = async (userId, albumId, trackId) => {
    const artist = await prisma.artist.findUnique({ where: { userId } });
    if (!artist) {
        throw { statusCode: 404, message: 'Artist profile not found' };
    }

    const album = await albumsRepository.findById(albumId);
    if (!album || album.artistId !== artist.id) {
        throw { statusCode: 403, message: 'Not authorized to modify this album' };
    }

    const track = await prisma.track.findUnique({ where: { id: trackId } });
    if (!track || track.albumId !== albumId) {
        throw { statusCode: 400, message: 'Track is not in this album' };
    }

    return await albumsRepository.removeTrackFromAlbum(trackId);
};

module.exports = {
    getAllAlbums,
    getAlbumById,
    getArtistAlbums,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    addTrackToAlbum,
    removeTrackFromAlbum,
};
