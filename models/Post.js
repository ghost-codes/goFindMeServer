const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    imgs: {
        type: Array,

    },
    desc: {
        type: String,
        max: 500
    },
    contributions: {
        type: Array,
        default: [],
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
    }
})

module.exports = mongoose.model("Post", PostSchema);