const {createNewUser,deleteUser, loginUser, getAllUsers} = require('../controllers/userController');
const {protect} = require('../middlewares/auth')
const express = require('express');
const router = express.Router();

router.get('/get',protect,getAllUsers);
router.post('', createNewUser);
router.delete('/:id', deleteUser);
router.post('/login', loginUser);

module.exports = router;


