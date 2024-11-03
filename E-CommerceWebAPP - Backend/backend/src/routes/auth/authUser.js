const router = require('express').Router();
const authUserController = require('../../controllers/UserController/authUserController');


//Register User

router.post('/register',authUserController.registerUser);


//Login User
router.post('/login', authUserController.loginUser);

router.post('/logout', authUserController.logoutUser);

router.post('/refresh_token', authUserController.refreshToken);

module.exports = router;