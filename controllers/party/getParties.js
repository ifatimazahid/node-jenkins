
//***** Modules goes here *****//
const express = require('express');
const { PartyData } = require('../../Models/party.model');


const app = express();

app.get('/', async (req, res) => {

  try {
    let getParties;
    if (req.query.userId != null && req.query.partyId == null) {
      getParties = await PartyData.find({ "members.userId": req.query.userId })
        .sort({ createdDate: -1 })
        .populate({
          path: "members.userId",
          model: "users"
        });
    }
    else if (req.query.userId == null && req.query.partyId != null) {
      getParties = await PartyData.find({ _id: req.query.partyId })
        .sort({ createdDate: -1 })
        .populate({
          path: "members.userId",
          model: "users"
        });
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

    if (getParties.length <= 0) {
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
