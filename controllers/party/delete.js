
//***** Modules goes here *****//
const express = require('express');
const { PartyData } = require('../../Models/party.model');


const app = express();

app.delete('/', async (req, res) => {

    if(req.query.userId == null || req.query.partyId == null){
        var err = {
            success: false,
            msg: 'Please enter valid User AND Party ID!'
        };
        res.status(500).send(err);
        return;
    }

    try {

        const alreadyDeleted = await PartyData.findOne({
            "members.userId": req.query.userId,
            "members.isOwner": true,
            _id: req.query.partyId
        });

        if(alreadyDeleted == null){
            var err = {
                success: false,
                msg: 'This party does not exist'
            };
            res.status(500).send(err);
            return;
        }

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
