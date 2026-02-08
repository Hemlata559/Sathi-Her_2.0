const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'message'
  }
}, { timestamps: true });

module.exports = mongoose.model('chat', chatSchema);
