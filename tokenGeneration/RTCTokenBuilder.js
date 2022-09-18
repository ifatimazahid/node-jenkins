const RtcTokenBuilder = require("./RtcTokenBuilder2").RtcTokenBuilder;
const RtcRole = require("./RtcTokenBuilder2").Role;
const dotenv = require("dotenv").config();

const appID = process.env.APP_ID;
const appCertificate = process.env.APP_CERTIFICATE;
const role = RtcRole.PUBLISHER;

const expirationInSeconds = process.env.EXPIRATION_IN_SECONDS;

async function generateToken(uid, channel, number) {

    try {
      const token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channel, uid, role, expirationInSeconds, expirationInSeconds)
      console.log(token, 'yyyyyyy')
      return token;
    } catch (ex) {
      console.log(ex, "exception");
      return;
    }
}

exports.generateToken = generateToken;
