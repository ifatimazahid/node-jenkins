//***** Modules goes here *****//
const bcrypt = require('bcryptjs');
const express = require('express');
const Joi = require('joi');
const { placeData } = require('../../Models/places.model');
const { yourplaceData } = require('../../Models/yourPlaces.model');

const auth = require('../../middleware/auth');

const app = express();
//***** ///// *****//



//***** Post Request for Login *****//
app.post('/', auth, (req, res) => {

    const { error } = validateData(req.body);

    if (error) {
        var errors = {
            success: false,
            msg: error.name,
            data: error.details[0].message
        };
        res.status(403).send(response);
        return;
    }
    var data = { title: req.body.placeName, location: [req.body.latitude, req.body.longitude] }
    createPlace(data).then(result => {
        var myPlaceData = { _userId: req.user._id, _placeId: result._id, title: req.body.title }
        checkMyPlace(myPlaceData).then(response=>{
            if(response === 500){
                               res.status(403).send({
                    success: false,
                    msg: 'Place Already Exist.',
                    data: ''
                }) 
                return;
            }
     createMyplace(myPlaceData).then((re) => {
 
        }).catch(err => { })
        }).catch(err=>{})
   
    }).catch(err => {

    })
    res.status(200).send(
        {
            success: true,
            msg: 'Place Add Successfully',
            data: req.body
        }
    )

});
//***** ///// *****//

//***** User login data validation function *****//

function validateData(req) {
    const schema = Joi.object().keys({
        title: Joi.string().min(4).max(30).required(),
        placeName: Joi.string().min(4).max(30).required(),
        latitude: Joi.string().min(4).max(30).required(),
        longitude: Joi.number().required(),
    });
    return Joi.validate(req, schema)
}
//***** ///// *****//

//***** Find User and return function *****//

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
async function checkMyPlace(body){
    const result = await yourplaceData.findOne({ _userId:body._userId,_placeId:body._placeId}); 
    if(!result){
    return (200)
    } 
    return (500)
}

//***** ///// *****//

module.exports = app;