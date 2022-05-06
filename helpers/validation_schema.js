//const {ref} = require('joi');
const joi = require('joi');

const articleSchema = joi.object({
    title:joi.string().min(5).required(),
    authorName:joi.string().min(4).required(),
    content:joi.string().min(5).required()
})

const updateArticleSchema = joi.object({
    /*article_id:joi.string().required,*/
    title:joi.string().min(10),
    authorName:joi.string().min(4),
    content:joi.string().min(10)
})

const createUserSchema = joi.object({
    name:joi.string().min(4).required(),
    email:joi.string().email().required(),
    password:joi.string().min(6).required(),
    role:joi.string().required()
    
})

const loginUserSchema = joi.object({
    email:joi.string().email().required(),
    password:joi.string().min(6).required() 
})

const querySchema = joi.object({
    name:joi.string().min(5).required(),
    email:joi.string().email().required(),
    message:joi.string().min(5).required()
});

module.exports = {
    articleSchema, updateArticleSchema, createUserSchema, loginUserSchema, querySchema
};