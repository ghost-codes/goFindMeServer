const mongoose = require('mongoose');

const ContributionSchema = new mongoose.Schema({

    location_sighted: {
        type: String,
        required: true
    },
    post_id: { type: String },
    time_sighted: { type: Date },
    date_sighted: {
        type: Date,

    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Contribution", ContributionSchema);