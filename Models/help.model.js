
const mongoose = require('mongoose');

const helpSchema = new mongoose.Schema({
      title:{
        type:String
      },
      subTitle:{
        type:String
      },
      image:{
          type:String,
      },
    createdDate:{ type:Date, default:Date.now },
});

const HelpData = mongoose.model('help', helpSchema);


exports.HelpData = HelpData;