const express = require('express');
const {getAllQueries, getOneQuery, createQuery,deleteQuery} = require('../controllers/queryController');
const {protect} = require('../middlewares/auth')
const router = express.Router()

router.get('',protect, getAllQueries);
router.get('/:id',protect, getOneQuery);
router.post('',createQuery);
router.delete('/:id', protect, deleteQuery)

module.exports = router;