const mongoose = require("mongoose");
const config = require("config");

const conversationSchema = new mongoose.Schema({
  convoId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  createdDate: { type: Date, default: Date.now },
});

const ConversationData = mongoose.model("conversation", conversationSchema);

exports.ConversationData = ConversationData;
