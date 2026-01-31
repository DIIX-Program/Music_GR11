const prisma = require('../../utils/prisma');

const getUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            avatar: true,
            createdAt: true,
        },
    });

    if (!user) {
        throw { statusCode: 404, message: 'User not found' };
    }

    return user;
};

const updateUser = async (id, data) => {
    // Allow updating avatar, or other public fields
    // TODO: Add proper validation logic here (e.g. dont allow updating email to existing one)

    const updatedUser = await prisma.user.update({
        where: { id },
        data,
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            avatar: true,
        },
    });

    return updatedUser;
};

module.exports = {
    getUserById,
    updateUser,
};
