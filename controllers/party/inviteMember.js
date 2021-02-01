
//***** Modules goes here *****//
const express = require('express');
const { PartyData } = require('../../Models/party.model');
const { UserData } = require('../../Models/user.model');
const auth = require('../../middleware/auth');
const fetch = require('node-fetch');
const client = require("twilio")(process.env.TWILIO_LIVE_accountSid, process.env.TWILIO_LIVE_authToken);
require('dotenv').config()

const app = express();

app.put('/', auth, async (req, res) => {

    if (req.body.partyId == null) {
        var err = {
            success: false,
            msg: 'Please enter valid Party ID!'
        };
        res.status(500).send(err);
        return;
    }

    if (req.body.phone == null) {
        var err = {
            success: false,
            msg: 'Please enter member Phone number!'
        };
        res.status(500).send(err);
        return;
    }

    const user = await UserData.findOne({ mobile: req.body.phone });

    if (user == null) {
        var err = {
            success: false,
            msg: 'Invalid Member phone!'
        };
        res.status(500).send(err);
        return;
    }

    await inviteMember(req)
        .then((party) => {
            inviteNotification(user, party)
                .then(() => {
                    // .then(() => {
                    var success = {
                        success: true,
                        msg: 'Member invited successfully!',
                        data: party
                    };
                    res.send(success);
                    return;
                    // })
                })
        })
        .catch((ex) => {
            var err = {
                success: false,
                msg: ex
            };
            res.send(err);
            return;
        });

});


async function inviteMember(req) {
    return new Promise(async (resolve, reject) => {
        const user = await UserData.findOne({ _id: req.user._id });

        const party = await PartyData.findOne({
            _id: req.body.partyId,
            "members.phone": user.mobile,
            "members.isOwner": true
        });

        if (party == null) {
            var msg = 'Party doesnt exist OR you do not have permission to update it!';
            reject(msg);
            return;
        }

        const alreadyExist = await PartyData.findOne({
            _id: req.body.partyId,
            "members.phone": req.body.phone
        });

        if (alreadyExist != null) {
            var msg = 'This member has already been invited.'
            reject(msg);
            return;
        }

        inviteSMS(req)
            .then(async () => {
                let new_member = {
                    phone: req.body.phone,
                    isOwner: false,
                    status: 0  //pending
                };

                party.members.push(new_member);

                await PartyData.findByIdAndUpdate(
                    req.body.partyId,
                    party,
                    async (err, result) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        const party = await PartyData.findOne({ _id: result._id });
                        resolve(party);
                    });
            })
            .catch((e) => {
                reject(e);
                return;
            });
    })
}


const inviteNotification = async (user, party) => {
    const token = user.gcm_id;
    const data = {
        title: 'Party Invitation',
        msg: 'You are invited to party with Us! Click to see details'
    }

    delay(token, data, party);
}

const delay = (token, data, party) => {
    var key = 'AAAAe6315E8:APA91bEGumEyzyH6nUeCUWPl6I08niXGRN7mEbhrzf7T2ivyoACP7CA5kV2IxDw6sxNF0_jPgCUeFN6g5sfaNXQBRRBQowiTkHjs3C-m2EOUECLG-qsqU9C0Wpr3Cl2kwSqmY2O8Ui40';
    return new Promise((resolve, reject) => {
        fetch('https://fcm.googleapis.com/fcm/send', {
            'method': 'POST',
            'headers': {
                'Authorization': 'key=' + key,
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify({
                'to': token, 'notification': data, 'data': {
                    type: 'party',
                    party,
                },
                'priority': "high",
                time_to_live: 5,
                content_available: true
            }),
        }).then(function (response) {
            console.log('SendNotification', response, 'response')
            resolve()
        }).catch(function (error) {
            console.log(error, 'error')
            reject(error)
        });
    })
}

async function inviteSMS(req) {
    return new Promise((resolve, reject) => {
        let message_body = 'You have been invited to a party! Follow this link to see details:'
        client.messages.create({
            to: req.body.phone,
            from: process.env.FROM_NUMBER,
            body: message_body
        })
            .then(messages => {
                console.log(messages)
                resolve(messages)
            })
            .catch((e) => {
                reject(e.message);
                return;
            });
    });
}

module.exports = app;
