const Product = require('../models/Product');
const Review = require('../models/Review');
const User = require('../models/User');

exports.addReviewToProduct = async (req, res) => {
    try{
        const { productId, userId, rating, title, content } = req.body;
        console.log(req.body);
        const product = await Product.findById(productId);
        if(!product){
            res.status(404).json("Product not found");
            return;
        }
        const alreadyReviewed = await Review.findOne({product: productId, user: userId});
        if(alreadyReviewed){
            res.status(400).json("You already reviewed this product!");
            return;
        }
        const newReview = new Review({
            product: productId,
            user: userId,
            rating,
            title,
            content
        });
        console.log(newReview);
        await newReview.save();
        
        const reviews = await Review.find({product: productId});
        const totalRating = reviews.reduce((accumulator, review) => accumulator + review.rating, 0);
        const newRating = reviews.length > 0 ? totalRating/reviews.length : 0;
        product.ratingProduct = newRating;
        product.numberOfReviews = reviews.length;
        await product.save();

        res.status(200).json(newReview);
    } catch(error){
        res.status(500).json(error);
    }
}

exports.getReviewsByProduct = async (req, res) => {
    try{
        const product = await Product.findById(req.params.productId);
        console.log(product);
        if(!product){
            res.status(404).json("Product not found!");
            return;
        }
        const reviews = await Review.find({product: req.params.productId}).populate('user', 'name role');
        console.log(reviews);
        reviews.map(review => {
            const {password, ...others} = review.user._doc;
            review.user = others;
            return review;
        });
        res.status(200).json(reviews);
    }catch(error){
        res.status(500).json(error);
    }
}

exports.getReviews = async (req, res) => {
    try {
        let reviews;
        const userRole = req.user.role;
        const userId = req.user.id;

        if (userRole === 'admin') {
            reviews = await Review.find().populate('product').populate('user');
        } else if (userRole === 'customer' || userRole === 'distributor') {
            reviews = await Review.find({ user: userId }).populate('product').populate('user');
        }

        if (!reviews || reviews.length === 0) {
            res.status(404).json("No reviews found!");
            return;
        }

        reviews = reviews.map(review => {
            const { name, role } = review.user._doc;
            review.user = { name, role };
            return review;
        });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.deleteReview = async (req, res) => {
    try{
        const review = await Review.findByIdAndDelete(req.body.reviewId);
        if(!review){
            res.status(404).json("Review not found!");
            return;
        }
        res.status(200).json("Review deleted successfully!");
    }catch(error){
        res.status(500).json(error);
    }
}