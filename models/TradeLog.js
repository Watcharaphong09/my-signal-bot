const mongoose = require('mongoose');

const tradeLogSchema = new mongoose.Schema({
    tradeId: {
        type: String,
        required: true,
        unique: true
    },
    signalType: {
        type: String,
        enum: ['Scalping', 'Run'],
        required: true,
        default: 'Scalping'
    },
    messageId: {
        type: String,
        required: true,
        unique: true
    },
    providerId: {
        type: String,
        required: true,
        default: 'unknown'
    },
    providerName: {
        type: String,
        default: 'Unknown'
    },
    asset: {
        type: String,
        required: true
    },
    action: {
        type: String,
        enum: ['BUY', 'SELL'],
        required: true
    },
    entry: {
        type: Number
    },
    sl: {
        type: Number
    },
    tp1: {
        type: Number
    },
    tp2: {
        type: Number
    },
    fullTp: {
        type: Number
    },
    status: {
        type: String,
        default: 'ON GOING'
    },
    points: {
        type: Number,
        default: 0
    },
    rr: {
        type: Number,
        default: 0
    },
    isClosed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TradeLog', tradeLogSchema);
