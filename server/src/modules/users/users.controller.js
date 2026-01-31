const usersService = require('./users.service');

const getMe = async (req, res, next) => {
    try {
        const user = await usersService.getUserById(req.user.id);
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

const updateMe = async (req, res, next) => {
    try {
        // Basic validation could be added via middleware
        const updatedUser = await usersService.updateUser(req.user.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Profile updated',
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMe,
    updateMe,
};
