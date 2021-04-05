const {Router} = require('express');
const {requireAuth} = require('../utils/auth');
const frontController = require('../controllers/frontController');

const router = Router();
router.get('/', frontController.homePage_get);
router.get('/signup', frontController.signup_get);
router.get('/login', frontController.login_get);
router.get('/logout', frontController.logout_get);
router.get('/edit-books', requireAuth, frontController.editAllBooks_get);



module.exports = router;