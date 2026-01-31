const tracksRepository = require('./tracks.repository');
const fs = require('fs');
const path = require('path');
// mp3-duration can be used to get duration if not provided, but for now assuming client sends it or we extract later.
// For MVP, we will require duration from client or default to 0.

const createTrack = async (trackData) => {
    return await tracksRepository.createTrack(trackData);
};

const getAllTracks = async () => {
    return await tracksRepository.getTracks();
};

const getTrackById = async (id) => {
    const track = await tracksRepository.getTrackById(id);
    if (!track) {
        throw { statusCode: 404, message: 'Track not found' };
    }
    return track;
};

const deleteTrack = async (id) => {
    // Check if exists
    const track = await getTrackById(id);

    // Delete files
    try {
        if (track.filePath && fs.existsSync(track.filePath)) {
            fs.unlinkSync(track.filePath);
        }
        if (track.coverImage && fs.existsSync(track.coverImage)) {
            fs.unlinkSync(track.coverImage);
        }
    } catch (err) {
        console.error('Error deleting files:', err);
    }

    return await tracksRepository.deleteTrack(id);
};

const recordPlay = async (trackId, userId) => {
    // Record listen for analytics
    await tracksRepository.createListen({ trackId, userId });

    // Increment play count on track
    await tracksRepository.incrementPlayCount(trackId);
};

module.exports = {
    createTrack,
    getAllTracks,
    getTrackById,
    deleteTrack,
    recordPlay,
};
