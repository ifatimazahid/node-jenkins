
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
    const user = await UserData.findOne({ _id: req.query.userId })
      .select('_id firstName lastName email mobile profile_img');

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
                let member_dis = distance(
                  req.body.latitude,
                  req.body.longitude,
                  memberData.latitude,
                  memberData.longitude
                );

                let party_dis = distance(
                  req.body.latitude,
                  req.body.longitude,
                  rest.latitude,
                  rest.longitude
                );
                a.party_distance = party_dis ? party_dis + " kms" : 'No location provided',
                  a.member_distance = member_dis ? member_dis + " kms" : 'No location provided';
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

      let nearBy = [];

      // party.map((party, index) => {

      //   party.members.forEach((memberData) => {
      //       memberData.latitude;
      //       memberData.longitude;
      //   })

      //   let dis = distance(
      //     req.body.latitude,
      //     req.body.longitude,
      //     data.latitude,
      //     data.longitude
      //   );
      //   if (dis <= 10) {
      //     nearBy.push(data);
      //   }
      // });

      // console.log(nearBy, 'LLLLLLLLLLL')

      const checkUser =
        party.map((part) => {
          let newObj = {};
          part.members.forEach((memberData) => {
            if (user.mobile == memberData.phone) {
              let a = JSON.parse(JSON.stringify(user));
              a.isOwner = memberData.isOwner;
              a.latitude = memberData.latitude;
              a.longitude = memberData.longitude;

              let member_dis = distance(
                req.body.latitude,
                req.body.longitude,
                memberData.latitude,
                memberData.longitude
              );

              a.member_distance = member_dis ? member_dis + " kms" : 'No location provided';
              let party_dis = distance(
                req.body.latitude,
                req.body.longitude,
                part.latitude,
                part.longitude
              );
              a.party_distance = party_dis ? party_dis + " kms" : 'No location provided',

                newObj = a;
            }
          })
          return newObj;
        })

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

const distance = (lat1, lon1, lat2, lon2) => {
  var R = 6371; // km (change this constant to get miles)
  var dLat = ((lat2 - lat1) * Math.PI) / 180;
  var dLon = ((lon2 - lon1) * Math.PI) / 180;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  return Math.round(d);
};


module.exports = app;
