const express = require('express');
const router = express.Router();
const usersController = require('./users.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');

router.get('/me', verifyToken, usersController.getMe);
router.put('/me', verifyToken, usersController.updateMe);

module.exports = router;
