const { verifyTokenAndAdmin, verifyTokenAndCustomer, verifyToken } = require('../middleware/verifyToken');

const router = require('express').Router();
const questionController = require('../controllers/questionController');

//ADD QUESTION
router.post("/addQuestion", verifyTokenAndCustomer, questionController.addQuestion);
//DELETE QUESTION
router.delete("/deleteQuestion", verifyTokenAndAdmin, questionController.deleteQuestion);
//GET ALL QUESTIONS BY PRODUCT ID
router.get("/findQuestion/:productId", questionController.getQuestionByProduct);
//GET ALL QUESTIONS BY USER ID
router.get("/findUserQuestion/:userId", verifyToken, questionController.getQuestionByUser);
//GET ALL QUESTION BY DISTRIBUTOR ID


module.exports = router;