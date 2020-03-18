//***** Modules goes here *****//
const bcrypt = require('bcryptjs');
const express = require('express');
const Joi = require('joi');
const { UserData } = require('../../Models/user.model');
const auth = require('../../middleware/auth');
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express();
//***** ///// *****//

//***** Post Request for Login *****//
app.post('/', auth, (req, res)=> {
    const { error } = validateUserData(req.body);
    if(error) {
        var errors = {
            success:false,
            msg:error.name, 
            data:error.details[0].message
        };
        res.send(errors);
        return;
    }
    
    checkUser(req.body).then((response)=> {
        if(response == 500) {
            var errors = {
                success:false,
                msg:'No User Found', 
                data:''
            };
            res.send(errors);
        }
        else {
            var success = {
                success:true,
                msg:'User Found', 
                data:response
            };
            res.send(success);
        }
    });
});
//***** ///// *****//

//***** User login data validation function *****//
function validateUserData(userData) {
    const schema = Joi.object().keys({
        fullName: Joi.string().min(4).max(30).required(),
        userName: Joi.string().min(4).max(30).required(),
        email: Joi.string().email({ minDomainAtoms: 2 }).required(),
        mobile: Joi.number().required(),
        password: Joi.string().min(5),
        _id: Joi.string()
    });
    return Joi.validate(userData, schema);
}
//***** ///// *****//

//***** Find User and return function *****//
async function checkUser(body) {
    
    if(body.password != null) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(body.password, salt);
        body.password = hashed;
    }

    const update = await UserData.findByIdAndUpdate(body._id, {
        $set: body
    });
    
    const user = await UserData.findById(update._id).select('-password');
    return (user);
}
//***** ///// *****//

module.exports = app;