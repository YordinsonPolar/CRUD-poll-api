const router = require('express').Router();

const { findUser } = require('../middleware/findUser.js');
const { isAuth } = require('../middleware/auth.js');

const { userLogin, userRegister, userDelete, getUser } = require('../controllers/user.js');

router.get('/user', isAuth, getUser)
router.post('/user/login', userLogin);
router.post('/user/register', userRegister)
router.delete('/user/:id', findUser, isAuth, userDelete);

module.exports = router;