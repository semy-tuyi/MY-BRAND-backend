const {querySchema} = require('../helpers/validation_schema')
const Query = require('../models/query')

let today = new Date();
let dd = String(today.getDate()).padStart(2, "0");
let mm = String(today.getMonth() + 1).padStart(2, "0");
let yyyy = today.getFullYear();

today = `${dd} / ${mm} / ${yyyy}`;


exports.createQuery = async (req, res) => {
    try{
        const validationResult = await querySchema.validateAsync(req.body);
        const query = new Query({
            name: validationResult.name,
            email:validationResult.email,
            message:validationResult.message,
            createdAt:today
        })
    
        query.save()
        .then( result =>{
            res.json(result)
        })
        .catch(error => {
            res.status(400).json({error:error.message})
        })
    }
    catch(error){
        
        /*res.json(error.details[0].message).status(422)
        res.status(422).status(422)
        */
        res.status(400).json({errer:error.message});
    }
   
    
}

exports.getAllQueries = (req, res) => {
    Query.find()
    .then(result => {
        res.json(result)
    })
    .catch(error => {
        res.status(400).json(error)
    })
}

exports.getOneQuery = (req, res) => {
    const {id} = req.params
    Query.findOne({_id:id})
    .then(result => {
        if(result){
            res.json(result)
        }else{
            res.status(404).json("Query doesn't exist")
        }
    })
    .catch(error => {
        res.status(400).json(error)
    })
}
 
exports.deleteQuery = (req, res) => {
    const {id} = req.params
    Query.deleteOne({_id:id})
        .then(
            res.status(200).json({message:"message deleted successfully"})
        )
        .catch(error => {
            res.status(404).json({error:"message doesn't exist"})
        })
}


  