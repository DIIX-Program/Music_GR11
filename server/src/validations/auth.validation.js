const Joi = require('joi');

const register = Joi.object({
    username: Joi.string().required().min(3).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
});

const login = Joi.object({
    email: Joi.string().email(),
    username: Joi.string(),
    password: Joi.string().required(),
}).xor('email', 'username');

const refreshToken = Joi.object({
    refreshToken: Joi.string().required(),
});

module.exports = {
    register,
    login,
    refreshToken,
};
