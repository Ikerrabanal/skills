const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
    icon: {
        type: String,
        required: false,
        validate: {
            validator: function (value) {
                // Comprobar que es url
                return !value || /^(http|https):\/\/[^ "]+$/.test(value);
            },
            message: 'Debe ser una URL válida',
        },
    },
    set: {
        type: String,
        trim: true,
    },
    tasks: {
        type: [String],
    },
    resources: {
        type: [String],
    },
    description: {
        type: String,
        trim: true,
    },
    score: {
        type: Number,
        default: 1,
        min: 0,
    },
}, { timestamps: true }); // timestamps añade createdAt y updatedAt automáticamente

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
