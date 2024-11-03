const mongoose = require('mongoose');
const DistributorSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    address: {
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
    CUI: {
        type: String,
        required: true,
        unique: true,
    },
    isAuthorized: {
        type: Boolean,
        default: false,
    }
    

    }, {timestamps: true});

const Distributor = mongoose.model('Distributor', DistributorSchema);

module.exports = Distributor;