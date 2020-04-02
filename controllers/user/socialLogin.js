//***** Modules goes here *****//
var _ = require('lodash');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const express = require('express');
const Joi = require('joi');
const { UserData, generateAuthToken } = require('../../Models/user.model');
const { SocialUserData } = require('../../Models/socialUser.model')
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express();
//***** ///// *****//

//***** Post Request for Login *****//
app.post('/', (req, res) => {
    const url = req.protocol + '://' + req.get('host');
    const { error } = validateUserData(req.body);
    console.log(error)
    if (error) {
        var errors = {
            success: false,
            msg: error.name,
            data: error.details[0].message
        };
        res.send(errors);
        return;
    }
    // res.send({success:true})
    checkUser(req.body).then((response) => {
        if (response == null) {
            var errors = {
                success: false,
                msg: 'Invalid email or password.',
                data: ''
            };
            res.send(errors);
        }
        else {
            console.log(response)
            var data = _.pick(response, ['_id', 'firstName', 'lastName', 'mobile', 'liked_stores', 'email', 'profile_img', 'createdDate', 'access_token']);
            // data.profile_img =`${url}${data.profile_img}`
            var success = {
                success: true,
                msg: 'User Found',
                data: data
            };
            res.send(success);
        }
    });
});
//***** ///// *****//

//***** User login data validation function *****//
function validateUserData(userData) {
    const schema = Joi.object().keys({
        email: Joi.string().email({ minDomainAtoms: 2 }).required(),
        password: Joi.string().min(5),
        gcm_id: Joi.string(),
        platform: Joi.string(),
        firstName: Joi.string(),
        lastName: Joi,
        profile_img: Joi.string(),
        idToken: Joi.string(),
        authCode: Joi.string(),
        Accounttype: Joi.number().required()
    });
    return Joi.validate(userData, schema);
}
//***** ///// *****//

async function checkUser(body) {
    const user = await UserData.findOne({ email: body.email });
    var data = { email: body.email, Accounttype: body.Accounttype, gcm_id: body.gcm_id, profile_img: body.profile_img, platform: body.platform, firstName: body.firstName, lastName: body.lastName }
    const userForSve = new UserData(data);

    if (!user) {

        try {
            const Userresult = await userForSve.save();
            console.log(Userresult)
            body._userId = Userresult._id;

        }
        catch (ex) {
            console.log('catch1', ex);
            console.log(ex.code);
            return (500);
        }
        try {
            const SavesocialUser = new SocialUserData(body);
            const Socialresult = await SavesocialUser.save();
        }
        catch (err) {
            console.log('catch2', err);
            console.log(err.code);
            return (500);
        }
    }
    const Socialuser = await SocialUserData.findOne({ email: body.email });
    if (user.Accounttype && user.Accounttype != 0) {
        if (!Socialuser) {
            try {
                const result = await SavesocialUser.save();
            }
            catch (ex) {
                console.log('catch');
                console.log(ex.code);
                return (500);
            }
            return (200);
        }

        user.access_token = generateAuthToken(user._id);

        if (user) {
            const result = await UserData.updateOne(
                { _id: user._id },
                {
                    $set: {
                        gcm_id: body.gcm_id,
                        platform: body.platform,
                        Accounttype:body.Accounttype
                    }
                }
            );
            const Socialresult = await SocialUserData.updateOne(
                { _userId : user._id },
                {
                    $set: {
                        gcm_id: body.gcm_id,
                        platform: body.platform,
                        Accounttype:body.Accounttype
                    }
                }
            );
        }

        return user;
    }
}
    module.exports = app;