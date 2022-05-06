const {articleSchema, updateArticleSchema} = require('../helpers/validation_schema');
const Article = require('../models/article');

let today = new Date();
let dd = String(today.getDate()).padStart(2, "0");
let mm = String(today.getMonth() + 1).padStart(2, "0");
let yyyy = today.getFullYear();

today = `${dd} / ${mm} / ${yyyy}`;



exports.createNewArticle = async (req, res) => {
    try{
        const validationResult = await articleSchema.validateAsync(req.body);
        
        if(req.user.role.toString() === 'admin'){
            const article = new Article({
                title:validationResult.title,
                authorName:validationResult.authorName,
                content:validationResult.content,
                createdAt:today
            })
            article.save()
            .then(result => {
                res.status(200).json(result)
            })
            .catch(error => res.json({message:error.message}))
        }else{
            res.status(401).json({message:'User not Authorized'})
        }
    }catch(error){
        //res.json(error.details[0].message).status(422)
        res.status(400).json({error:error.message});
    }
};
exports.getAllArticles = (req, res) => {
    Article.find()
    .then(result => {
        res.status(200).json(result)
    })
};
exports.getOneArticle = (req, res) => {
    const {id} = req.params;
    Article.findOne({_id:id})
    .then(result => {
        if(result){res.json(result)}
        else{res.status(404).json({message:"article doesn't exist"})}

    })
    .catch(error => res.status(404).json({error:error.message}))
}

exports.updateArticle = async (req, res) => {
    const {id} = req.params
    const {title, authorName, content} = req.body;

    try{
        const validationResult = await updateArticleSchema.validateAsync({title,authorName,content});
        
        if(req.user.role.toString() === 'admin'){
            
            Article.findOne({_id:id})
            .then(article =>{
                if(validationResult.title) article.title = validationResult.title;
                if(validationResult.authorName) article.authorName = validationResult.authorName;
                if(validationResult.content) article.content = validationResult.content;

                article.save()
                .then(result => res.json(result).status(200))
                .catch(error => res.json({error:error.message}))
            })
            .catch(error => {
                res.status(404).json({error:"article doesn't exist!"})
            })
        }else{
            res.status(401).json({message: 'User Not Authorized'})
        }
    }catch(error){
        res.json(error)
    }
};

exports.deleteArticle = (req, res) =>{
    const {id} = req.params
    if(req.user.role.toString() === 'admin'){
        Article.deleteOne({_id:id})
        .then(result => {
            res.json({message:"article deleted successfully"})
        })
        .catch(error => {
            res.status(404).json({error:"article doesn't exist!"})
        })
    }else{
        res.status(401).json({message:'User not authorized'})
    }
}

exports.commentingOnArticle = (req, res) =>{
    const {comment} = req.body
    const article_id = req.params.id;
    const user_id = req.user.id;
    Article.findOne({_id:article_id})
    .then(article => {
        if(article){
            article.comments.push({
                user_id,
                comment,
                createdAt:today 
            });
            article.save()
            .then(result => res.json(result))
            .catch(error => res.json({error:error.message}))
        }else{ res.status(404).json({error:"article doesn't exist"})}
    })
    .catch(error => res.json({error:error.message}))
}

exports.fetchComments = (req, res) => {
    const {id} = req.params
    
    Article.findOne({_id:id})
    .then(result => {
        res.json(result.comments)
    })
    .catch(error => {
        res.status(404).json({error:"article doesn't exist!"})
    })

}