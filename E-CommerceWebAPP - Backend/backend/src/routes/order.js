const { verifyToken,verifyTokenAndCustomer,verifyTokenAndCancelOrderAuthorization, verifyTokenAndAdmin, verifyTokenAndAuthorization, verifyTokenAndEditOrderStatusAuthorization, verifyTokendAndAssociatedDistributor, verifyOrderOwnership } = require('../middleware/verifyToken');
const orderController = require('../controllers/orderController');

const router = require('express').Router();

//CREATE ORDER(USER)
router.post("/createOrder",verifyTokenAndCustomer, orderController.createOrder);
//CANCEL ORDER
router.put("/cancel/:id", verifyTokenAndCancelOrderAuthorization, orderController.cancelOrder);
//GET ORDER BY ID
router.get("/order/:id",verifyToken, orderController.getOrderDetails);
//GET ALL ORDERS(ADMIN)
router.get("/find", verifyToken, orderController.getOrdersByUser);
//EDIT ORDER STATUS(ADMIN & DISTRIBUTOR)
router.put("/editOrderStatus/:id",verifyTokenAndEditOrderStatusAuthorization, orderController.editOrderStatus);

module.exports = router;