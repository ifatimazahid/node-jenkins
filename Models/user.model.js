
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        min: 4,
        max: 30,
        required: true
    },
    userName: {
        type: String,
        min: 4,
        max: 30,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
        // select:false
    },
    gcm_id: String,
    platform: String,
    createdDate:{ type:Date, default:Date.now },
});
function generateAuthToken(_id) {
    const token = jwt.sign({_id: _id}, config.get('jwtPrivateKey'));
    return token;
}
const UserData = mongoose.model('users', userSchema);


exports.UserData = UserData;
exports.generateAuthToken = generateAuthToken;