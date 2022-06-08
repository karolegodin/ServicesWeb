const { Router } = require('express');
const authController = require('../controllers/authController');

//création d'un routeur
const router = Router();

router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);

//permet d'utiliser la classe dans d'autres fichiers
module.exports = router;