const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questionId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  
}, {timestamps: true});

const Reply  = mongoose.model('Reply', replySchema);
module.exports = Reply;

