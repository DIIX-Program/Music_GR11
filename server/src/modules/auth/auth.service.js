const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRepository = require('./auth.repository');

const register = async (userData) => {
    const { username, email, password } = userData;

    const existingEmail = await authRepository.findUserByEmail(email);
    if (existingEmail) {
        throw { statusCode: 400, message: 'Email already exists' };
    }

    const existingUsername = await authRepository.findUserByUsername(username);
    if (existingUsername) {
        throw { statusCode: 400, message: 'Username already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await authRepository.createUser({
        username,
        email,
        password: hashedPassword,
    });

    return { id: newUser.id, username: newUser.username, email: newUser.email };
};

const login = async (credentials) => {
    const { email, username, password } = credentials;

    let user;
    if (email) {
        user = await authRepository.findUserByEmail(email);
    } else {
        user = await authRepository.findUserByUsername(username);
    }

    if (!user) {
        throw { statusCode: 401, message: 'Invalid credentials' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw { statusCode: 401, message: 'Invalid credentials' };
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token
    await authRepository.createRefreshToken({
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return {
        user: { id: user.id, username: user.username, email: user.email, role: user.role },
        accessToken,
        refreshToken,
    };
};

const refreshAccessToken = async (token) => {
    const storedToken = await authRepository.findRefreshToken(token);
    if (!storedToken) {
        throw { statusCode: 403, message: 'Invalid refresh token' };
    }

    if (storedToken.expiresAt < new Date()) {
        await authRepository.deleteRefreshToken(token);
        throw { statusCode: 403, message: 'Refresh token expired' };
    }

    try {
        jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        throw { statusCode: 403, message: 'Invalid refresh token signature' };
    }

    const accessToken = generateAccessToken(storedToken.user);
    const newRefreshToken = generateRefreshToken(storedToken.user);

    // Rotate token
    await authRepository.deleteRefreshToken(token);
    await authRepository.createRefreshToken({
        userId: storedToken.userId,
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken: newRefreshToken };
};

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
};

const generateResetToken = (userId) => {
    return jwt.sign(
        { id: userId, purpose: 'password_reset' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

const forgotPassword = async (email) => {
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
        // Don't reveal if email exists for security
        return { message: 'If that email exists, a reset link has been sent.' };
    }

    const resetToken = generateResetToken(user.id);
    // In production, send email with link: CLIENT_URL/reset-password?token=resetToken
    // For now, we'll just return the token (for testing)

    // Optional: use nodemailer in production
    // const nodemailer = require('nodemailer');
    // const transporter = nodemailer.createTransport({ ... });
    // await transporter.sendMail({ ... });

    console.log(`Password reset token for ${email}: ${resetToken}`);

    return {
        message: 'If that email exists, a reset link has been sent.',
        // Remove token from response in production
        token: resetToken
    };
};

const resetPassword = async (token, newPassword) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.purpose !== 'password_reset') {
            throw { statusCode: 400, message: 'Invalid reset token' };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await authRepository.updateUserPassword(decoded.id, hashedPassword);

        return { message: 'Password reset successfully' };
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw { statusCode: 400, message: 'Reset token has expired' };
        }
        throw { statusCode: 400, message: 'Invalid reset token' };
    }
};

module.exports = {
    register,
    login,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
};
