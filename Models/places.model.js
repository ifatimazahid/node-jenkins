
const mongoose = require('mongoose');



const placeSchema = new mongoose.Schema({

    title: {
        type: String,
        min: 4,
        max: 30,
        required: true
    },
    type:{
    type:Number,
    required:false,
    default:0
   },
   location:{
    type: [Number],
       unique:true,
       required:true
   },

visitingNo:{
    type:Number
},
    createdDate:{ type:Date, default:Date.now },
});

const placeData = mongoose.model('Places', placeSchema);


exports.placeData =  placeData;