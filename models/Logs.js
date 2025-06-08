// models/Log.js
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    level: { type: String, enum: ['INFO', 'WARN', 'ERROR'], required: true },
    service: { type: String, enum: ['auth', 'payments', 'notifications'], required: true },
    message: { type: String, required: true },
});

module.exports = mongoose.model('Logs', logSchema);
