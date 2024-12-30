const mongoose = require('mongoose');
const userSkillSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
    },

    completed: {
        type: Boolean,
        default: false
    },

    completedAt: {
        type: Date,
        default: null
    },

    evidence: {
        type: String,
        default: null
    },

    verified: {
        type: Boolean,
        default: false
    },

    verifications: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        approved: {
            type: Boolean,
            default: false
        },
        verifiedAt: {
            type: Date,
            default: null
        },
    }],
});
module.exports = mongoose.model('UserSkill', userSkillSchema);