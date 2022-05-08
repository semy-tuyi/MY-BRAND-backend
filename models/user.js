const mongoose = require('mongoose');
const Joi = require('joi');

const user = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    } ,
    email: {
        type:String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    role: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('user', user);
