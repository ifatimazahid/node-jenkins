//***** Modules goes here *****//
const bcrypt = require('bcryptjs');
const express = require('express');
const Joi = require('joi');
const { UserData } = require('../../Models/user.model');
const { placeData } = require('../../Models/places.model');
const { yourplaceData } = require('../../Models/yourPlaces.model');

const multer = require("multer");
const auth = require('../../middleware/auth');

const app = express();
//***** ///// *****//



//***** Post Request for Login *****//
app.post('/', auth, (req, res) => {

    const { error } = validateApiData(req.body);

    if (error) {
        var errors = {
            success: false,
            msg: error.name,
            data: error.details[0].message
        };
        res.status(403).send(response);
        return;
    }
    checkUplocation(req.body.uplocation)
        .then((response) => {
            if (response.success === false) {
                res.status(403).send(response);
                return;
            }
            createPlace(response).then(result => {
                var myPlaceData = { _userId: req.user._id, _placeId: result._id, title: result.title }
                createMyplace(myPlaceData).then((re) => { }).catch(err => { })
            }).catch(err => {

            })

        })
        .catch(err => {
            res.status(404).send(err);
            return;
        })
    checkdownlocation(req.body.downlocation)
        .then((response) => {
            if (response.success === false) {
                res.status(403).send(response);
                return;
            }
            createPlace(response).then(result => {
                var myPlaceData = { _userId: req.user._id, _placeId: result._id, title: result.title }
                createMyplace(myPlaceData).then((re) => { }).catch(err => { })
            }).catch(err => {

            })
        })
        .catch(err => {
            res.status(404).send(err);
            return;
        })
    res.status(200).send(
        {
            success: true,
            msg: 'Drive Start',
            data: req.body
        }
    )

});
//***** ///// *****//

//***** User login data validation function *****//
function validatePlace(placeData) {
    const schema = Joi.object().keys({
        title: Joi.string().min(4).max(30).required(),
        latitude: Joi.string().min(4).max(30).required(),
        longitude: Joi.number().required(),
    });
    return Joi.validate(placeData, schema);
}
function validateApiData(req) {
    const schema = Joi.object().keys({
        uplocation: Joi.object().required(),
        downlocation: Joi.object().required(),
    });
    return Joi.validate(req, schema)
}
//***** ///// *****//

//***** Find User and return function *****//
async function checkUplocation(body) {
    const { error } = validatePlace(body);
    console.log(error)
    if (error) {
        var errors = {
            success: false,
            msg: "In Uplocation " + error.name,
            data: error.details[0].message
        };
        return errors;
    }
    var data = { title: body.title, location: [body.latitude, body.longitude] }
    return data;
}
async function createPlace(body) {
    var findResult;
    const place = new placeData(body);
    try {
        const result = await place.save();

        findResult = result;
    }
    catch (ex) {
        const findPlace = await placeData.findOne({ location: body.location });
        findResult = findPlace;
    }
    return findResult;
}
async function createMyplace(body) {
    const place = new yourplaceData(body);
    try {
        const result = await place.save();

    }
    catch (ex) {
        return (500);
    }
    return (200);
}
async function checkdownlocation(body) {
    const { error } = validatePlace(body);
    console.log(error)
    if (error) {
        var errors = {
            success: false,
            msg: "In downlocation " + error.name,
            data: error.details[0].message
        };
        return errors;
    }
    var data = { title: body.title, location: [body.latitude, body.longitude] }
    return data;
}
//***** ///// *****//

module.exports = app;