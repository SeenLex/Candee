
const {verifyTokenAndAuthorization,verifyTokenAndAdmin, verifyToken} = require('../middleware/verifyToken');
const router = require('express').Router();
const cartController = require('../controllers/cartController');


//CREATE
router.post("/create",verifyTokenAndAdmin,cartController.createCart);
//UPDATE
router.put("/add",verifyToken,cartController.addProductToCart);
//EDIT QUANTITY IN CART
router.put("/edit",verifyToken,cartController.editProductQuantityInCart);
//DELETE
router.delete("/deleteAll",verifyToken,cartController.deleteCart);
//DELETE PRODUCT FROM CART
router.delete("/deleteProduct",verifyToken,cartController.deleteProductFromCart);
//GET CART BY USER ID
router.get("/find",verifyToken,cartController.getCart);
// GET ALL CARTS
router.get("/findAll",verifyTokenAndAdmin,cartController.getAllCarts);



module.exports = router;    