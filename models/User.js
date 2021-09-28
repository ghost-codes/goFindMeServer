const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    google_id: {
        type: String,
        default: '',
    },
    photo_utl: {
        type: String,
        default: '',
    },
    email: {
        type: String,
        require: true,
        unique: true,
    }
});

module.exports = mongoose.model("User", UserSchema);