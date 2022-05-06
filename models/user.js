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

function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        passowrd: Joi.string().min(5).max(1024).required()
    };
    return Joi.valid(user, schema);
}

module.exports = mongoose.model('user', user);
exports.validate = validateUser;