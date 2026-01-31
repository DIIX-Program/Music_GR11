const prisma = require('../../utils/prisma');

const createUser = async (data) => {
    return await prisma.user.create({
        data,
    });
};

const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: { email },
    });
};

const findUserByUsername = async (username) => {
    return await prisma.user.findUnique({
        where: { username },
    });
};

const findUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id },
    });
};

const createRefreshToken = async (data) => {
    return await prisma.refreshToken.create({
        data,
    });
};

const findRefreshToken = async (token) => {
    return await prisma.refreshToken.findUnique({
        where: { token },
        include: { user: true },
    });
};

const deleteRefreshToken = async (token) => {
    return await prisma.refreshToken.delete({
        where: { token },
    });
};

const revokeRefreshTokens = async (userId) => {
    return await prisma.refreshToken.deleteMany({
        where: { userId },
    });
};

const updateUserPassword = async (userId, newPassword) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { password: newPassword },
    });
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserByUsername,
    findUserById,
    createRefreshToken,
    findRefreshToken,
    deleteRefreshToken,
    revokeRefreshTokens,
    updateUserPassword,
};
