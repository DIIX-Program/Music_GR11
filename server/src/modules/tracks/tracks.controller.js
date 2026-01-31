const tracksService = require('./tracks.service');
const fs = require('fs');
const path = require('path');

const uploadTrack = async (req, res, next) => {
    try {
        if (!req.files || !req.files.trackFile) {
            throw { statusCode: 400, message: 'No track file uploaded' };
        }

        const trackFile = req.files.trackFile[0];
        const coverImage = req.files.coverImage ? req.files.coverImage[0] : null;

        const data = {
            title: req.body.title,
            artist: req.body.artist,
            composer: req.body.composer,
            album: req.body.album,
            genreId: parseInt(req.body.genreId),
            duration: parseInt(req.body.duration) || 0,
            filePath: trackFile.path,
            coverImage: coverImage ? coverImage.path : null,
        };

        const track = await tracksService.createTrack(data);

        res.status(201).json({
            success: true,
            data: track,
        });
    } catch (error) {
        // Cleanup files if error
        if (req.files) {
            if (req.files.trackFile) fs.unlinkSync(req.files.trackFile[0].path);
            if (req.files.coverImage) fs.unlinkSync(req.files.coverImage[0].path);
        }
        next(error);
    }
};

const getTracks = async (req, res, next) => {
    try {
        const tracks = await tracksService.getAllTracks();
        res.status(200).json({
            success: true,
            data: tracks,
        });
    } catch (error) {
        next(error);
    }
};

const streamTrack = async (req, res, next) => {
    try {
        const trackId = parseInt(req.params.id);
        const track = await tracksService.getTrackById(trackId);
        const filePath = track.filePath;

        if (!fs.existsSync(filePath)) {
            return res.status(404).send('File not found');
        }

        // Record the play for analytics
        await tracksService.recordPlay(trackId, req.user?.id || null);

        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(filePath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'audio/mpeg', // Assuming mp3 for simplicity, can derive from ext
            };
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'audio/mpeg',
            };
            res.writeHead(200, head);
            fs.createReadStream(filePath).pipe(res);
        }
    } catch (error) {
        next(error);
    }
};

const deleteTrack = async (req, res, next) => {
    try {
        await tracksService.deleteTrack(parseInt(req.params.id));
        res.status(200).json({
            success: true,
            message: 'Track deleted',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    uploadTrack,
    getTracks,
    streamTrack,
    deleteTrack
};
