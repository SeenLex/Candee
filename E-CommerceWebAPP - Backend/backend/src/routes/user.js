const { verifyTokenAndAuthorization, verifyTokenAndAdmin,verifyToken } = require("../middleware/verifyToken");
const User = require("../models/User");
const UserVerificationToken = require("../models/UserVerificationToken");
const userController = require("../controllers/UserController/userController");
const Customer = require("../models/Customer");


const router = require("express").Router();
//UPDATE USER
router.put("/edit",verifyToken,userController.updateUserSelf);
//UPDATE ADMIN
router.put("/editByAdmin",verifyTokenAndAdmin,userController.updateUserByAdmin);
//DELETE
router.delete("/delete",verifyTokenAndAdmin, userController.deleteUser);
//GET USER
router.get("/find/:id",verifyToken,userController.getUser);
//GET ALL USERS
router.get("/all",verifyTokenAndAdmin,userController.getAllUsers);

//ACTIVATE ACCOUNT
router.get("/confirmAccount/:token",  userController.confirmAccount);
router.get('/resendVerificationEmail',verifyToken,userController.resendVerificationEmail);


module.exports = router;