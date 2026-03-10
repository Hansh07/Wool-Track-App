const dotenv = require('dotenv');
dotenv.config();

const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

connectDB();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// ─── Socket.io Real-time IoT ────────────────────────────────────────────────
const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:5173',
    process.env.CLIENT_URL_ALT || '',
    process.env.PROD_CLIENT_URL || '',
].filter(Boolean);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
    },
    pingTimeout: 60000,
});

// Attach io to app so controllers can emit events
app.set('io', io);

io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    socket.on('join_monitoring', (data) => {
        const room = `monitoring_${data.organizationId || 'default'}`;
        socket.join(room);
        logger.info(`Socket ${socket.id} joined room: ${room}`);
    });

    socket.on('join_auction', (auctionId) => {
        socket.join(`auction_${auctionId}`);
    });

    socket.on('leave_auction', (auctionId) => {
        socket.leave(`auction_${auctionId}`);
    });

    socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id}`);
    });
});

// Broadcast live IoT sensor data every 5 seconds
setInterval(() => {
    const sensorData = generateMockSensorData();
    io.to('monitoring_default').emit('sensor_update', sensorData);
}, 5000);

function generateMockSensorData() {
    return {
        timestamp: new Date().toISOString(),
        temperature: (20 + Math.random() * 15).toFixed(1),
        humidity: (40 + Math.random() * 30).toFixed(1),
        machines: [
            { id: 'SCR-A', name: 'Scouring Line A', status: 'Running', health: (95 + Math.random() * 5).toFixed(0), throughput: (850 + Math.random() * 100).toFixed(0) },
            { id: 'CAR-1', name: 'Carding Unit 1', status: Math.random() > 0.1 ? 'Running' : 'Maintenance', health: (88 + Math.random() * 10).toFixed(0), throughput: (720 + Math.random() * 80).toFixed(0) },
            { id: 'CAR-2', name: 'Carding Unit 2', status: 'Running', health: (90 + Math.random() * 8).toFixed(0), throughput: (700 + Math.random() * 90).toFixed(0) },
            { id: 'SPN-1', name: 'Spinning Frame 1', status: 'Running', health: (92 + Math.random() * 6).toFixed(0), throughput: (1100 + Math.random() * 150).toFixed(0) },
            { id: 'SPN-2', name: 'Spinning Frame 2', status: Math.random() > 0.05 ? 'Running' : 'Alert', health: (85 + Math.random() * 12).toFixed(0), throughput: (980 + Math.random() * 120).toFixed(0) },
        ],
        alerts: Math.random() > 0.85 ? [{ type: 'warning', message: 'Humidity spike detected in Zone B', time: new Date().toISOString() }] : [],
    };
}

server.listen(PORT, () => {
    logger.info(`🚀 Wool Monitor Enterprise Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    logger.info(`📡 Socket.io real-time IoT monitoring active`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});

process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`, err);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${reason}`);
    process.exit(1);
});
