const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';
        if (file.fieldname === 'trackFile') {
            uploadPath += 'tracks/';
        } else if (file.fieldname === 'coverImage') {
            uploadPath += 'covers/';
        }

        // Ensure dir exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'trackFile') {
        if (!file.mimetype.match(/^audio\/(mp3|wav|mpeg|ogg)$/)) {
            return cb(new Error('Only audio files are allowed!'), false);
        }
    }
    if (file.fieldname === 'coverImage') {
        if (!file.mimetype.match(/^image\/(jpg|jpeg|png)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: fileFilter
});

module.exports = upload;
