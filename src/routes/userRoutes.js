const { Router } = require('express');
const {requireAuth} = require('../utils/auth');
const userController = require('../controllers/userController');

const router = Router();

router.get('/signup', userController.signup_get);
router.post('/signup', userController.signup_post);
router.get('/login', userController.login_get);
router.post('/login', userController.login_post);
router.delete('/login', userController.login_delete);
router.patch('/login', requireAuth, userController.login_patch);
router.get('/logout', userController.logout_get);

module.exports = router;