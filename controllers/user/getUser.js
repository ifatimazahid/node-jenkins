//***** Modules goes here *****//
var _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');
const express = require('express');
const Joi = require('joi');
const { UserData } = require('../../Models/user.model');
const auth = require('../../middleware/auth');
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express();
//***** ///// *****//

//***** Post Request for Login *****//
app.get('/', auth, async(req, res)=> {
    const user = await UserData.findById(req.user._id).select('-password');
    if(!user) {
        var errors = {
            success:false,
            msg:'Invalid user Id.', 
            data:''
        };
        res.send(errors);
    }
    else {
        var success = {
            success:true,
            msg:'User Found',
            data:user
        };
        res.send(success);
    }
});
//***** ///// *****//

module.exports = app;