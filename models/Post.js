const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    imgs: {
        type: Array,
    },
    title: {
        type: String,
    },
    desc: {
        type: String,
        max: 500
    },
    contributions: {
        type: Array,
        default: []
    },
    privilleged: {
        type: Array,
        default: [],
    },
    status: {
        type: String,
        default: 'Not Found',
    },
    shares: {
        type: Number,
        default: 0,
    },
    last_seen: {
        location: {
            type: String,

        },
        date: {
            type: Date,

        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Post", PostSchema);