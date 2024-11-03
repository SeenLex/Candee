const mongoose = require("mongoose");

const FavouritesSchema = new mongoose.Schema({
  user: {
    type:mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  products: [
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
     
    },
],
}, { timestamps: true });

const Favourites = mongoose.model("Favourites", FavouritesSchema);
module.exports = Favourites;
