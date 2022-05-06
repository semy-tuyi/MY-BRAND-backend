const mongoose = require('mongoose');

const query = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        required:true,
    },
    createdAt:String
});

module.exports = mongoose.model('query', query);