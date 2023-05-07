const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true,
    },
    helper: {
        status: {
            type: String,
            required: true,
            default: 'waiting',
            enum: ['waiting', 'completed'],
        },
        star: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: false,
        },
    },
    poster: {
        status: {
            type: String,
            required: true,
            default: 'waiting',
            enum: ['waiting', 'completed'],
        },
        star: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: false,
        },
    },
    status: {
        type: String,
        required: true,
        default: 'waiting',
        enum: ['waiting', 'completed'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
