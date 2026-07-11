const mongoose = require('mongoose');

const tradeLogSchema = new mongoose.Schema({
    messageId: {
        type: String,
        required: true,
        unique: true
    },
    asset: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'TP1', 'TP2', 'Full TP', 'SL', 'BE']
    },
    points: {
        type: Number,
        default: 0
    },
    rr: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TradeLog', tradeLogSchema);
