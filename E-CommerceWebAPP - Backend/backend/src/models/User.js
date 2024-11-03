const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
  
    role:{
        type: String,
        required: true,
        enum: ['distributor', 'customer', 'admin'],
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    distributorInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'Distributor' },
    customerInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }
    

    }, {timestamps: true});


const User = mongoose.model('User', userSchema);

module.exports = User;