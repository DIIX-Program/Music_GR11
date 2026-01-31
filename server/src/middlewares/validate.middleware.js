const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json({
            success: false,
            message: errorMessage,
            code: 'VALIDATION_ERROR',
        });
    }

    return next();
};

module.exports = validate;
