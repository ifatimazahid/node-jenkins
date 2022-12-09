const express = require('express');
const Joi = require('joi');
const { Sessions, Courses } = require('../../Models/course');
const { generateToken } = require('../../tokenGeneration/RTCTokenBuilder')
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv").config();
const { startBasicCall } = require('../../clients/client.js');

const app = express();

app.post('/add', async (req, res) => {
    const { error } = validateData(req.body);
    if (error) {
        var errors = {
            success: false,
            msg: error.name,
            data: error.details[0].message
        };
        res.status(403).send(errors);
        return;
    }

    // if(req.body.liveSession == true){
    //     const uid = uuidv4();
    //     const channel = process.env.CHANNEL_NAME;

    //     generateToken(uid, channel, 1)
    //     .then(token => {
    //         console.log(token, 'LLLL')
    //         startBasicCall(token, uid)
    //     })
    //     .catch(ex => console.log(ex, '////////'))
    // }

    // let course = await addCourse(req.body)
    // let session = await addSession(req.body)
    var success = {
        success: true,
        msg: 'Course created successfully',
        data: true //{course: course, session: session}
      };
      res.send(success);
});

function validateData(body) {
    const schema = Joi.object().keys({
        courseId: Joi.string().required(),
        courseName: Joi.string().required(),
        courseSubject: Joi.string().required(),
        facultyName: Joi.string().required(),
        liveSession: Joi.boolean().required(),
        isPaid: Joi.boolean().required(),
        shortDescription: Joi.string().required(),
        numberOfSessions: Joi.number().required(),
        sessionId: Joi.string().required(),
        sessionDate: Joi.string().required(),
        sessionTime: Joi.string().required(),
    });
    return schema.validate(body)
}

async function addCourse(body) {
    const course = new Courses(body);
    try {
        var data = { courseId: body.courseId, courseName: body.courseName, courseSubject: body.courseSubject, facultyName: body.facultyName, liveSession: body.liveSession, isPaid: body.isPaid, shortDescription: body.shortDescription, numberOfSessions: body.numberOfSessions }
        const result = await course.save(data);
        console.log(result, "Result")
        return result
    }
    catch (ex) {
        console.log(ex, 'exception')
        return;
    }
}

async function addSession(body) {
    const session = new Sessions(body);
    try {
        var data = { courseId: body.courseId, sessionId: body.sessionId, sessionDate: body.sessionDate, sessionTime: body.sessionTime }
        const result = await session.save(data);
        console.log(result, "Result")
        return result
    }
    catch (ex) {
        console.log(ex, 'exception')
        return;
    }
}

// async function generateToken(body) {

   //generate token with uuid, appid, certificateid & pass to token gen 
   //get the token back & create live session link & start live stream
   //send to agora api sdk
// }

module.exports = app;