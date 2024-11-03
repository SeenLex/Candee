const Cart = require('../models/Cart');

exports.createCart = async (req, res) => {
    try {
        const newCart = new Cart({ user: req.body.id });
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}



exports.addProductToCart = async (req, res) => {
    try {
        console.log(req.user.id);
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            res.status(404).json({message: "Cart not found"});
            return;
        }
        
        
        const product = cart.products.find(p => p.product.toString() === req.body.productId);
        if (product) {
            await Cart.updateOne(
                { "products.product": req.body.productId },
                { $inc: { "products.$.quantity": req.body.quantity } }
            );
            res.status(200).json({ message: "Product quantity has been updated" });
            return;
        }

        cart.products.push({
            product: req.body.productId,
            quantity: req.body.quantity,
        });

        const updatedCart = await cart.save();
        res.status(200).json({message: "Product has been added to cart", updatedCart});

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteProductFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }

        const product = cart.products.find(p => p.product.toString() === req.body.productId);
        if (!product) {
            res.status(404).json({ message: "Product not found in cart" });
            return;
        }

        await Cart.updateOne(
            { user: req.user.id },
            { $pull: { products: { product: req.body.productId } } }
        );
        res.status(200).json({message: "Product has been deleted from cart"});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }

        if (cart.products.length === 0) {
            res.status(400).json({ message: "Cart is already empty" });
            return;
        }

        cart.products = [];
        await cart.save();
        res.status(200).json({ message: "Cart has been deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate('products.product');

        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }

        res.json({message: "Cart found", cart});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find().populate('products.product');
        res.json({message: "All carts found", carts});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.editProductQuantityInCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }

        const product = cart.products.find(p => p.product.toString() === req.body.productId);
        if (!product) {
            res.status(404).json({ message: "Product not found in cart" });
            return;
        }

        if (req.body.quantity < 0) {
            return res.status(400).json({ message: "Quantity can't be less than 0" });
            
        }

        if (req.body.quantity === 0) {
            cart.products = cart.products.filter(p => p.product.toString() !== req.body.productId);
            await cart.save();
            return res.status(200).json({ message: "Product has been deleted from cart" });
        }

       cart.products.map(p => {
            if (p.product.toString() === req.body.productId) {
                p.quantity = req.body.quantity;
            }
            return p;
        });
        const updatedCart = await cart.save();
        res.status(200).json({ message: "Product quantity has been updated", updatedCart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
