const dotenv = require('dotenv').config();

var rtc = {
    localAudioTrack: null,
    localVideoTrack: null,
};

const appId = process.env.APP_ID
const role = "host"
const channel = process.env.CHANNEL_NAME;

async function startBasicCall(token, uid) {

    const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
    client.setClientRole(role);

    console.log('After creating client')

    await client.join(appId, channel, token, uid);
    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    await client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
    const localPlayerContainer = document.createElement("div");
    localPlayerContainer.id = uid;
    localPlayerContainer.style.width = "640px";
    localPlayerContainer.style.height = "480px";
    document.body.append(localPlayerContainer);
    rtc.localVideoTrack.play(localPlayerContainer);

    console.log("publish success!");

    client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        console.log("subscribe success");

        if (mediaType === "video") {
            const remoteVideoTrack = user.videoTrack;
            const remotePlayerContainer = document.createElement("div");
            remotePlayerContainer.textContent = "Remote user " + user.uid.toString();
            remotePlayerContainer.style.width = "640px";
            remotePlayerContainer.style.height = "480px";
            document.body.append(remotePlayerContainer);
            remoteVideoTrack.play(remotePlayerContainer);

        }

        if (mediaType === "audio") {
            const remoteAudioTrack = user.audioTrack;
            remoteAudioTrack.play();
        }

        client.on("user-unpublished", user => {
            const remotePlayerContainer = document.getElementById(user.uid);
            remotePlayerContainer.remove();
        });

    });

    // When token-privilege-will-expire occurs, fetches a new token from the server and call renewToken to renew the token.
    client.on("token-privilege-will-expire", async function () {
        let token = await generateToken(uid, channel, 1);
        await client.renewToken(token);
    });

    // When token-privilege-did-expire occurs, fetches a new token from the server and call join to rejoin the channel.
    client.on("token-privilege-did-expire", async function () {
        console.log("Fetching the new Token")
        let token = await generateToken(uid, channel, 1);
        console.log("Rejoining the channel with new Token")
        await rtc.client.join(appId, channel, token, uid);
    });

}

exports.startBasicCall = startBasicCall;