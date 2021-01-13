
const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  event_name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  from_time: {
    type: String,
    required: true
  },
  till_time: {
    type: String,
    required: true
  },
  latitude: {
    type: String,
    required: true
  },
  longitude: {
    type: String,
    required: true
  },
  members: {
    type: [Object],
    required: true,
    phone: {
      type: Number,
      required: true
    },
    isOwner: {
      type: Boolean,
      required: true
    },
    status: {
      type: Number,
      default: 0
    }
  },
  createdDate:
  { type: Date, default: Date.now },
},
  { strict: false });

const PartyData = mongoose.model('party', partySchema);


exports.PartyData = PartyData;