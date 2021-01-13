
//***** Modules goes here *****//
const express = require('express');
const { PartyData } = require('../../Models/party.model');
const { UserData } = require('../../Models/user.model');
const auth = require('../../middleware/auth');
const Joi = require('joi');

const app = express();

app.get('/', auth, async (req, res) => {
  const { error } = validateData(req.body);

  var errors;
  if (error) {
    errors = {
      success: false,
      msg: error.name,
      data: error.details[0].message
    };
    res.status(403).send(errors);
    return;
  }

  try {
    let getParties;
    const user = await UserData.findOne({ _id: req.query.userId });
    if (req.query.userId != null && req.query.partyId == null) {
      getParties = await PartyData.find({ "members.phone": user.mobile })
        .sort({ createdDate: -1 });
    }
    else if (req.query.userId == null && req.query.partyId != null) {

      getParties = await PartyData.findOne({ _id: req.query.partyId })
        .sort({ createdDate: -1 })

    }
    else {
      errors = {
        success: false,
        msg: 'Please enter User OR Party ID',
        data: ''
      };
      res.status(500).send(errors);
      return;
    }

    if (getParties.length == 0) {
      errors = {
        success: false,
        msg: 'No Party found!',
        data: ''
      };
      res.status(500).send(errors);
      return;
    }

    await updateLocation(req)
      .then((rest) => {
       getParties = rest;
        var success = {
          success: true,
          msg: 'Party Found!',
          data: getParties
        };
        res.send(success);
        return;
      })
      .catch((exc) => {
        res.status(500).send(exc);
        return;
      })

  } catch (err) {
    return { success: false, error: err, data: null };
  }
})

async function updateLocation(req) {
  return new Promise(async (resolve, reject) => {

    const getUser = await UserData.findOne({ _id: req.user._id });

    let findFromObj = {};
    if (req.query.partyId) {
      findFromObj = {
        _id: req.query.partyId,
        "members.phone": getUser.mobile
      }
    }
    else {
      findFromObj = {
        "members.phone": getUser.mobile,
        "members.status": 1 //accepted parties only
      }
    }

    console.log(findFromObj, 'LLLLLLLLLLLL')

    await PartyData.findOneAndUpdate(findFromObj,
      {
        $set: {
          "members.$.latitude": req.body.latitude,
          "members.$.longitude": req.body.longitude,
        }
      },
      async (err, result) => {
        if (err) {
          reject(err);
        }

        const getUpdatedParty = await PartyData.findOne({ _id: result._id });
        resolve(getUpdatedParty);
      })
  });
}

function validateData(body) {
  const schema = Joi.object().keys({
    latitude: Joi.string().required(),
    longitude: Joi.string().required()
  });
  return Joi.validate(body, schema)
}


module.exports = app;
