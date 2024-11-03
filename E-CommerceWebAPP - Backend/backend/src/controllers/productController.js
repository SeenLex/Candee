const Category = require('../models/Category');
const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
    try {
      const imageFiles = req.files;
      if(req.body.categories === ',' || req.body.categories === '')
      {
          return res.status(400).json("Categories must be provided");
      }

      const categoryArray = req.body.categories.split(',');
   
  
      if (!imageFiles || imageFiles.length === 0) {
        return res.status(400).json({ message: 'No image files uploaded' });
      }
      if(req.body.price <= 0)
        {
            return res.status(400).json("Price must be greater than 0");
        }
      if(req.body.stock <= 0)
        {
            return res.status(400).json("Stock must be greater than 0");
        }
            
  
      
    categoryArray.forEach(async (category) => {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            res.status(400).json("Category does not exist");
            return;
        }
    } );  
    
    const discountPrice = req.body.discountPrice || req.body.price;
    const discountPercentage = req.body.discountPercentage || 0;

    const newProduct = new Product({
        name: req.body.name,
        price: req.body.price,
        discountPrice: discountPrice,
        discountPercentage: discountPercentage,
        categories: categoryArray,
        description: req.body.description,
        brand: req.body.brand,
        stock: req.body.stock,
        distributor: req.user.id,
      });
      const savedProduct = await newProduct.save();

      const imageUrls = imageFiles.map((file) => { 
        return `${process.env.BASE_URL}/api/uploads/${file.filename}`;
        });
    

      
      savedProduct.images = imageUrls;
      await savedProduct.save();
    
      res.status(200).json({ message: 'Product added successfully', product: savedProduct });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  exports.updateProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      if (Object.prototype.hasOwnProperty.call(req.body, 'distributorId') || 
          Object.prototype.hasOwnProperty.call(req.body, 'ratingProduct') || 
          Object.prototype.hasOwnProperty.call(req.body, 'numberOfReviews')) {
        return res.status(403).json({ message: 'You are not authorized to edit these fields' });
      }
  
      if (req.body.price <= 0) {
        return res.status(400).json({ message: 'Price must be greater than 0' });
      }
  
      if (req.body.stock < 0) {
        return res.status(400).json({ message: 'Stock must be greater than or equal to 0' });
      }
  
      const { name, description, price, stock, categories } = req.body;
      if(req.body.categories === ',' || req.body.categories === '')
        {
            return res.status(400).json("Categories must be provided");
        }
      const categoryArray = categories.split(',');
  
      categoryArray.forEach(async (category) => {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
          return res.status(400).json({ message: `Category ${category} does not exist` });
        }
      });
  
      const imageFiles = req.files;
      let imageUrls = req.body.images || [];

      // Convert new image files to URLs
      if (imageFiles && imageFiles.length > 0) {
        const newImageUrls = imageFiles.map((file) => `${process.env.BASE_URL}/api/uploads/${file.filename}`);
        // Merge existing image URLs with new image URLs
        imageUrls = [...imageUrls, ...newImageUrls];
      }
      
      product.name = name || product.name;
      product.price = price || product.price;
      product.categories = categoryArray || product.categories;
      product.description = description || product.description;
      product.stock = stock || product.stock;
      product.images = imageUrls;
      product.brand = req.body.brand || product.brand;
      product.isActive = req.body.isActive || product.isActive;
      product.discountPrice = req.body.discountPrice || product.price;
      product.discountPercentage = req.body.discountPercentage || product.discountPercentage;
  
      const savedProduct = await product.save();
      res.status(200).json({ message: 'Product updated successfully', product: savedProduct });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
exports.deleteProduct = async (req, res) => {
        try {
            
            await Product.findByIdAndUpdate(req.params.productId, {
                isActive: false,
            });
            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (err) {
            res.status(500).json(err);  
    }
}
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("reviews", "content title rating createdAt").populate("questions").populate("distributor", "name ");
        res.status(200).json({message: 'All products', products});
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.getProduct = async (req, res) => {
    try {
      const productId = req.params.id;
  
      const product = await Product.findById(productId).populate("reviews", "content title rating createdAt").populate("questions");
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
    
        res.status(200).json({ message: 'Product found', product });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching product', error: err.message });
    }
  };
  
exports.getProductsByCategory = async (req, res) => {
    try {
      const category = await Category.findOne({ name: req.params.category });
      const products = await Product.find({
        categories: category._id,
      });

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching products', error: err.message });
    }
}


exports.getProductsByDistributor = async (req, res) => {
    try {
       
        const products = await Product.find()
            .populate("distributor", "name")
            .populate("categories", "name")
            .populate("reviews")
            .populate("questions");

    
        let userId;
        if(req.user.role === 'customer'){
            userId = req.params.id;
        }
        if(req.user.role === 'distributor'){
            userId = req.user.id;
        }
   
        const filteredProducts = products.filter((product) => {
            
             return product.distributor._id.toString() === userId
       
        });

        console.log(filteredProducts);

        res.status(200).json({ message: 'Products found', products: filteredProducts });
    } catch (err) {
        res.status(500).json(err);
    }   
}
exports.searchProducts = async (req, res) => {
    try {
      console.log(req.query);
        const searchQuery = req.query.q;
        const products = await Product.find({
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
            ],
        }).limit(7);
        const categories = await Category.find({
            name: { $regex: searchQuery, $options: 'i' },
        }).limit(5);

        res.status(200).json({ products, categories });
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.filterProducts = async (req, res) => {
    try {
        const { price, brand, availability, category } = req.body;
        const fetchedCategory = await Category.findOne({ name: category });
        let products = await Product.find({
        categories: fetchedCategory._id,
      });
        if (price.length) {
            products = products.filter((product) => {
              return product.price >= price[0] && product.price <= price[1];
            });
        }
        if (brand.length) {
            products = products.filter((product) => brand.includes(product.brand));
        }
        if (availability) {
            if(availability.inStock && !availability.outOfStock){
              products = products.filter((product) => product.stock > 0);
            }else if( !availability.inStock && availability.outOfStock){
              products = products.filter((product) => product.stock <= 0);
            }
        }
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
}