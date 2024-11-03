const express = require('express'); 
const authUserRoute = require('./routes/auth/authUser');
const userRoutes = require('./routes/user');


const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const cartRoutes = require('./routes/cart');

const favouritesRoutes = require('./routes/favourites');
const reviewsRoutes = require('./routes/review');
const questionRoutes = require('./routes/question');
const replyRoutes = require('./routes/reply');
const paymentRoutes = require('./routes/stripe');
const categoriesRoutes = require('./routes/categories');
const dotenv = require('dotenv');
const imageRoutes = require('./routes/image');
const cors = require('cors');



dotenv.config();

const app = express();
app.use(express.json());
app.use(cors( {origin: true, credentials: true} ));
//Authentication
app.use("/api/authUser", authUserRoute); 
app.use("/api/users", userRoutes);

app.use("/api/products", productRoutes);
app.use("/api/cart",cartRoutes);

app.use("/api/orders", orderRoutes);
app.use("/api/products",productRoutes);
app.use("/api/question",questionRoutes);
app.use("/api/reply", replyRoutes);
app.use("/api/favourites",favouritesRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api", categoriesRoutes);
app.use("/api", imageRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
