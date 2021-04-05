const {Router} = require('express');
const frontController = require('../controllers/frontController');

const router = Router();
router.get('/', frontController.homePage_get);
router.get('/signup', frontController.signup_get);
router.get('/login', frontController.login_get);
router.get('/logout', frontController.logout_get);


module.exports = router;