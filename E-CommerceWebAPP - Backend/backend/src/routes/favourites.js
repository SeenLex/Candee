const { verifyTokenAndAuthorization, verifyTokenAndAdmin,verifyToken } = require('../middleware/verifyToken');
const router = require('express').Router();
const favouritesController = require('../controllers/favouritesController');

//CREATE
router.post("/create", verifyTokenAndAdmin, favouritesController.createFavourites);
//ADD
router.put("/add",verifyToken, favouritesController.addFavourites);

//DELETE PRODUCT FROM FAVOURITES
router.delete("/deleteProduct/:productId", verifyToken, favouritesController.deleteProductFromFavourites);

//DELETE FAVOURITES LIST
router.delete("/deleteAll", verifyToken, favouritesController.deleteAllFavourites);

//GET FAVOURITES BY USER ID
router.get("/find", verifyToken, favouritesController.getFavourites);

//GET ALL FAVOURITES
router.get("/findAll", verifyTokenAndAdmin, favouritesController.getAllFavourites);

module.exports = router;
