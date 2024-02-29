const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        //  required: true
        required: [true, "name is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"]
    },

    password: {
        type: String,
        required: [true, "password is required"]
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    isDoctor: {
        type: Boolean,
        default: false
    },

    notification: {
        type: Array,
        default: []
    },

    seennotification: {
        type: Array,
        default: []
    },


});

module.exports = mongoose.model("user", userSchema);