const authService = require('./auth.service');

const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { user, accessToken, refreshToken } = await authService.login(req.body);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            success: true,
            data: {
                user,
                accessToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken || req.body.refreshToken;
        const { accessToken, refreshToken: newRefreshToken } = await authService.refreshAccessToken(token);

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            data: {
                accessToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res) => {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
        // Ideally call service to remove from DB, but for now just clear cookie
        // await authService.logout(refreshToken); 
        // We haven't implemented logout in service explicitly to delete db record, 
        // but we can add it later. For now, client-side logout is main focus + cookie clear.
    }

    res.clearCookie('refreshToken');
    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
};

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await authService.forgotPassword(email);
        res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        const result = await authService.resetPassword(token, newPassword);
        res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword,
};
