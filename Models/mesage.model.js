
const mongoose = require('mongoose');
const config = require('config');


const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, ref: 'conversations' 
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, ref: 'User' 
      },
      text:{
        type:String
      },
    createdDate:{ type:Date, default:Date.now },
});

const MessageData = mongoose.model('message', MessageSchema);


exports.MessageData = MessageData;