const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    address: {
        country: {
            type: String,
            required: false,
        },
        county:{
            type: String,
            required: false,
        },
        city: {
            type: String,
            required: false,
        },
        street: {
            type: String,
            required: false,
        },
        number: {
            type: String,
            required: false,
        },
        zip: {
            type: String,
            required: false,
        },


    },
    payment: {
        type: String,
        required: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    }
    

    }, {timestamps: true});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;