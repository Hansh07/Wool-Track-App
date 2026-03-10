const mongoose = require('mongoose');
const WoolBatch = require('./src/models/WoolBatch');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to DB');
        const batches = await WoolBatch.find().sort({ createdAt: -1 }).limit(5);
        console.log('--- RECENT BATCHES ---');
        batches.forEach(b => {
            console.log(`ID: ${b.batchId}, Images:`, b.images);
        });
        process.exit();
    })
    .catch(err => console.log(err));
