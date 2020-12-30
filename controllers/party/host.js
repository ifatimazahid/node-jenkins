
//***** Modules goes here *****//
const express = require('express');
const { UserData } = require("../../Models/user.model");

const Joi = require('joi');
const { PartyData } = require('../../Models/party.model');


const app = express();

app.post('/', async (req, res) => {
  const { error } = validateApiData(req.body);

  if (error) {
    var errors = {
      success: false,
      msg: error.name,
      data: error.details[0].message
    };
    res.status(403).send(errors);
    return;
  }

  const hostAParty = await hostParty(req)

  var success = {
    success: true,
    msg: 'Party created successfully!',
    data: hostAParty
  };
  res.send(success);
  return;
})

async function hostParty(req) {
  return new Promise((resolve, reject) => {

    try {
      const party = new PartyData(req.body);
      const result = party.save();
      resolve(result);
    }
    catch (err) {
      reject(err);
    }
  })
}

function validateApiData(body) {
  const schema = Joi.object().keys({
    event_name: Joi.string().required(),
    members: Joi.array().items(
      Joi.object({
        userId: Joi.string().required(),
        latitude: Joi.string().required(),
        longitude: Joi.string().required(),
        isOwner: Joi.boolean().required()
      })
    )
  });
  return Joi.validate(body, schema)
}

module.exports = app;
