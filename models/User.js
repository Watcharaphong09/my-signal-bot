const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    discordId: { type: String, required: true, unique: true },
    username: { type: String, default: 'Unknown User' },
    roleId: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    expireDate: { type: Date, required: true },
    renewCount: { type: Number, default: 1 },
    status: { type: String, default: 'active' },
    notified3Days: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);