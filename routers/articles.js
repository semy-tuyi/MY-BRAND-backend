const express = require("express");
const {getAllArticles, createNewArticle, getOneArticle, updateArticle, deleteArticle, commentingOnArticle, fetchComments} = require("../controllers/articleController")
const {protect} = require('../middlewares/auth')
const router = express.Router();

router.get('', getAllArticles);
router.get('/:id', getOneArticle);
router.post('', protect, createNewArticle);
router.patch('/:id/update', protect, updateArticle)
router.delete('/:id', protect, deleteArticle)

router.post('/:id/comment',protect, commentingOnArticle)
router.get('/comment/:id', fetchComments);

module.exports = router;
