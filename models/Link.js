const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    dueDate: {
        type: String, // Keeping as string for simple "Nov 24" format, can be Date if preferred
        trim: true
    },
    color: {
        type: String,
        enum: ['indigo', 'emerald', 'rose', 'amber'],
        default: 'indigo'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Link', LinkSchema);
