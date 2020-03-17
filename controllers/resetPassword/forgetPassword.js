//***** Modules goes here *****//
var _ = require('lodash');
const express = require('express');
const bcrypt = require('bcryptjs');
const { UserData } = require('../../Models/user.model');
const { Token } = require('../../Models/token.user.model');
const nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const app = express();

sgMail.setApiKey('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');
app.post('/', function (req, res, next) {
    console.log(req.body)
    async.waterfall([
        function (done) {
            crypto.randomBytes(2, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            UserData.findOne({ email: req.body.email }, function (err, user) {
                if (!user) {
                    res.send({status:false, msg:'error No account with that email address exists.'});
                    //   return res.redirect('/forgot');
                }
                else if (user) {

                    // res.status(200).send("found");
                    var smtpTransport = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'abdulahadnara1996@gmail.com',
                            pass: 'qadirbhai12'
                        }
                    });
                    var mailOptions = {
                        to: req.body.email,
                        from: 'info@smartlybiz.com',
                        subject: 'smartlybiz Password Reset',
                        text: 'Your code for reset password is ==> ' + token,
                        html: '<strong>'+token + '</strong>',
                    };

                    // smtpTransport.sendMail
                    sgMail.send(mailOptions, function (err) {

                        if (err) {
                            console.log(err)
                            res.status(403).send(err);
                        }
                        else {
                            createToken({
                                _userId: user._id,
                                token: token,
                                createdAt: Date.now()
                            }).then((response => {
                                if (response === 500) {
                                    res.status(403).send("error");
                                }
                                else if (response === 200) {
                                    res.send({ status: true, msg:"check your email "+ req.body.email, userId: user._id });
                                }
                            }));
                        }



                    });
                }


            });
        },
    ], function (err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
});

async function createToken(token) {
    // return new Promise((res)=> {
    const gettoken = new Token(token);

    try {
        const result = await gettoken.save();
    }
    catch (ex) {
        console.log('catch');
        console.log(ex.code);
        return (500);
    }
    return (200);
    // });
}

module.exports = app;