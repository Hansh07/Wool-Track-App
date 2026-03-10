const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
    try {
        const options = {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
            retryWrites: true,
        };

        const conn = await mongoose.connect(process.env.MONGO_URI, options);
        logger.info(`MongoDB Atlas Connected: ${conn.connection.host}`);

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected. Attempting to reconnect...');
        });
        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected successfully');
        });
        mongoose.connection.on('error', (err) => {
            logger.error(`MongoDB connection error: ${err.message}`);
        });

    } catch (error) {
        logger.error(`MongoDB Atlas Connection Failed: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
