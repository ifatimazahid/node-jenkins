
//***** Modules goes here *****//
const express = require('express');
const { MessageData } = require('../../Models/mesage.model');
const { ConversationData } = require('../../Models/conversation.model');
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

    let allPlaces = await ConversationData.find({[userId]: true})
    allPlaces = allPlaces.map(val =>  val._id.toString() )
    let data = await MessageData.find({
        roomId: {  $in: allPlaces },
        $or: [{type: 'audioCall'}, {type: 'videoCall'}]
    })
    return data
}

function validateApiData(req) {
    const schema = Joi.object().keys({
        userId: Joi.string().required(),
    });
    return Joi.validate(req, schema)
}

module.exports = app;
