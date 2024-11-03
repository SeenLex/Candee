const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: true},
    product : { type: mongoose.Schema.Types.ObjectId, ref: 'Product' , required: true},
    content: {
        type: String,
        required: true
    },
}, {timestamps: true});

questionSchema.virtual('replies',{
    ref: 'Reply',
    localField: '_id',
    foreignField: 'questionId'
})

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;

