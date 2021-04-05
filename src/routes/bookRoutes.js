const {Router} = require('express');
const router = Router();
const bookController = require('../controllers/bookController');
const { requireAuth } = require('../utils/auth');

router.get('/', bookController.getAllBooks_get);
router.post('/', requireAuth, bookController.addNewBook_post);
router.get('/:id', bookController.getSingleBook_get);
router.patch('/:id', requireAuth, bookController.updateSingleBook_patch);
router.delete('/:id', requireAuth, bookController.deleteSingleBook_delete);





module.exports = router;