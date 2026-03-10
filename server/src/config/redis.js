const Redis = require('ioredis');
const logger = require('../utils/logger');

let redisClient = null;

const connectRedis = () => {
    try {
        const redisConfig = process.env.REDIS_URL
            ? { lazyConnect: true }
            : { lazyConnect: true };

        redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
            ...redisConfig,
            retryStrategy: (times) => {
                if (times > 3) {
                    logger.warn('Redis unavailable, falling back to in-memory cache');
                    return null; // Stop retrying
                }
                return Math.min(times * 200, 1000);
            },
            maxRetriesPerRequest: 3,
            enableReadyCheck: false,
        });

        redisClient.on('connect', () => {
            logger.info('Redis connected successfully');
        });

        redisClient.on('error', (err) => {
            logger.warn(`Redis error (non-fatal): ${err.message}`);
        });

        redisClient.on('close', () => {
            logger.warn('Redis connection closed');
        });

        return redisClient;
    } catch (error) {
        logger.warn(`Redis init failed (non-fatal): ${error.message}`);
        return null;
    }
};

// Simple in-memory fallback cache
const memoryCache = new Map();

const cache = {
    async get(key) {
        try {
            if (redisClient && redisClient.status === 'ready') {
                const val = await redisClient.get(key);
                return val ? JSON.parse(val) : null;
            }
            const item = memoryCache.get(key);
            if (!item) return null;
            if (Date.now() > item.expiry) { memoryCache.delete(key); return null; }
            return item.value;
        } catch { return null; }
    },

    async set(key, value, ttlSeconds = 300) {
        try {
            if (redisClient && redisClient.status === 'ready') {
                await redisClient.setex(key, ttlSeconds, JSON.stringify(value));
                return;
            }
            memoryCache.set(key, { value, expiry: Date.now() + ttlSeconds * 1000 });
        } catch { /* non-fatal */ }
    },

    async del(key) {
        try {
            if (redisClient && redisClient.status === 'ready') {
                await redisClient.del(key);
                return;
            }
            memoryCache.delete(key);
        } catch { /* non-fatal */ }
    },

    async flush(pattern) {
        try {
            if (redisClient && redisClient.status === 'ready') {
                const keys = await redisClient.keys(pattern);
                if (keys.length > 0) await redisClient.del(...keys);
                return;
            }
            for (const key of memoryCache.keys()) {
                if (key.includes(pattern.replace('*', ''))) memoryCache.delete(key);
            }
        } catch { /* non-fatal */ }
    }
};

connectRedis();

module.exports = { redisClient, cache };
