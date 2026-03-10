const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const WoolBatch = require('../models/WoolBatch');
const QualityReport = require('../models/QualityReport');
const connectDB = require('../config/db');

dotenv.config({ path: '../../.env' }); // Adjusted path if run from src/seed, but typically we run from root. 
// Let's assume we run 'node src/seed/seedUsers.js' from server root.

// If run from server root, path is just .env
dotenv.config();

connectDB();

const seedUsers = async () => {
    try {
        await User.deleteMany();
        await WoolBatch.deleteMany();

        const users = [
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                role: 'ADMIN',
            },
            {
                name: 'Farmer John',
                email: 'farmer@example.com',
                password: 'password123',
                role: 'FARMER',
            },
            {
                name: 'Mill Operator',
                email: 'operator@example.com',
                password: 'password123',
                role: 'MILL_OPERATOR',
            },
            {
                name: 'Quality Inspector',
                email: 'inspector@example.com',
                password: 'password123',
                role: 'QUALITY_INSPECTOR',
            },
            {
                name: 'Wool Buyer',
                email: 'buyer@example.com',
                password: 'password123',
                role: 'BUYER',
            },
        ];

        const createdUsers = await User.create(users);

        console.log('Users Seeded!');

        // Create a sample batch
        const operator = createdUsers.find(u => u.role === 'MILL_OPERATOR');
        const farmer = createdUsers.find(u => u.role === 'FARMER');

        const batches = [
            {
                creator: farmer._id, // Assume farmer created it or operator created it
                woolType: 'Merino',
                weight: 500,
                moisture: 12,
                source: 'Highland Farm',
                currentStage: 'Featured',
                qualityStatus: 'Approved',
                processingLogs: [{
                    stage: 'Received',
                    note: 'Initial delivery from Highland Farm',
                    operator: operator._id
                }]
            },
            {
                creator: operator._id,
                woolType: 'Corriedale',
                weight: 350,
                moisture: 14,
                source: 'Valley Coop',
                currentStage: 'Cleaning',
                qualityStatus: 'Pending',
                processingLogs: [{
                    stage: 'Received',
                    note: 'Delivered',
                    operator: operator._id
                }, {
                    stage: 'Cleaning',
                    note: 'Scouring started',
                    operator: operator._id
                }]
            }
        ];

        const createdBatches = await WoolBatch.create(batches);

        // Create a quality report for the first batch (which is Approved)
        const report = await QualityReport.create({
            batch: createdBatches[0]._id,
            inspector: createdUsers.find(u => u.role === 'QUALITY_INSPECTOR')._id,
            fiberDiameter: 18.5,
            tensileStrength: 45,
            colorGrade: 'A',
            cleanWoolYield: 75,
            notes: 'Excellent quality Merino wool.',
            decision: 'Approved'
        });

        // Link report to batch
        createdBatches[0].qualityReport = report._id;
        createdBatches[0].farmerId = farmer._id; // Explicitly set farmerId for testing
        await createdBatches[0].save();

        console.log('Batches & Quality Reports Seeded!');

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedUsers();
