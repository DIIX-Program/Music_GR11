const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const validate = require('../../middlewares/validate.middleware');
const authValidation = require('../../validations/auth.validation');

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
