const { verifyTokenAndDistributor,verifyTokenAndEditProductAuthorization, verifyTokenAndAuthorizedDistributor } = require("../middleware/verifyToken");
const router = require("express").Router();
const productController = require("../controllers/productController");
const { upload } = require("../middleware/gridFsStorage");

//CREATE
router.post("/add", verifyTokenAndAuthorizedDistributor, upload.array('images', 5),  productController.createProduct); 
//UPDATE
router.put("/edit/:productId", verifyTokenAndEditProductAuthorization,upload.array('images',5),productController.updateProduct);
//DELETE
router.delete("/delete/:productId", verifyTokenAndEditProductAuthorization, productController.deleteProduct);
//GET PRODUCT BY ID
router.get("/find/:id", productController.getProduct);
// GET ALL PRODUCTS
router.get("/findAll", productController.getAllProducts);
//GET PRODUCTS BY CATEGORY
router.get("/findCategory/:category", productController.getProductsByCategory);
//GET PRODUCTS BY DISTRIBUTOR
router.get("/findDistributor/:id", verifyTokenAndDistributor, productController.getProductsByDistributor);
//SEARCH PRODUCTS
router.get("/search", productController.searchProducts);
//GET FILTERED PRODUCTS
router.post("/findFilter", productController.filterProducts);

module.exports = router;    