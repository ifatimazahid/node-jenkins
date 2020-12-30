
//***** Modules goes here *****//
const express = require('express');
const { PartyData } = require('../../Models/party.model');


const app = express();

app.delete('/', async (req, res) => {

    try {
        await PartyData.findOneAndDelete({
            "members.userId": req.query.userId,
            "members.isOwner": true,
            _id: req.query.partyId
        });

        var success = {
            success: true,
            msg: 'Party deleted successfully!'
        };
        res.send(success);
        return;

    } catch (err) {
        return { success: false, error: err, data: null };
    }
})

module.exports = app;
