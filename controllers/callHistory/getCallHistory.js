
//***** Modules goes here *****//
const express = require('express');
const { MessageData } = require('../../Models/mesage.model');
const Joi = require('joi');


const app = express();

app.get('/', async (req, res) => {
    const { error } = validateApiData(req.query);

    if (error) {
        var errors = {
            success: false,
            msg: error.name,
            data: error.details[0].message
        };
        res.status(403).send(errors);
        return;
    }

    const callHistory = await getUserCallHisory(req.query.userId)

    var success = {
        success: true,
        msg: 'Call History Found',
        data: callHistory
      };
      res.send(success);
})

async function getUserCallHisory(userId) {
    const allPlaces = await MessageData.find({userId, $or: [{type: 'audioCall'}, {type: 'videoCall'}]})
    .populate({
        path: 'roomId',
        model: 'chatRooms'
    });
    console.log("getAllHelp -> allPlaces", allPlaces)
    return allPlaces
}

function validateApiData(req) {
    const schema = Joi.object().keys({
        userId: Joi.string().required(),
    });
    return Joi.validate(req, schema)
}

module.exports = app;
