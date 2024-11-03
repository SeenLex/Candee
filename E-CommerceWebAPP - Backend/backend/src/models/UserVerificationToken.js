const mongoose = require('mongoose');

const userVerificationTokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
});

const UserVerificationToken = mongoose.model("userVerificationToken", userVerificationTokenSchema);
module.exports = UserVerificationToken;