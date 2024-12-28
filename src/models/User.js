const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    score: {
        type: Number,
        min: 0,
    },
    admin: {
        type: Boolean,
    },
    completedSkills: {
        type: [String]
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;