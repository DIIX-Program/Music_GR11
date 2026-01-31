/**
 * Simple in-memory rate limiter middleware
 * For production, use a Redis-based solution like 'rate-limiter-flexible'
 */

const rateLimitStore = new Map();

const rateLimit = (options = {}) => {
    const {
        windowMs = 60 * 1000, // 1 minute
        max = 100, // Max requests per window
        message = 'Too many requests, please try again later.',
    } = options;

    return (req, res, next) => {
        const key = req.ip || req.connection.remoteAddress;
        const now = Date.now();

        if (!rateLimitStore.has(key)) {
            rateLimitStore.set(key, { count: 1, startTime: now });
            return next();
        }

        const record = rateLimitStore.get(key);

        // Reset if window has passed
        if (now - record.startTime > windowMs) {
            rateLimitStore.set(key, { count: 1, startTime: now });
            return next();
        }

        // Increment count
        record.count++;

        if (record.count > max) {
            return res.status(429).json({
                success: false,
                message,
                code: 'RATE_LIMITED',
            });
        }

        next();
    };
};

// Cleanup old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
        if (now - record.startTime > 5 * 60 * 1000) { // 5 minutes
            rateLimitStore.delete(key);
        }
    }
}, 60 * 1000); // Every minute

module.exports = rateLimit;
