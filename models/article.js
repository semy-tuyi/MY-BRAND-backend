const mongoose = require('mongoose');

const article = mongoose.Schema({  
    title:{
        type:String,
        required: true 
    },
    authorName:{
        type:String,
        required: true
    },
    content: {
        type:String,
        required:true
    },
    comments:[{
        name:String,
        today:String,
        comment:String,
    }],
    photo:String,
    likes:Number,
    createdAt:String,

});

module.exports = mongoose.model("article", article);