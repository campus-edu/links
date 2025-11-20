const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [50, 'Title cannot be more than 50 characters']
    },
    url: {
        type: String,
        required: [true, 'Please add a URL'],
        trim: true,
        // This regex ensures the URL starts with http:// or https://
        match: [
            /^https?:\/\//,
            'Please enter a valid URL starting with http:// or https://'
        ]
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Description cannot be more than 200 characters']
    },
    dueDate: {
        type: String,
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
