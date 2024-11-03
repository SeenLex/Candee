const router = require("express").Router();
const reviewController = require('../controllers/reviewController');

const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization, verifyTokenAndCustomer } = require("../middleware/verifyToken");

//ADD REVIEW
router.post("/addReview", verifyTokenAndCustomer, verifyTokenAndAuthorization, reviewController.addReviewToProduct);
//GET REVIEWS BY PRODUCT
router.get("/getReviewsForProduct/:productId", reviewController.getReviewsByProduct);
//GET REVIEWS
router.get("/getReviews", verifyToken, reviewController.getReviews);
//DELETE REVIEW
router.delete("/deleteReview",verifyTokenAndAdmin, reviewController.deleteReview);

module.exports = router;