
const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  createdDate:
  { type: Date, default: Date.now },
},
  { strict: false });

const PartyData = mongoose.model('party', partySchema);


exports.PartyData = PartyData;