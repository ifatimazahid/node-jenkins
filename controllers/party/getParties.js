
//***** Modules goes here *****//
const express = require('express');
const { number } = require('joi');
const { PartyData } = require('../../Models/party.model');
const { UserData } = require('../../Models/user.model');

const app = express();

app.get('/', async (req, res) => {

  try {
    let getParties;
    if (req.query.userId != null && req.query.partyId == null) {

      const getUser = await UserData.findOne({ _id: req.query.userId });
      getParties = await PartyData.find({ "members.phone": getUser.mobile })
        .sort({ createdDate: -1 })
    }
    else if (req.query.userId == null && req.query.partyId != null) {

      let phoneNumbers = [];
      party = await PartyData.findOne({ _id: req.query.partyId });

      phoneNumbers = party.members.map((m) => {
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
        party.members.forEach((memberData) => {
          if (userData.mobile == memberData.phone) {
            let a = JSON.parse(JSON.stringify(userData));
            a.isOwner = memberData.isOwner;
            newObj = a;
          }
        })
        return newObj;
      })

      getParties = checkUser;

    }
    else {
      var error = {
        success: false,
        msg: 'Please enter User OR Party ID',
        data: ''
      };
      res.status(500).send(error);
      return;
    }

    if (getParties.length == 0) {
      var error = {
        success: false,
        msg: 'No Party found!',
        data: ''
      };
      res.status(500).send(error);
      return;
    }

    var success = {
      success: true,
      msg: 'User Parties Found!',
      data: getParties
    };
    res.send(success);
    return;
  } catch (err) {
    return { success: false, error: err, data: null };
  }
})

module.exports = app;
