
const mongoose = require('mongoose');
const config = require('config');


const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, ref: 'converation' 
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, ref: 'User' 
      },
      content:{
        type:String
      },
    createdDate:{ type:Date, default:Date.now },
});

const MessageData = mongoose.model('users', MessageSchema);


exports.MessageData = MessageData;