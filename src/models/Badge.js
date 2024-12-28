const mongoose = require('mongoose');

// Esquema para la entidad Badge
const badgeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    bitpoints_min: {
        type: Number,
        required: true,
        min: 0,
    },
    bitpoints_max: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value >= this.bitpoints_min;
            },
            message: 'bitpoints_max debe ser mayor o igual a bitpoints_min',
        },
    },
    image_url: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^(http|https):\/\/[^ "]+$/.test(value);
            },
            message: 'Debe ser una URL válida',
        },
    },
}, { timestamps: true }); //Agrega campos createdAt y updatedAt al modelo

const Badge = mongoose.model('Badge', badgeSchema);
module.exports = Badge;