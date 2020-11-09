const { string } = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        min: 3,
        max: 50
    },
    email:{
        type: String,
        required: true,
        min: 6,
        max: 100
    },
    password:{
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    date: {
        type: Date,
        default: Date.now
    },
    signin_flag:{
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('User', userSchema);