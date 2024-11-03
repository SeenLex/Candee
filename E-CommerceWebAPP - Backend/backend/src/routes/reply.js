const router = require('express').Router();
const replyController = require('../controllers/replyController');
const { verifyTokenAndReplyAuthorization, verifyTokenAndAdmin } = require('../middleware/verifyToken');

//ADD REPLY
router.post("/addReply", verifyTokenAndReplyAuthorization, replyController.addReply);
//DELETE REPLY
router.delete("/deleteReply", verifyTokenAndAdmin, replyController.deleteReply);

module.exports = router;