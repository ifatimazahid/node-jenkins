
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
    if (req.query.partyId != null) {

      await updateLocation(req)
        .then(async (rest) => {

          let phoneNumbers = [];
          phoneNumbers = rest.members.map((m) => {
            return m.phone;
          })

          const user = await UserData.find({
            mobile: {
              $in: phoneNumbers
            }
          })
            .select('_id firstName lastName email mobile profile_img');

          const checkUser = user.map((userData) => {
            let newObj = {};
            rest.members.forEach((memberData) => {
              if (userData.mobile == memberData.phone) {
                let a = JSON.parse(JSON.stringify(userData));
                a.isOwner = memberData.isOwner;
                a.latitude = memberData.latitude;
                a.longitude = memberData.longitude;
                newObj = a;
              }
            })
            return newObj;
          })

          getParties = checkUser;
        })
        .catch((exc) => {
          res.status(500).send(exc);
          return;
        })
    }
    else {
      const party = await PartyData.find({ "members.phone": user.mobile });


      const checkUser =
        // party.map((part) => {
        //   let newPartyObj = {};
         user.map((userData) => {
            let newObj = {};
            party.members.forEach((memberData) => {
              if (userData.mobile == memberData.phone) {
                let a = JSON.parse(JSON.stringify(userData));
                a.isOwner = memberData.isOwner;
                a.latitude = memberData.latitude;
                a.longitude = memberData.longitude;
                newObj = a;
              }
            })
            return newObj;
          })

        //   console.log(newPartyObj, '::::::::::::::')
        //   return newPartyObj;
        // })

      getParties = checkUser;
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

    var success = {
      success: true,
      msg: 'Party Found!',
      data: getParties
    };
    res.send(success);
    return;

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
