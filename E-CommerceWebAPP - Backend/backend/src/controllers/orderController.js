const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { confirmOrderEmail, orderStatusEmail } = require('./emailController');

exports.createOrder = async (req, res) => {
    try {
      const products = req.body.products;
      const user = await User.findById(req.user.id).populate('customerInfo');
  
      if (!user) {
        return res.status(400).json("User not found");
      }
      if (!user.customerInfo.isVerified) {
        return res.status(400).json("User is not verified");
      }
      if (!products || products.length === 0) {
        return res.status(400).json("No products in cart");
      }
  
      let totalPrice = 0;
      const ordersByDistributor = new Map();
  
      for (const product of products) {
        if (product.productId.length !== 24) {
          return res.status(400).json(`Product ID is not valid`);
        }
        const checkProduct = await Product.findById(product.productId);
        if (!checkProduct) {
          return res.status(400).json(`Product not found: ${product.productId}`);
        }
        if (checkProduct.stock < product.quantity) {
          return res.status(400).json(`Product out of stock: ${product.productId}`);
        }
  
        const { price, discountPrice, distributor } = checkProduct;
        if(discountPrice && discountPrice < price){
            totalPrice += discountPrice * product.quantity;
        } else {
            totalPrice += price * product.quantity;
        }
  
        if (!ordersByDistributor.has(distributor)) {
          ordersByDistributor.set(distributor, {
            products: [],
            totalPrice: 0
          });
        }
  
        ordersByDistributor.get(distributor).products.push({
          product: checkProduct._id,
          quantity: product.quantity
        });
        if(discountPrice && discountPrice < price){
            ordersByDistributor.get(distributor).totalPrice += discountPrice * product.quantity;
        } else {
            ordersByDistributor.get(distributor).totalPrice += price * product.quantity;
        }
      }
  
      const orders = [];
      for (const [distributor, orderData] of ordersByDistributor) {
        const newOrder = new Order({
          user: req.user.id,
          products: orderData.products,
          name: req.body.name,
          email: req.user.email,
          phoneNumber: req.body.phoneNumber,
          address: {
            country: req.body.address.country,
            county: req.body.address.county,
            city: req.body.address.city,
            street: req.body.address.street,
            number: req.body.address.number,
            zip: req.body.address.zip,
          },
          paymentMethod: req.body.paymentMethod,
          totalPrice: orderData.totalPrice,
          distributor: distributor,
        });
        orders.push(await newOrder.save());
      }
  
      res.status(201).json({
        message: "Orders created successfully",
        orders,
      });
      await confirmOrderEmail(req.user.email, orders);
    } catch (err) {
      res.status(500).json({ message: "An error occurred", error: err.message });
    }
  };


const getValidStatuses = (role) => {
    switch(role) {
        case 'admin':
            return ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        case 'distributor':
            return ['Shipped', 'Delivered'];
        default:
            return [];
    }
};
const checkOrderStatus = (order, res) => {
    if (["Delivered", "Cancelled"].includes(order.status)) {
        const message = order.status === "Delivered" 
            ? "Order is already delivered" 
            : "Order is cancelled";
        res.status(400).json({ message });
        return false;
    }
    return true;
};
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({orderNumber:req.params.id});
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        
        if (!checkOrderStatus(order, res)) {
            return;
        }
        order.status = "Cancelled";
        await order.save();
        res.status(200).json({ message: "Order cancelled successfully" });
        await orderStatusEmail(order.email, order, "Cancelled");
        
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

exports.editOrderStatus = async (req, res) => {
    try {
        const order = await Order.findOne({orderNumber:req.params.id});
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
       
        if (!checkOrderStatus(order, res)) {
            return;
        }


        const validStatuses = getValidStatuses(req.user.role);
        if (!validStatuses.includes(req.body.status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        
        if (!validStatuses.includes(req.body.status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        

        order.status = req.body.status;
        const updatedOrder = await order.save();

        res.status(200).json({ message: "Order status updated successfully", order: updatedOrder });
        await orderStatusEmail(order.email, updatedOrder, req.body.status);
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

exports.getOrderDetails = async(req, res) => {
    try{
        
        const order = await Order.findOne({orderNumber:req.params.id}).populate('products.product').populate('user').populate('distributor');
        console.log(order.products);
        if(!order){
            return res.status(404).json({message:"Order not found"});
            
        }
       
        if(req.user.role === 'admin'){
            return res.status(200).json({message:"Order found",order});
        }
       
        if (req.user.role === 'customer' && order.user._id.toString() !== req.user.id) {
            return res.status(401).json({message:"You are not authorized to view this order"});
        }
        if(req.user.role === 'distributor' && order.distributor._id.toString() !== req.user.id){
            return res.status(401).json({message:"You are not authorized to view this order"});
        }
       
        const {name,role} = order.user._doc;
        order.user = {name,role};
      

        res.status(200).json({message:"Order found",order});
    } catch(error){
        res.status(500).json({message:"An error occurred",error:error.message});
    }
}
exports.getOrdersByUser = async(req, res) => {
    try{
        let orders;
        if(req.user.role === 'admin'){
            orders = await Order.find().populate('products.product').populate('user').populate('distributor');
          
        }
        if(req.user.role === 'customer'){
            orders = await Order.find({user: req.user.id}).populate('products.product').populate('user').populate('distributor');
           
        }
        if(req.user.role === 'distributor'){
            orders = await Order.find({distributor: req.user.id}).populate('products.product').populate('user').populate('distributor');
            
        }
        if (orders.length === 0) {
            return res.status(404).json({message:"No orders found"});
        }
        console.log(orders);
        if (orders.length > 1) {
            orders.map(order =>{
                const {name,role} = order.user._doc;
                order.user = {name,role};
                return order;
            })
        }
        res.status(200).json({message:"Orders found",orders});
    }
    catch(error){
        res.status(500).json({message:"An error occurred",error:error.message});
    }

}

