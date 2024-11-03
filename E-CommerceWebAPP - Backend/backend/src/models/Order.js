const mongoose = require('mongoose');


const OrderSchema= new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: {
                type: Number,
                default: 1,
            },
        }
    ],
    status: {
        type: String,
        required: true,
        enum: ['Pending','Processing','Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    paymentStatus:{
        type:String,
        required: true,
        enum: ['Pending', 'Paid', 'Failed','Cash'],
        default: 'Pending',
    },
     name: {
        type: String,
        required: true,
     },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    address : {
        country: {
            type: String,
            required: true,
        },
        county:{
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        street: {
            type: String,
            required: true,
        },
        number: {
            type: String,
            required: true,
        },
        zip: {
            type: String,
            required: true,
        },
    },
    orderNumber: {
        type: String,
        unique: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Cash On Delivery', 'Credit Card', 'Paypal'],
        default: 'Cash On Delivery',
    },
    distributor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      }
    
}, {timestamps: true});

const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1000},
});
const Counter = mongoose.model('Counter', CounterSchema);

OrderSchema.pre('save', function(next) {
    const doc = this;
    if(!doc.isNew)
    {
        next();
        return;
    }
    Counter.findByIdAndUpdate(
        { _id: 'orderNumber' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    )
    .then(function(counter) {
        doc.orderNumber = counter.seq.toString();
        next();
    })
    .catch(function(error) {
        return next(error);
    });
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
    