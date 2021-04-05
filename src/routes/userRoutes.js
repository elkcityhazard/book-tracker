const { Router } = require('express');
const {requireAuth} = require('../utils/auth');
const userController = require('../controllers/userController');

const router = Router();


router.post('/signup', userController.signup_post);
router.post('/login', userController.login_post);
router.delete('/login', userController.login_delete);
router.patch('/login', requireAuth, userController.login_patch);


module.exports = router;