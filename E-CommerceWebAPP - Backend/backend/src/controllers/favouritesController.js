const Favourites = require("../models/Favourites");
const Product = require("../models/Product");


exports.createFavourites = async (req, res) => {
  try {
    const newFavourites = new Favourites({ user: req.body.id });
    const savedFavourites = await newFavourites.save();
    res.status(200).json({ message: "Favourites list created", savedFavourites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addFavourites = async (req, res) => {
  try {
    console.log(req.user.id);
    const favourites = await Favourites.findOne({ user: req.user.id }).populate('products.product');

    if (!favourites) {
      res.status(404).json({ message: "Favourites list not found" });
      return;
    }
    const productExists = await Product.findById(req.body.productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }



    const product = favourites.products.find(p => p.product.equals(req.body.productId));
    if (product) {
      return res.status(400).json({ message: "Product already in favourites" });
    }
    const newProduct = { product: req.body.productId };
    favourites.products.push(newProduct);
    const result =  await favourites.save();
    if (!result) {
      return res.status(400).json({ message: "Product not added to favourites" });
    }
    res.status(200).json({ message: "Product added to favourites", result: newProduct });
    console.log(newProduct);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteProductFromFavourites = async (req, res) => {
  try {
   
    const favourites = await Favourites.findOne({ user: req.user.id });
    if (!favourites) {
      res.status(404).json({ message: "Favourites list not found" });
      return;
    }

    const product = favourites.products.find(p => p.product.equals(req.params.productId));
    if (!product) {
      res.status(404).json({ message: "Product not found in favourites" });
      return;
    }



    await favourites.updateOne({ $pull: { products: { product: req.params.productId } } });
    res.status(200).json({ message: "Product deleted from favourites" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.deleteAllFavourites = async (req, res) => {
  try {
    const favourites = await Favourites.findOne({ user: req.user.id });

    if (!favourites) {
      res.status(404).json({ message: "Favourites list not found" });
      return;
    }
    if (favourites.products.length === 0) {
      res.status(400).json({ message: "Favourites list is empty" });
      return;
    }

    favourites.products = [];
    await favourites.save();
    res.status(200).json({ message: "Favourites list deleted  " });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getFavourites = async (req, res) => {
  try {

    const favourites = await Favourites.findOne({ user: req.user.id}).populate('products.product');

    if (!favourites) {
      res.status(404).json({ message: "Favourites list not found" });
      return;
    }
    res.json({message: "Favourites list found", favourites});
   
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getAllFavourites = async (req, res) => {
  try {
    const favourites = await Favourites.find().populate('products.product');
    res.json({message: "All Favourites list found", favourites});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
